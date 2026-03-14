import * as THREE from 'three';

/**
 * CharacterLoader - Gestiona personajes 2D en el mundo 3D
 */
/**
 * Sistema de carga de personajes 2D como sprites en el mundo 3D
 * @version 2.0 - Fixed position.clone() errors
 */
class CharacterLoader {
    constructor(scene) {
        this.scene = scene;
        this.characters = [];
        this.textureLoader = new THREE.TextureLoader();
        console.log('🎭 CharacterLoader v2.0 inicializado');
    }

    /**
     * Carga un personaje 2D como sprite en el mundo 3D
     * @param {string} imagePath - Ruta de la imagen del personaje
     * @param {Object} position - Posición {x, y, z}
     * @param {Object} options - Opciones adicionales
     */
    async loadCharacter(imagePath, position, options = {}) {
        // Validación robusta de posición
        console.log('🔍 Validando posición en loadCharacter:', position);
        const safePosition = {
            x: (position && typeof position.x === 'number') ? position.x : 0,
            y: (position && typeof position.y === 'number') ? position.y : 0,
            z: (position && typeof position.z === 'number') ? position.z : 0
        };
        console.log('✅ Posición segura creada:', safePosition);

        const defaultOptions = {
            scale: { x: 2, y: 3, z: 1 },
            rotation: { x: 0, y: 0, z: 0 },
            name: 'character_' + Date.now(),
            type: 'npc',
            animated: false,
            description: 'Personaje del juego'
        };

        const config = { ...defaultOptions, ...options };

        return new Promise((resolve, reject) => {
            try {
                console.log('🔄 Iniciando carga de textura:', imagePath);
                // Cargar textura del personaje
                this.textureLoader.load(
                    imagePath,
                    (texture) => {
                        try {
                            console.log('✅ Textura cargada exitosamente');
                            // Crear material con la textura
                            const material = new THREE.SpriteMaterial({
                                map: texture,
                                transparent: true,
                                alphaTest: 0.5
                            });

                            // Crear sprite
                            const sprite = new THREE.Sprite(material);
                            
                            // Aplicar posición segura
                            sprite.position.set(safePosition.x, safePosition.y + 1.5, safePosition.z);
                            console.log('✅ Posición aplicada al sprite');
                            
                            // Aplicar escala
                            sprite.scale.set(
                                config.scale.x,
                                config.scale.y,
                                config.scale.z
                            );

                            // Aplicar rotación
                            sprite.rotation.set(
                                config.rotation.x,
                                config.rotation.y,
                                config.rotation.z
                            );
                            
                            // Añadir metadatos con posición segura - SIN CLONE
                            const originalPositionVector = new THREE.Vector3(safePosition.x, safePosition.y, safePosition.z);
                            console.log('✅ Vector3 originalPosition creado:', originalPositionVector);
                            
                            sprite.userData = {
                                id: config.name,
                                type: config.type,
                                description: config.description,
                                originalPosition: originalPositionVector,
                                imagePath: imagePath,
                                animated: config.animated,
                                interactable: config.interactable || false
                            };
                            
                            // Añadir a la escena y al registro
                            this.scene.add(sprite);
                            this.characters.push(sprite);
                            
                            console.log(`✅ Personaje cargado: ${config.name} en (${safePosition.x}, ${safePosition.y}, ${safePosition.z})`);
                            resolve(sprite);
                        } catch (error) {
                            console.error('❌ Error al procesar textura cargada:', error);
                            reject(error);
                        }
                    },
                    undefined,
                    (error) => {
                        console.error('❌ Error al cargar textura del personaje:', error);
                        reject(error);
                    }
                );
            } catch (error) {
                console.error('❌ Error general en loadCharacter:', error);
                reject(error);
            }
        });
    }

    /**
     * Carga múltiples personajes desde una configuración
     * @param {Array} charactersConfig - Array de configuraciones de personajes
     */
    async loadMultipleCharacters(charactersConfig) {
        const loadPromises = charactersConfig.map(config => 
            this.loadCharacter(config.imagePath, config.position, config.options)
        );
        
        try {
            const results = await Promise.all(loadPromises);
            console.log(`✅ ${results.length} personajes cargados exitosamente`);
            return results;
        } catch (error) {
            console.error('❌ Error al cargar múltiples personajes:', error);
            throw error;
        }
    }

    /**
     * Hace que un personaje mire hacia el jugador
     * @param {THREE.Sprite} character - Personaje que debe mirar
     * @param {THREE.Vector3} playerPosition - Posición del jugador
     */
    makeCharacterLookAtPlayer(character, playerPosition) {
        const direction = new THREE.Vector3()
            .subVectors(playerPosition, character.position)
            .normalize();
        
        const angle = Math.atan2(direction.x, direction.z);
        character.material.rotation = angle;
    }

    /**
     * Actualiza todos los personajes para que miren al jugador
     * @param {THREE.Vector3} playerPosition - Posición del jugador
     */
    updateCharactersFacingPlayer(playerPosition) {
        for (const character of this.characters) {
            if (character.userData.type === 'npc') {
                this.makeCharacterLookAtPlayer(character, playerPosition);
            }
        }
    }

    /**
     * Añade animación de flotación a un personaje
     * @param {THREE.Sprite} character - Personaje a animar
     * @param {number} amplitude - Amplitud de la flotación
     * @param {number} speed - Velocidad de la flotación
     */
    addFloatingAnimation(character, amplitude = 0.2, speed = 2) {
        character.userData.floating = {
            amplitude: amplitude,
            speed: speed,
            originalY: character.position.y,
            time: 0
        };
        character.userData.animated = true;
    }

    /**
     * Actualiza animaciones de los personajes
     * @param {number} deltaTime - Tiempo delta
     */
    updateAnimations(deltaTime) {
        for (const character of this.characters) {
            if (character.userData.floating) {
                const floating = character.userData.floating;
                floating.time += deltaTime;
                
                // Animación de flotación sinusoidal
                character.position.y = floating.originalY + 
                    Math.sin(floating.time * floating.speed) * floating.amplitude;
            }
        }
    }

    /**
     * Detecta si el jugador está cerca de un personaje
     * @param {THREE.Vector3} playerPosition - Posición del jugador
     * @param {number} distance - Distancia de detección
     * @returns {Array} - Array de personajes cercanos
     */
    getNearbyCharacters(playerPosition, distance = 5) {
        const nearby = [];
        
        for (const character of this.characters) {
            const distanceToPlayer = character.position.distanceTo(playerPosition);
            if (distanceToPlayer <= distance) {
                nearby.push({
                    character: character,
                    distance: distanceToPlayer
                });
            }
        }
        
        return nearby.sort((a, b) => a.distance - b.distance);
    }

    /**
     * Interactúa con un personaje cercano
     * @param {THREE.Vector3} playerPosition - Posición del jugador
     */
    interactWithNearbyCharacter(playerPosition) {
        const nearby = this.getNearbyCharacters(playerPosition, 2);
        
        if (nearby.length > 0) {
            const character = nearby[0].character;
            if (character.userData.interactable) {
                this.onCharacterInteract(character.userData);
                return true;
            }
        }
        return false;
    }

    /**
     * Evento llamado cuando se interactúa con un personaje
     * @param {Object} characterData - Datos del personaje
     */
    onCharacterInteract(characterData) {
        console.log(`🤝 Interactuando con: ${characterData.description}`);
        
        // Ejemplo de diálogo
        if (window.showCharacterDialogue) {
            window.showCharacterDialogue(characterData);
        }
    }

    /**
     * Elimina un personaje
     * @param {THREE.Sprite} character - Personaje a eliminar
     */
    removeCharacter(character) {
        this.scene.remove(character);
        const index = this.characters.indexOf(character);
        if (index > -1) {
            this.characters.splice(index, 1);
        }
        console.log(`🗑️ Personaje eliminado: ${character.userData.id}`);
    }

    /**
     * Limpia todos los personajes
     */
    clearAllCharacters() {
        for (const character of this.characters) {
            this.scene.remove(character);
        }
        this.characters = [];
        console.log('🧹 Todos los personajes eliminados');
    }

    /**
     * Obtiene estadísticas del CharacterLoader
     */
    getStats() {
        return {
            totalCharacters: this.characters.length,
            npcCount: this.characters.filter(c => c.userData.type === 'npc').length,
            animatedCount: this.characters.filter(c => c.userData.animated).length,
            interactableCount: this.characters.filter(c => c.userData.interactable).length
        };
    }
}

// Exportar la clase
export { CharacterLoader };

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

/**
 * EntityManager - Gestiona entidades 3D, colisiones e inventario
 */
class EntityManager {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        this.loader = new GLTFLoader();
        this.entities = [];
        this.inventario = [];
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        
        // Configurar eventos de clic
        this.setupClickEvents();
    }

    /**
     * Carga una entidad 3D desde un archivo GLTF
     * @param {string} path - Ruta del archivo GLTF
     * @param {Object} position - Posición {x, y, z}
     * @param {Object} options - Opciones adicionales
     */
    async loadEntity(path, position, options = {}) {
        // Validación robusta de posición
        const safePosition = {
            x: (position && typeof position.x === 'number') ? position.x : 0,
            y: (position && typeof position.y === 'number') ? position.y : 0,
            z: (position && typeof position.z === 'number') ? position.z : 0
        };

        const defaultOptions = {
            scale: { x: 1, y: 1, z: 1 },
            rotation: { x: 0, y: 0, z: 0 },
            name: 'entity_' + Date.now(),
            type: 'static',
            collectible: false,
            description: 'Entidad 3D'
        };

        const config = { ...defaultOptions, ...options };

        return new Promise((resolve, reject) => {
            try {
                console.log(`🔄 Intentando cargar entidad: ${path}`);
                
                // Validación básica del path
                if (!path || typeof path !== 'string') {
                    throw new Error('Path inválido para cargar entidad');
                }

                this.loader.load(
                    path,
                    (gltf) => {
                        try {
                            const entity = gltf.scene;
                            
                            // Aplicar posición segura
                            entity.position.set(safePosition.x, safePosition.y, safePosition.z);
                            
                            // Aplicar escala
                            entity.scale.set(
                                config.scale.x,
                                config.scale.y,
                                config.scale.z
                            );

                            // Aplicar rotación
                            entity.rotation.set(
                                config.rotation.x,
                                config.rotation.y,
                                config.rotation.z
                            );

                            // Configurar sombras
                            entity.traverse((child) => {
                                if (child.isMesh) {
                                    child.castShadow = true;
                                    child.receiveShadow = true;
                                }
                            });
                            
                            // Añadir metadatos con posición segura
                            entity.userData = {
                                id: config.name,
                                type: config.type,
                                collectible: config.collectible,
                                description: config.description,
                                originalPosition: new THREE.Vector3(safePosition.x, safePosition.y, safePosition.z),
                                boundingBox: new THREE.Box3().setFromObject(entity)
                            };
                            
                            // Añadir a la escena y al registro
                            this.scene.add(entity);
                            this.entities.push(entity);
                            
                            console.log(`✅ Entidad cargada: ${config.name} en (${safePosition.x}, ${safePosition.y}, ${safePosition.z})`);
                            resolve(entity);
                        } catch (error) {
                            console.error('❌ Error al procesar GLTF cargado:', error);
                            reject(error);
                        }
                    },
                    undefined,
                    (error) => {
                        console.error(`❌ Error al cargar entidad: ${path}`, error);
                        reject(error);
                    }
                );
            } catch (error) {
                console.error('❌ Error general en loadEntity:', error);
                reject(error);
            }
        });
    }

    /**
     * Configura eventos de clic para interacción con entidades
     */
    setupClickEvents() {
        window.addEventListener('click', (event) => {
            this.handleClick(event);
        });

        window.addEventListener('mousemove', (event) => {
            // Actualizar posición del mouse para hover effects
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        });
    }

    /**
     * Maneja eventos de clic en entidades
     * @param {Event} event - Evento de clic
     */
    handleClick(event) {
        // Actualizar raycaster con posición del mouse
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        // Obtener intersecciones con entidades
        const intersects = this.raycaster.intersectObjects(this.entities, true);
        
        if (intersects.length > 0) {
            const clickedObject = intersects[0].object;
            const entity = this.findEntityParent(clickedObject);
            
            if (entity && entity.userData.collectible) {
                this.collectEntity(entity);
            } else if (entity) {
                this.interactWithEntity(entity);
            }
        }
    }

    /**
     * Encuentra el padre de una entidad en el árbol de objetos
     * @param {THREE.Object3D} child - Objeto hijo
     * @returns {THREE.Object3D|null} - Entidad padre o null
     */
    findEntityParent(child) {
        let current = child;
        while (current && current.parent) {
            if (this.entities.includes(current)) {
                return current;
            }
            current = current.parent;
        }
        return null;
    }

    /**
     * Recolecta una entidad y la añade al inventario
     * @param {THREE.Object3D} entity - Entidad a recolectar
     */
    collectEntity(entity) {
        const item = {
            id: entity.userData.id,
            type: entity.userData.type,
            description: entity.userData.description,
            collectedAt: new Date().toISOString(),
            position: new THREE.Vector3(
                entity.position.x || 0,
                entity.position.y || 0,
                entity.position.z || 0
            )
        };

        // Añadir al inventario
        this.inventario.push(item);
        
        // Eliminar de la escena y del registro
        this.scene.remove(entity);
        const index = this.entities.indexOf(entity);
        if (index > -1) {
            this.entities.splice(index, 1);
        }

        console.log(`🎒 Objeto recolectado: ${item.description}`);
        console.log(`📦 Inventario actual: ${this.inventario.length} objetos`);

        // Disparar evento de recolección
        this.onItemCollected(item);
    }

    /**
     * Interactúa con una entidad no recolectable
     * @param {THREE.Object3D} entity - Entidad con la que interactuar
     */
    interactWithEntity(entity) {
        console.log(`🤝 Interactuando con: ${entity.userData.description}`);
        this.onEntityInteract(entity.userData);
    }

    /**
     * Detecta colisiones entre el jugador y las entidades
     * @param {THREE.Vector3} playerPosition - Posición del jugador
     * @param {number} collisionDistance - Distancia de colisión
     * @returns {Array} - Array de entidades en colisión
     */
    detectCollisions(playerPosition, collisionDistance = 2) {
        const collisions = [];
        const playerBox = new THREE.Box3().setFromCenterAndSize(
            playerPosition,
            new THREE.Vector3(collisionDistance, collisionDistance, collisionDistance)
        );

        for (const entity of this.entities) {
            // Actualizar bounding box de la entidad
            entity.userData.boundingBox.setFromObject(entity);
            
            // Verificar intersección
            if (playerBox.intersectsBox(entity.userData.boundingBox)) {
                collisions.push(entity);
            }
        }

        return collisions;
    }

    /**
     * Verifica si el jugador está cerca de entidades recolectables
     * @param {THREE.Vector3} playerPosition - Posición del jugador
     * @param {number} proximityDistance - Distancia de proximidad
     */
    checkProximity(playerPosition, proximityDistance = 3) {
        const nearbyEntities = this.detectCollisions(playerPosition, proximityDistance);
        const collectibles = nearbyEntities.filter(entity => entity.userData.collectible);
        
        if (collectibles.length > 0) {
            // Mostrar indicador de que se puede recolectar
            this.showCollectibleHint(collectibles[0]);
        }
    }

    /**
     * Muestra una pista sobre objeto recolectable cercano
     * @param {THREE.Object3D} entity - Entidad cercana
     */
    showCollectibleHint(entity) {
        // Aquí podrías mostrar un UI element o texto flotante
        console.log(`💡 Presiona E para recolectar: ${entity.userData.description}`);
    }

    /**
     * Carga múltiples entidades desde una configuración
     * @param {Array} entitiesConfig - Array de configuraciones de entidades
     * @returns {Promise} - Promesa que resuelve cuando todas carguen
     */
    async loadMultipleEntities(entitiesConfig) {
        const loadPromises = entitiesConfig.map(config => 
            this.loadEntity(config.path, config.position, config.options)
        );
        
        try {
            const results = await Promise.all(loadPromises);
            console.log(`✅ ${results.length} entidades cargadas exitosamente`);
            return results;
        } catch (error) {
            console.error('❌ Error al cargar múltiples entidades:', error);
            throw error;
        }
    }

    /**
     * Obtiene el inventario actual
     * @returns {Array} - Array de objetos en el inventario
     */
    getInventory() {
        return [...this.inventario];
    }

    /**
     * Limpia todas las entidades
     */
    clearAllEntities() {
        for (const entity of this.entities) {
            this.scene.remove(entity);
        }
        this.entities = [];
        console.log('🧹 Todas las entidades eliminadas');
    }

    /**
     * Evento llamado cuando se recolecta un objeto
     * @param {Object} itemData - Datos del objeto recolectado
     */
    onItemCollected(itemData) {
        // Override en la implementación principal
        console.log('🎉 Objeto recolectado:', itemData);
        
        // Ejemplo: Actualizar UI del inventario
        if (window.updateInventoryUI) {
            window.updateInventoryUI(this.inventario);
        }
    }

    /**
     * Evento llamado cuando se interactúa con una entidad
     * @param {Object} entityData - Datos de la entidad
     */
    onEntityInteract(entityData) {
        // Override en la implementación principal
        console.log('🤝 Interacción con entidad:', entityData);
    }

    /**
     * Actualiza bounding boxes de todas las entidades
     */
    updateBoundingBoxes() {
        for (const entity of this.entities) {
            entity.userData.boundingBox.setFromObject(entity);
        }
    }

    /**
     * Obtiene estadísticas del EntityManager
     * @returns {Object} - Estadísticas actuales
     */
    getStats() {
        return {
            totalEntities: this.entities.length,
            collectibleEntities: this.entities.filter(e => e.userData.collectible).length,
            inventorySize: this.inventario.length,
            entityTypes: [...new Set(this.entities.map(e => e.userData.type))]
        };
    }
}

// Exportar la clase
export { EntityManager };

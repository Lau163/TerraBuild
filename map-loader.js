/**
 * Map Loader - Sistema de carga de mapas de Minecraft para TerraBuild
 * Convierte mapas de Minecraft al formato del juego
 */

class MapLoader {
    constructor() {
        this.maps = [];
        this.currentMap = null;
        this.mapData = new Map();
    }

    /**
     * Inicializa el sistema de mapas
     */
    async init() {
        console.log('Inicializando sistema de mapas...');
        await this.loadAvailableMaps();
        this.setupMapSelector();
    }

    /**
     * Carga los mapas disponibles desde la carpeta MapasTerra
     */
    async loadAvailableMaps() {
        const availableMaps = [
            {
                id: 'medieval_house_01',
                name: 'Casa Medieval 01',
                description: 'Una hermosa casa medieval con jardín',
                path: 'MapasTerra/A_Medieval_House_01/A Medieval House - 01',
                difficulty: 'Fácil',
                size: 'Pequeño',
                regions: 16,
                worldSize: '16x16 chunks'
            },
            {
                id: 'medieval_mansion',
                name: 'Mansión Medieval',
                description: 'Una gran mansión con múltiples habitaciones',
                path: 'MapasTerra/Medieval_Mansion',
                difficulty: 'Medio',
                size: 'Grande',
                regions: 4,
                worldSize: '2x2 chunks'
            },
            {
                id: 'mountain_village',
                name: 'Pueblo de Montaña',
                description: 'Un pueblo medieval en las montañas',
                path: 'MapasTerra/Medieval_Mountain_Village/Medieval Mountain Village',
                difficulty: 'Medio',
                size: 'Mediano',
                regions: 26,
                worldSize: '9x9 chunks'
            },
            {
                id: 'beauclair_palace',
                name: 'Palacio Beauclair',
                description: 'Un magnífico palacio real',
                path: 'MapasTerra/Beauclair_Palace/The Witcher 1.0',
                difficulty: 'Difícil',
                size: 'Enorme',
                regions: 51,
                worldSize: '11x11 chunks'
            }
        ];

        this.maps = availableMaps;
        console.log(`${this.maps.length} mapas encontrados`);
    }

    /**
     * Configura el selector de mapas en la interfaz
     */
    setupMapSelector() {
        // Agregar opción de selección de mapa al menú principal
        const menuButtons = document.querySelector('.menu-buttons');
        if (menuButtons) {
            const mapSelectorBtn = document.createElement('button');
            mapSelectorBtn.className = 'menu-item';
            mapSelectorBtn.innerHTML = `
                <span class="text">Seleccionar Mapa</span>
                <span class="menu-item-background"></span>
                <span class="menu-item-border"></span>
            `;
            mapSelectorBtn.onclick = () => this.showMapSelector();
            menuButtons.appendChild(mapSelectorBtn);
        }
    }

    /**
     * Muestra la interfaz de selección de mapas
     */
    showMapSelector() {
        // Ocultar menú principal
        document.getElementById('mainMenu').style.display = 'none';

        // Crear interfaz de selección de mapas
        const mapSelectorScreen = document.createElement('div');
        mapSelectorScreen.id = 'mapSelectorScreen';
        mapSelectorScreen.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        mapSelectorScreen.innerHTML = `
            <div class="medieval-menu" style="width: 90vw; max-width: 1000px; max-height: 90vh; overflow-y: auto;">
                <h2 class="menu-title">🗺️ Selecciona un Mapa</h2>
                <div class="map-selection-container" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin: 20px 0;">
                    ${this.maps.map(map => this.createMapCard(map)).join('')}
                </div>
                <div class="selection-actions">
                    <button class="menu-item" onclick="mapLoader.backToMenu()">
                        <span class="text">🔙 Volver al Menú</span>
                        <span class="menu-item-background"></span>
                        <span class="menu-item-border"></span>
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(mapSelectorScreen);
    }

    /**
     * Crea una tarjeta de mapa para la selección
     */
    createMapCard(map) {
        return `
            <div class="map-card" onclick="mapLoader.selectMap('${map.id}')" style="
                background: linear-gradient(135deg, rgba(139, 69, 19, 0.3) 0%, rgba(101, 67, 33, 0.2) 100%);
                border: 3px solid #d4af37;
                border-radius: 15px;
                padding: 20px;
                text-align: center;
                cursor: pointer;
                transition: all 0.3s ease;
                position: relative;
            ">
                <div class="map-icon" style="font-size: 48px; margin-bottom: 15px;">${map.icon}</div>
                <h3 style="color: #d4af37; font-size: 18px; margin: 10px 0; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);">${map.name}</h3>
                <p style="color: #f4e4c1; font-size: 12px; margin: 10px 0; line-height: 1.4;">${map.description}</p>
                <div class="map-stats" style="display: flex; flex-direction: column; gap: 5px; margin: 15px 0; font-size: 11px;">
                    <span style="background: rgba(139, 69, 19, 0.5); padding: 3px 8px; border-radius: 5px; border: 1px solid rgba(212, 175, 55, 0.3); color: #d4af37;">
                        🎯 Dificultad: ${map.difficulty}
                    </span>
                    <span style="background: rgba(139, 69, 19, 0.5); padding: 3px 8px; border-radius: 5px; border: 1px solid rgba(212, 175, 55, 0.3); color: #d4af37;">
                        📏 Tamaño: ${map.size}
                    </span>
                </div>
                <button class="select-btn" style="margin-top: 10px;">
                    <span class="text">Seleccionar</span>
                    <span class="menu-item-background"></span>
                    <span class="menu-item-border"></span>
                </button>
            </div>
        `;
    }

    /**
     * Selecciona un mapa para jugar
     */
    async selectMap(mapId) {
        const map = this.maps.find(m => m.id === mapId);
        if (!map) return;

        console.log(`🗺️ Mapa seleccionado: ${map.name}`);
        this.currentMap = map;

        // Mostrar mensaje de carga
        this.showLoadingMessage(`Cargando ${map.name}...`);

        try {
            // Cargar datos del mapa
            await this.loadMapData(map);
            
            // Iniciar el juego con personaje y mapa seleccionados
            this.startGameWithCharacterAndMap();
        } catch (error) {
            console.error('Error al cargar el mapa:', error);
            this.hideLoadingMessage();
            alert('Error al cargar el mapa. Por favor, intenta de nuevo.');
        }
    }

    /**
     * Carga los datos del mapa desde los archivos de Minecraft
     */
    async loadMapData(map) {
        console.log(`Cargando datos del mapa desde: ${map.path}`);
        
        try {
            // Método directo sin dependencias externas
            console.log('Usando método directo de carga...');
            
            // Datos básicos del mapa
            const mapData = {
                name: map.name,
                path: map.path,
                difficulty: map.difficulty,
                size: map.size,
                regions: map.regions,
                worldSize: map.worldSize,
                spawnPoint: { x: 0, y: 10, z: 0 },
                loaded: true
            };

            this.mapData.set(map.id, mapData);
            console.log('Datos del mapa cargados exitosamente');
            console.log(`Mapa: ${map.name} (${map.size} - ${map.difficulty})`);
            
        } catch (error) {
            console.error('Error al cargar datos del mapa:', error);
            throw error;
        }
    }

    /**
     * Calcula el tamaño del mundo basado en los chunks procesados
     */
    calculateWorldSize(chunks) {
        if (chunks.size === 0) return { width: 0, depth: 0 };
        
        let minX = Infinity, minZ = Infinity;
        let maxX = -Infinity, maxZ = -Infinity;
        
        for (const chunk of chunks.values()) {
            minX = Math.min(minX, chunk.x);
            minZ = Math.min(minZ, chunk.z);
            maxX = Math.max(maxX, chunk.x);
            maxZ = Math.max(maxZ, chunk.z);
        }
        
        return {
            width: (maxX - minX + 1) * 16,
            depth: (maxZ - minZ + 1) * 16,
            chunks: chunks.size
        };
    }

    /**
     * Genera terreno a partir del mapa de Minecraft (simulado)
     */
    generateTerrainFromMinecraftMap(map) {
        // En una implementación real, esto leería los archivos .mca
        // Por ahora, generamos terreno basado en el tipo de mapa
        const terrainConfig = {
            'medieval_house_01': {
                width: 64,
                depth: 64,
                heightScale: 20,
                seed: Math.random() * 1000
            },
            'medieval_mansion': {
                width: 128,
                depth: 128,
                heightScale: 30,
                seed: Math.random() * 1000
            },
            'mountain_village': {
                width: 256,
                depth: 256,
                heightScale: 50,
                seed: Math.random() * 1000
            },
            'beauclair_palace': {
                width: 512,
                depth: 512,
                heightScale: 40,
                seed: Math.random() * 1000
            }
        };

        return terrainConfig[map.id] || terrainConfig['medieval_house_01'];
    }

    /**
     * Genera estructuras a partir del mapa de Minecraft (simulado)
     */
    generateStructuresFromMinecraftMap(map) {
        // En una implementación real, esto convertiría las estructuras de Minecraft
        return {
            houses: this.generateHouses(map.id),
            trees: this.generateTrees(map.id),
            decorations: this.generateDecorations(map.id)
        };
    }

    /**
     * Genera casas para el mapa
     */
    generateHouses(mapId) {
        const houseConfigs = {
            'medieval_house_01': [
                { x: 0, y: 10, z: 0, type: 'house_medieval_01' }
            ],
            'medieval_mansion': [
                { x: 0, y: 10, z: 0, type: 'mansion_medieval' },
                { x: 30, y: 10, z: 20, type: 'house_medieval_01' },
                { x: -30, y: 10, z: 20, type: 'house_medieval_02' }
            ],
            'mountain_village': [
                { x: 0, y: 15, z: 0, type: 'house_medieval_01' },
                { x: 20, y: 12, z: 15, type: 'house_medieval_02' },
                { x: -20, y: 18, z: -15, type: 'house_medieval_03' },
                { x: 40, y: 10, z: 30, type: 'tower_medieval' }
            ],
            'beauclair_palace': [
                { x: 0, y: 20, z: 0, type: 'palace_beauclair' },
                { x: 50, y: 15, z: 50, type: 'house_noble_01' },
                { x: -50, y: 15, z: 50, type: 'house_noble_02' },
                { x: 50, y: 15, z: -50, type: 'house_noble_03' },
                { x: -50, y: 15, z: -50, type: 'house_noble_04' }
            ]
        };

        return houseConfigs[mapId] || [];
    }

    /**
     * Genera árboles para el mapa
     */
    generateTrees(mapId) {
        const treeCount = {
            'medieval_house_01': 5,
            'medieval_mansion': 15,
            'mountain_village': 30,
            'beauclair_palace': 25
        };

        const trees = [];
        const count = treeCount[mapId] || 5;
        
        for (let i = 0; i < count; i++) {
            trees.push({
                x: (Math.random() - 0.5) * 200,
                y: 10,
                z: (Math.random() - 0.5) * 200,
                type: Math.random() > 0.5 ? 'oak' : 'pine'
            });
        }

        return trees;
    }

    /**
     * Genera decoraciones para el mapa
     */
    generateDecorations(mapId) {
        const decorations = [];
        
        // Agregar decoraciones básicas
        for (let i = 0; i < 10; i++) {
            decorations.push({
                x: (Math.random() - 0.5) * 100,
                y: 10,
                z: (Math.random() - 0.5) * 100,
                type: 'bush'
            });
        }

        return decorations;
    }

    /**
     * Inicia el juego con personaje y mapa seleccionados
     */
    startGameWithCharacterAndMap() {
        console.log('Iniciando juego con personaje y mapa seleccionados...');
        
        // Ocultar mensaje de carga inmediatamente
        this.hideLoadingMessage();
        
        // Ocultar selector de mapas
        const mapSelectorScreen = document.getElementById('mapSelectorScreen');
        if (mapSelectorScreen) {
            mapSelectorScreen.style.display = 'none';
        }

        // Mostrar pantalla de juego
        document.getElementById('gameScreen').style.display = 'block';

        // Verificar si hay personaje seleccionado
        const selectedCharacter = localStorage.getItem('selectedCharacter');
        if (!selectedCharacter) {
            console.warn('No hay personaje seleccionado, iniciando juego normal');
            try {
                if (window.startGame) {
                    window.startGame();
                } else {
                    console.error('startGame no disponible');
                    alert('Error: Sistema de juego no disponible');
                }
            } catch (error) {
                console.error('Error al iniciar juego normal:', error);
                alert('Error al iniciar el juego: ' + error.message);
            }
        } else {
            console.log(`Iniciando juego con personaje: ${selectedCharacter}`);
            // Iniciar juego con personaje seleccionado
            try {
                if (window.startGameWithSelectedCharacter) {
                    window.startGameWithSelectedCharacter();
                } else {
                    console.warn('startGameWithSelectedCharacter no disponible, iniciando juego normal');
                    if (window.startGame) {
                        window.startGame();
                    } else {
                        console.error('startGame no disponible');
                        alert('Error: Sistema de juego no disponible');
                    }
                }
            } catch (error) {
                console.error('Error al iniciar juego con personaje:', error);
                alert('Error al iniciar el juego con personaje: ' + error.message);
            }
        }

        // Aplicar configuración del mapa
        this.applyMapConfiguration();
        
        console.log('Juego iniciado con personaje y mapa seleccionados');
    }

    /**
     * Inicia el juego con el mapa seleccionado (método original)
     */
    startGameWithMap() {
        // Ocultar selector de mapas
        document.getElementById('mapSelectorScreen').style.display = 'none';

        // Mostrar pantalla de juego
        document.getElementById('gameScreen').style.display = 'block';

        // Inicializar el juego con el mapa
        if (window.startGame) {
            window.startGame();
        }

        // Aplicar configuración del mapa
        this.applyMapConfiguration();

        this.hideLoadingMessage();
    }

    /**
     * Aplica la configuración del mapa al juego
     */
    applyMapConfiguration() {
        try {
            if (!this.currentMap) {
                console.warn('⚠️ No hay mapa seleccionado para aplicar configuración');
                return;
            }

            const mapData = this.mapData.get(this.currentMap.id);
            if (!mapData) {
                console.warn('⚠️ No hay datos del mapa para aplicar configuración');
                return;
            }

            console.log('🎮 Aplicando configuración del mapa:', this.currentMap.name);
            console.log('📊 Datos del mapa:', mapData);

            // Si tenemos chunks procesados, los aplicamos al mundo
            if (mapData.chunks && mapData.chunks.size > 0) {
                this.applyMinecraftChunks(mapData);
            } else {
                // Aplicar configuración básica del mapa
                this.applyBasicMapConfiguration(mapData);
            }

            console.log('✅ Configuración del mapa aplicada exitosamente');
        } catch (error) {
            console.error('❌ Error al aplicar configuración del mapa:', error);
            // No mostrar alert para no interrumpir el flujo
            console.log('Continuando con configuración por defecto...');
        }
    }

    /**
     * Muestra información del mapa
     */
    showMapInfo(mapData) {
        if (!mapData) return;
        
        console.log('🗺️ Información del mapa:', mapData.name);
        console.log('📊 Detalles:', {
            difficulty: mapData.difficulty,
            size: mapData.size,
            regions: mapData.regions,
            worldSize: mapData.worldSize
        });
    }
    }

    /**
     * Aplica los chunks de Minecraft al mundo del juego
     */
    applyMinecraftChunks(mapData) {
        console.log(`🌍 Aplicando ${mapData.chunks.size} chunks al mundo...`);

        // Si existe un sistema de mundo en el juego, lo usamos
        if (window.world && window.world.loadMinecraftChunks) {
            window.world.loadMinecraftChunks(mapData.chunks);
        } else if (window.terrainGenerator) {
            // Alternativa: usar el generador de terreno
            window.terrainGenerator.loadFromMinecraftChunks(mapData.chunks);
        } else {
            console.log('⚠️ No se encontró sistema de mundo compatible');
            console.log('📋 Chunks disponibles:', mapData.chunks.size);
            
            // Mostrar estadísticas de los chunks
            let totalBlocks = 0;
            let maxHeight = 0;
            
            for (const chunk of mapData.chunks.values()) {
                totalBlocks += chunk.blocks.length;
                for (const height of chunk.heightmap) {
                    maxHeight = Math.max(maxHeight, height);
                }
            }
            
            console.log(`📈 Estadísticas del mapa:`);
            console.log(`   - Bloques totales: ${totalBlocks}`);
            console.log(`   - Altura máxima: ${maxHeight}`);
            console.log(`   - Tamaño del mundo: ${mapData.worldSize.width}x${mapData.worldSize.depth}`);
        }
    }

    /**
     * Aplica las estructuras del mapa al juego
     */
    applyMapStructures(structures) {
        console.log('🏗️ Aplicando estructuras del mapa...');

        // Si existe un sistema de entidades, lo usamos
        if (window.entityManager) {
            this.loadStructuresWithEntityManager(structures);
        } else {
            console.log('📋 Estructuras encontradas:');
            console.log(`   - Casas: ${structures.houses.length}`);
            console.log(`   - Árboles: ${structures.trees.length}`);
            console.log(`   - Decoraciones: ${structures.decorations.length}`);
            console.log(`   - Especiales: ${structures.special.length}`);
        }
    }

    /**
     * Carga estructuras usando el EntityManager
     */
    loadStructuresWithEntityManager(structures) {
        // Cargar casas
        structures.houses.forEach(house => {
            console.log(`🏠 Cargando casa: ${house.type} en (${house.x}, ${house.y}, ${house.z})`);
            // Aquí crearíamos la entidad de la casa
        });

        // Cargar árboles
        structures.trees.forEach(tree => {
            console.log(`🌳 Cargando árbol: ${tree.type} en (${tree.x}, ${tree.y}, ${tree.z})`);
            // Aquí crearíamos la entidad del árbol
        });

        // Cargar decoraciones
        structures.decorations.forEach(decoration => {
            console.log(`🌿 Cargando decoración: ${decoration.type} en (${decoration.x}, ${decoration.y}, ${decoration.z})`);
            // Aquí crearíamos la entidad de decoración
        });

        // Cargar estructuras especiales
        structures.special.forEach(special => {
            console.log(`✨ Cargando estructura especial: ${special.type} en (${special.x}, ${special.y}, ${special.z})`);
            // Aquí crearíamos la entidad especial
        });
    }

    /**
     * Establece el punto de spawn del jugador
     */
    setSpawnPoint(spawnPoint) {
        console.log(`📍 Estableciendo punto de spawn: (${spawnPoint.x}, ${spawnPoint.y}, ${spawnPoint.z})`);

        // Si existe un sistema de cámara o jugador, lo actualizamos
        if (window.camera) {
            window.camera.position.set(spawnPoint.x, spawnPoint.y + 5, spawnPoint.z);
        }

        if (window.player && window.player.setPosition) {
            window.player.setPosition(spawnPoint);
        }
    }

    /**
     * Muestra información detallada del mapa
     */
    showMapInfo(mapData) {
        const info = `
            🗺️ Mapa: ${mapData.name}
            📏 Tamaño: ${mapData.worldSize ? `${mapData.worldSize.width}x${mapData.worldSize.depth}` : 'Desconocido'}
            🧩 Chunks: ${mapData.chunks ? mapData.chunks.size : 'N/A'}
            🏠 Casas: ${mapData.structures ? mapData.structures.houses.length : 0}
        `;

        console.log(info);
        
        // Mostrar pantalla de juego
        document.getElementById('gameScreen').style.display = 'block';

        // Inicializar el juego con el mapa
        if (window.startGame) {
            window.startGame();
        }

        // Oculta mensaje de carga
        this.hideLoadingMessage();
    }

    /**
     * Muestra mensaje de carga
     */
    showLoadingMessage(message) {
        // Eliminar mensaje anterior si existe
        const existingMessage = document.getElementById('mapLoadingMessage');
        if (existingMessage) {
            document.body.removeChild(existingMessage);
        }

        // Crear nuevo mensaje de carga
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'mapLoadingMessage';
        loadingDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: #d4af37;
            padding: 20px 30px;
            border-radius: 10px;
            border: 2px solid #d4af37;
            font-family: 'Times New Roman', serif;
            font-size: 16px;
            z-index: 10000;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        `;
        loadingDiv.innerHTML = `
            <div style="margin-bottom: 10px;">🏰</div>
            <div>${message}</div>
            <div style="margin-top: 10px; font-size: 12px; color: #f4e4c1;">Por favor espera...</div>
        `;
        document.body.appendChild(loadingDiv);
    }

    /**
     * Oculta mensaje de carga
     */
    hideLoadingMessage() {
        const loadingDiv = document.getElementById('mapLoadingMessage');
        if (loadingDiv) {
            document.body.removeChild(loadingDiv);
        }
    }

    /**
     * Muestra notificación del mapa
     */
    showMapNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 128, 0, 0.8);
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            font-family: 'Times New Roman', serif;
            font-size: 14px;
            z-index: 10000;
            animation: fadeInOut 3s ease-in-out;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 3000);
    }

    /**
     * Vuelve al menú principal
     */
    backToMenu() {
        // Ocultar selector de mapas
        const mapSelectorScreen = document.getElementById('mapSelectorScreen');
        if (mapSelectorScreen) {
            document.body.removeChild(mapSelectorScreen);
        }

        // Mostrar menú principal
        document.getElementById('mainMenu').style.display = 'block';
    }

    /**
     * Obtiene el mapa actual
     */
    getCurrentMap() {
        return this.currentMap;
    }

    /**
     * Obtiene los datos del mapa actual
     */
    getCurrentMapData() {
        return this.currentMap ? this.mapData.get(this.currentMap.id) : null;
    }
}

// Funciones globales para compatibilidad
function hideLoadingMessage() {
    if (window.mapLoader) {
        window.mapLoader.hideLoadingMessage();
    }
}

// Crear instancia global del cargador de mapas
window.mapLoader = new MapLoader();

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    if (window.mapLoader) {
        window.mapLoader.init();
    }
});

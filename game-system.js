/**
 * Game System - Sistema principal del juego TerraBuild
 * Coordina todos los componentes del juego
 */

class GameSystem {
    constructor() {
        this.isRunning = false;
        this.currentMap = null;
        this.player = null;
        this.world = null;
        this.entities = [];
        this.systems = {
            renderer: null,
            physics: null,
            audio: null,
            ui: null
        };
        
        console.log('🎮 GameSystem inicializado');
    }

    /**
     * Inicia el sistema del juego
     */
    async start() {
        console.log('🚀 Iniciando sistema del juego...');
        
        try {
            // Inicializar sistemas básicos
            await this.initializeSystems();
            
            // Cargar mundo por defecto
            await this.loadDefaultWorld();
            
            // Iniciar bucle del juego
            this.startGameLoop();
            
            this.isRunning = true;
            console.log('✅ Sistema del juego iniciado correctamente');
            
            return true;
        } catch (error) {
            console.error('❌ Error al iniciar el juego:', error);
            return false;
        }
    }

    /**
     * Inicializa todos los sistemas del juego
     */
    async initializeSystems() {
        console.log('🔧 Inicializando sistemas...');
        
        // Sistema de renderizado
        this.systems.renderer = await this.initializeRenderer();
        
        // Sistema de física
        this.systems.physics = await this.initializePhysics();
        
        // Sistema de audio
        this.systems.audio = await this.initializeAudio();
        
        // Sistema de UI
        this.systems.ui = await this.initializeUI();
        
        console.log('✅ Sistemas inicializados');
    }

    /**
     * Inicializa el sistema de renderizado
     */
    async initializeRenderer() {
        console.log('🎨 Inicializando renderer...');
        
        // Usar THREE.js si está disponible
        if (typeof THREE !== 'undefined') {
            const container = document.getElementById('container');
            if (!container) {
                throw new Error('Container no encontrado');
            }

            // Crear escena
            const scene = new THREE.Scene();
            scene.background = new THREE.Color(0x87CEEB);
            scene.fog = new THREE.Fog(0x87CEEB, 10, 100);

            // Crear cámara
            const camera = new THREE.PerspectiveCamera(
                75, 
                window.innerWidth / window.innerHeight, 
                0.1, 
                1000
            );
            camera.position.set(15, 15, 15);
            camera.lookAt(0, 0, 0);

            // Crear renderer
            const renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            
            container.appendChild(renderer.domElement);

            // Configurar iluminación
            this.setupLighting(scene);

            // Manejar resize
            window.addEventListener('resize', () => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            });

            return { scene, camera, renderer };
        }
        
        return null;
    }

    /**
     * Configura la iluminación de la escena
     */
    setupLighting(scene) {
        // Luz ambiental
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        scene.add(ambientLight);

        // Luz direccional (sol)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(50, 100, 50);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 500;
        directionalLight.shadow.camera.left = -100;
        directionalLight.shadow.camera.right = 100;
        directionalLight.shadow.camera.top = 100;
        directionalLight.shadow.camera.bottom = -100;
        scene.add(directionalLight);

        // Luz de punto (antorchas)
        const torchLight1 = new THREE.PointLight(0xffaa00, 0.5, 20);
        torchLight1.position.set(10, 5, 10);
        scene.add(torchLight1);

        const torchLight2 = new THREE.PointLight(0xffaa00, 0.5, 20);
        torchLight2.position.set(-10, 5, -10);
        scene.add(torchLight2);
    }

    /**
     * Inicializa el sistema de física
     */
    async initializePhysics() {
        console.log('⚡ Inicializando física...');
        
        // Sistema básico de física
        return {
            gravity: { x: 0, y: -9.8, z: 0 },
            entities: [],
            update: (deltaTime) => {
                // Actualizar física básica
                this.entities.forEach(entity => {
                    if (entity.physics) {
                        this.updateEntityPhysics(entity, deltaTime);
                    }
                });
            }
        };
    }

    /**
     * Actualiza física de una entidad
     */
    updateEntityPhysics(entity, deltaTime) {
        if (entity.velocity) {
            // Aplicar gravedad
            entity.velocity.y += this.systems.physics.gravity.y * deltaTime;
            
            // Actualizar posición
            if (entity.position) {
                entity.position.x += entity.velocity.x * deltaTime;
                entity.position.y += entity.velocity.y * deltaTime;
                entity.position.z += entity.velocity.z * deltaTime;
            }
        }
    }

    /**
     * Inicializa el sistema de audio
     */
    async initializeAudio() {
        console.log('🔊 Inicializando audio...');
        
        return {
            context: null,
            sounds: new Map(),
            playSound: (soundName, volume = 1.0) => {
                console.log(`🔊 Reproduciendo sonido: ${soundName}`);
            },
            stopSound: (soundName) => {
                console.log(`🔇 Deteniendo sonido: ${soundName}`);
            }
        };
    }

    /**
     * Inicializa el sistema de UI
     */
    async initializeUI() {
        console.log('🖼️ Inicializando UI...');
        
        return {
            showMessage: (message, duration = 3000) => {
                if (window.showGameMessage) {
                    window.showGameMessage(message);
                }
            },
            updateHUD: () => {
                // Actualizar HUD del juego
            }
        };
    }

    /**
     * Carga el mundo por defecto
     */
    async loadDefaultWorld() {
        console.log('🌍 Cargando mundo por defecto...');
        
        try {
            // Intentar cargar mundo medieval
            if (window.loadMedievalWorld) {
                const world = await window.loadMedievalWorld();
                if (world) {
                    this.world = world;
                    console.log('✅ Mundo medieval cargado');
                    return;
                }
            }
            
            // Fallback: crear mundo básico
            await this.createBasicWorld();
            
        } catch (error) {
            console.error('❌ Error al cargar mundo:', error);
            throw error;
        }
    }

    /**
     * Crea un mundo básico si no hay otros disponibles
     */
    async createBasicWorld() {
        console.log('🏗️ Creando mundo básico...');
        
        if (!this.systems.renderer) {
            throw new Error('Renderer no disponible');
        }
        
        const { scene } = this.systems.renderer;
        
        // Crear terreno básico
        const terrainGeometry = new THREE.PlaneGeometry(200, 200, 50, 50);
        const terrainMaterial = new THREE.MeshLambertMaterial({ color: 0x3a5f3a });
        const terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);
        terrain.rotation.x = -Math.PI / 2;
        terrain.receiveShadow = true;
        scene.add(terrain);
        
        // Crear algunas estructuras básicas
        this.createBasicStructures(scene);
        
        // Crear jugador
        this.createPlayer();
        
        console.log('✅ Mundo básico creado');
    }

    /**
     * Crea estructuras básicas en el mundo
     */
    createBasicStructures(scene) {
        // Crear castillo simple
        const castleGeometry = new THREE.BoxGeometry(20, 15, 20);
        const castleMaterial = new THREE.MeshLambertMaterial({ color: 0x8b7355 });
        const castle = new THREE.Mesh(castleGeometry, castleMaterial);
        castle.position.set(0, 7.5, 0);
        castle.castShadow = true;
        castle.receiveShadow = true;
        scene.add(castle);
        
        // Crear torres
        for (let i = 0; i < 4; i++) {
            const angle = (i / 4) * Math.PI * 2;
            const towerGeometry = new THREE.CylinderGeometry(3, 3, 20, 8);
            const towerMaterial = new THREE.MeshLambertMaterial({ color: 0x8b7355 });
            const tower = new THREE.Mesh(towerGeometry, towerMaterial);
            tower.position.set(
                Math.cos(angle) * 15,
                10,
                Math.sin(angle) * 15
            );
            tower.castShadow = true;
            tower.receiveShadow = true;
            scene.add(tower);
        }
        
        // Crear árboles
        for (let i = 0; i < 20; i++) {
            const treeGeometry = new THREE.ConeGeometry(2, 8, 8);
            const treeMaterial = new THREE.MeshLambertMaterial({ color: 0x228b22 });
            const tree = new THREE.Mesh(treeGeometry, treeMaterial);
            tree.position.set(
                (Math.random() - 0.5) * 100,
                4,
                (Math.random() - 0.5) * 100
            );
            tree.castShadow = true;
            scene.add(tree);
        }
    }

    /**
     * Crea el jugador
     */
    createPlayer() {
        console.log('👤 Creando jugador...');
        
        this.player = {
            position: { x: 0, y: 5, z: 20 },
            rotation: { x: 0, y: 0, z: 0 },
            velocity: { x: 0, y: 0, z: 0 },
            health: 100,
            inventory: [],
            physics: true
        };
        
        // Actualizar cámara del jugador
        if (this.systems.renderer && this.systems.renderer.camera) {
            this.systems.renderer.camera.position.set(
                this.player.position.x,
                this.player.position.y + 2,
                this.player.position.z
            );
        }
    }

    /**
     * Inicia el bucle principal del juego
     */
    startGameLoop() {
        console.log('🔄 Iniciando bucle del juego...');
        
        let lastTime = 0;
        
        const gameLoop = (currentTime) => {
            if (!this.isRunning) return;
            
            const deltaTime = (currentTime - lastTime) / 1000;
            lastTime = currentTime;
            
            // Actualizar sistemas
            this.update(deltaTime);
            
            // Renderizar
            this.render();
            
            // Continuar bucle
            requestAnimationFrame(gameLoop);
        };
        
        requestAnimationFrame(gameLoop);
    }

    /**
     * Actualiza todos los sistemas
     */
    update(deltaTime) {
        // Actualizar física
        if (this.systems.physics) {
            this.systems.physics.update(deltaTime);
        }
        
        // Actualizar entidades
        this.entities.forEach(entity => {
            if (entity.update) {
                entity.update(deltaTime);
            }
        });
        
        // Actualizar jugador
        this.updatePlayer(deltaTime);
    }

    /**
     * Actualiza al jugador
     */
    updatePlayer(deltaTime) {
        if (!this.player) return;
        
        // Actualizar cámara para seguir al jugador
        if (this.systems.renderer && this.systems.renderer.camera) {
            const camera = this.systems.renderer.camera;
            const targetX = this.player.position.x;
            const targetY = this.player.position.y + 5;
            const targetZ = this.player.position.z + 10;
            
            // Movimiento suave de la cámara
            camera.position.x += (targetX - camera.position.x) * 0.1;
            camera.position.y += (targetY - camera.position.y) * 0.1;
            camera.position.z += (targetZ - camera.position.z) * 0.1;
            
            camera.lookAt(this.player.position.x, this.player.position.y, this.player.position.z);
        }
    }

    /**
     * Renderiza la escena
     */
    render() {
        if (this.systems.renderer && this.systems.renderer.renderer && this.systems.renderer.scene) {
            this.systems.renderer.renderer.render(
                this.systems.renderer.scene,
                this.systems.renderer.camera
            );
        }
    }

    /**
     * Detiene el juego
     */
    stop() {
        console.log('⏹️ Deteniendo juego...');
        
        this.isRunning = false;
        
        // Limpiar sistemas
        if (this.systems.renderer && this.systems.renderer.renderer) {
            this.systems.renderer.renderer.dispose();
        }
        
        // Limpiar entidades
        this.entities = [];
        
        console.log('✅ Juego detenido');
    }

    /**
     * Reinicia el juego
     */
    async restart() {
        console.log('🔄 Reiniciando juego...');
        
        // Detener juego actual
        this.stop();
        
        // Reiniciar variables
        this.player = null;
        this.world = null;
        this.entities = [];
        
        // Iniciar nuevamente
        await this.start();
        
        console.log('✅ Juego reiniciado');
    }
}

// Crear instancia global del sistema del juego
window.gameSystem = new GameSystem();

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎮 GameSystem listo para iniciar');
});

import * as THREE from 'three';

// Sistema de Mundo Medieval Mejorado para TerraBuild
class MedievalWorld {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.container = null;
        this.entities = [];
        this.isInitialized = false;
        
        console.log('🏰 MedievalWorld constructor iniciado');
    }

    // Inicializar el mundo medieval
    async init(containerId = 'container') {
        console.log('🚀 Inicializando Mundo Medieval...');
        
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error('❌ Container no encontrado:', containerId);
            return false;
        }

        // Limpiar container
        this.container.innerHTML = '';

        // Crear escena
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB); // Cielo azul
        this.scene.fog = new THREE.Fog(0x87CEEB, 10, 100); // Niebla medieval

        // Crear cámara
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(15, 15, 15);
        this.camera.lookAt(0, 0, 0);

        // Crear renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // Añadir renderer al container
        this.container.appendChild(this.renderer.domElement);

        // Configurar iluminación
        this.setupLighting();
        
        // Crear terreno
        this.createTerrain();
        
        // Crear estructuras
        this.createStructures();
        
        // Crear entidades alternativas
        this.createAlternativeEntities();
        
        // Configurar controles
        this.setupControls();
        
        // Iniciar animación
        this.animate();
        
        // Configurar resize
        this.setupResize();
        
        this.isInitialized = true;
        console.log('✅ Mundo Medieval inicializado exitosamente');
        
        return true;
    }

    // Configurar iluminación medieval
    setupLighting() {
        console.log('💡 Configurando iluminación medieval...');
        
        // Luz solar principal
        const sunLight = new THREE.DirectionalLight(0xffd700, 1.2);
        sunLight.position.set(10, 20, 5);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        sunLight.shadow.camera.near = 0.5;
        sunLight.shadow.camera.far = 50;
        sunLight.shadow.camera.left = -20;
        sunLight.shadow.camera.right = 20;
        sunLight.shadow.camera.top = 20;
        sunLight.shadow.camera.bottom = -20;
        this.scene.add(sunLight);

        // Luz ambiental
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);

        // Luces de antorchas para atmósfera
        this.createTorches();
    }

    // Crear antorchas para atmósfera medieval
    createTorches() {
        const torchPositions = [
            {x: 5, y: 2, z: 5},
            {x: -5, y: 2, z: 5},
            {x: 5, y: 2, z: -5},
            {x: -5, y: 2, z: -5},
            {x: 0, y: 3, z: 0}
        ];

        torchPositions.forEach(pos => {
            const torchLight = new THREE.PointLight(0xff6600, 0.5, 10);
            torchLight.position.set(pos.x, pos.y, pos.z);
            torchLight.castShadow = true;
            this.scene.add(torchLight);

            // Soporte de antorcha
            const torchGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1);
            const torchMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 });
            const torch = new THREE.Mesh(torchGeometry, torchMaterial);
            torch.position.set(pos.x, pos.y - 0.5, pos.z);
            this.scene.add(torch);
        });
    }

    // Crear terreno medieval
    createTerrain() {
        console.log('🏔️ Creando terreno medieval...');
        
        const worldSize = 30;
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        
        // Materiales
        const materials = {
            grass: new THREE.MeshLambertMaterial({ color: 0x3b5d38 }),
            stone: new THREE.MeshLambertMaterial({ color: 0x808080 }),
            wood: new THREE.MeshLambertMaterial({ color: 0x8b4513 }),
            dirt: new THREE.MeshLambertMaterial({ color: 0x654321 }),
            water: new THREE.MeshLambertMaterial({ color: 0x4682b4, transparent: true, opacity: 0.8 })
        };

        // Generar terreno con altura variable
        for (let x = -worldSize; x <= worldSize; x++) {
            for (let z = -worldSize; z <= worldSize; z++) {
                // Altura basada en seno/coseno para colinas suaves
                const height = Math.floor(Math.sin(x * 0.1) * Math.cos(z * 0.1) * 3);
                
                // Base de tierra
                for (let y = -2; y <= height; y++) {
                    const block = new THREE.Mesh(geometry, materials.dirt);
                    block.position.set(x, y, z);
                    block.castShadow = true;
                    block.receiveShadow = true;
                    this.scene.add(block);
                }
                
                // Cubierta de pasto
                if (height >= -1) {
                    const grass = new THREE.Mesh(geometry, materials.grass);
                    grass.position.set(x, height + 1, z);
                    grass.castShadow = true;
                    grass.receiveShadow = true;
                    this.scene.add(grass);
                }
                
                // Agua en áreas bajas
                if (height <= -1) {
                    const water = new THREE.Mesh(geometry, materials.water);
                    water.position.set(x, 0, z);
                    this.scene.add(water);
                }
            }
        }
    }

    // Crear estructuras medievales
    createStructures() {
        console.log('🏰 Creando estructuras medievales...');
        
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const stoneMaterial = new THREE.MeshLambertMaterial({ color: 0x808080 });
        const woodMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 });
        
        // Crear castillo central
        this.createCastle(0, 0);
        
        // Crear casas alrededor
        this.createHouse(10, 0, 10);
        this.createHouse(-10, 0, 10);
        this.createHouse(10, 0, -10);
        this.createHouse(-10, 0, -10);
        
        // Crear murallas
        this.createWalls();
        
        // Crear árboles
        this.createTrees();
    }

    // Crear castillo
    createCastle(centerX, centerZ) {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const stoneMaterial = new THREE.MeshLambertMaterial({ color: 0x808080 });
        
        // Base del castillo
        for (let x = -3; x <= 3; x++) {
            for (let z = -3; z <= 3; z++) {
                for (let y = 0; y <= 2; y++) {
                    const block = new THREE.Mesh(geometry, stoneMaterial);
                    block.position.set(centerX + x, y, centerZ + z);
                    block.castShadow = true;
                    block.receiveShadow = true;
                    this.scene.add(block);
                }
            }
        }
        
        // Torres en las esquinas
        const corners = [[-4, -4], [4, -4], [-4, 4], [4, 4]];
        corners.forEach(([x, z]) => {
            for (let y = 0; y <= 6; y++) {
                const tower = new THREE.Mesh(geometry, stoneMaterial);
                tower.position.set(centerX + x, y, centerZ + z);
                tower.castShadow = true;
                this.scene.add(tower);
            }
        });
        
        // Puerta principal
        const doorGeometry = new THREE.BoxGeometry(2, 3, 1);
        const doorMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 });
        const door = new THREE.Mesh(doorGeometry, doorMaterial);
        door.position.set(centerX, 1.5, centerZ + 3);
        this.scene.add(door);
    }

    // Crear casa
    createHouse(x, y, z) {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const woodMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 });
        const roofMaterial = new THREE.MeshLambertMaterial({ color: 0x654321 });
        
        // Base de la casa
        for (let hx = -1; hx <= 1; hx++) {
            for (let hz = -1; hz <= 1; hz++) {
                for (let hy = 0; hy <= 2; hy++) {
                    const wall = new THREE.Mesh(geometry, woodMaterial);
                    wall.position.set(x + hx, y + hy, z + hz);
                    wall.castShadow = true;
                    this.scene.add(wall);
                }
            }
        }
        
        // Techo
        const roofGeometry = new THREE.ConeGeometry(3, 2, 4);
        const roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.position.set(x, y + 4, z);
        roof.rotation.y = Math.PI / 4;
        roof.castShadow = true;
        this.scene.add(roof);
        
        // Puerta
        const doorGeometry = new THREE.BoxGeometry(1, 2, 0.2);
        const door = new THREE.Mesh(doorGeometry, woodMaterial);
        door.position.set(x, y + 1, z + 1.5);
        this.scene.add(door);
    }

    // Crear murallas
    createWalls() {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const stoneMaterial = new THREE.MeshLambertMaterial({ color: 0x808080 });
        
        // Muralla perimetral
        const wallPositions = [
            {start: [-15, 0], end: [15, 0], direction: 'x'},
            {start: [-15, 15], end: [15, 15], direction: 'x'},
            {start: [-15, 0], end: [-15, 15], direction: 'z'},
            {start: [15, 0], end: [15, 15], direction: 'z'}
        ];
        
        wallPositions.forEach(wall => {
            const [startX, startZ] = wall.start;
            const [endX, endZ] = wall.end;
            
            if (wall.direction === 'x') {
                for (let x = startX; x <= endX; x++) {
                    for (let y = 0; y <= 4; y++) {
                        const block = new THREE.Mesh(geometry, stoneMaterial);
                        block.position.set(x, y, startZ);
                        block.castShadow = true;
                        this.scene.add(block);
                    }
                }
            } else {
                for (let z = startZ; z <= endZ; z++) {
                    for (let y = 0; y <= 4; y++) {
                        const block = new THREE.Mesh(geometry, stoneMaterial);
                        block.position.set(startX, y, z);
                        block.castShadow = true;
                        this.scene.add(block);
                    }
                }
            }
        });
    }

    // Crear árboles
    createTrees() {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const woodMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 });
        const leafMaterial = new THREE.MeshLambertMaterial({ color: 0x228b22 });
        
        // Posiciones aleatorias de árboles
        const treePositions = [
            [8, 8], [-8, 8], [8, -8], [-8, -8],
            [12, 5], [-12, 5], [12, -5], [-12, -5],
            [5, 12], [-5, 12], [5, -12], [-5, -12]
        ];
        
        treePositions.forEach(([x, z]) => {
            // Tronco
            for (let y = 1; y <= 4; y++) {
                const trunk = new THREE.Mesh(geometry, woodMaterial);
                trunk.scale.set(0.5, 1, 0.5);
                trunk.position.set(x, y, z);
                trunk.castShadow = true;
                this.scene.add(trunk);
            }
            
            // Hojas
            for (let lx = -1; lx <= 1; lx++) {
                for (let lz = -1; lz <= 1; lz++) {
                    for (let ly = 5; ly <= 7; ly++) {
                        const leaf = new THREE.Mesh(geometry, leafMaterial);
                        leaf.scale.set(0.8, 0.8, 0.8);
                        leaf.position.set(x + lx, ly, z + lz);
                        leaf.castShadow = true;
                        this.scene.add(leaf);
                    }
                }
            }
        });
    }

    // Crear entidades alternativas (sin archivos GLTF)
    createAlternativeEntities() {
        console.log('👥 Creando entidades alternativas...');
        
        // Crear caballeros guardianes
        this.createKnight(10, 1, 10);
        this.createKnight(-10, 1, 10);
        this.createKnight(10, 1, -10);
        this.createKnight(-10, 1, -10);
        
        // Crear aldeanos
        this.createVillager(5, 1, 5);
        this.createVillager(-5, 1, 5);
        this.createVillager(5, 1, -5);
        this.createVillager(-5, 1, -5);
        
        // Crear objetos recolectables
        this.createCollectibles();
    }

    // Crear caballero
    createKnight(x, y, z) {
        const group = new THREE.Group();
        
        // Cuerpo del caballero
        const bodyGeometry = new THREE.BoxGeometry(0.8, 1.5, 0.4);
        const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0x4169E1 });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 1;
        group.add(body);
        
        // Casco
        const helmetGeometry = new THREE.BoxGeometry(0.6, 0.6, 0.6);
        const helmetMaterial = new THREE.MeshLambertMaterial({ color: 0xC0C0C0 });
        const helmet = new THREE.Mesh(helmetGeometry, helmetMaterial);
        helmet.position.y = 2;
        group.add(helmet);
        
        // Espada
        const swordGeometry = new THREE.BoxGeometry(0.1, 1.5, 0.05);
        const swordMaterial = new THREE.MeshLambertMaterial({ color: 0x888888 });
        const sword = new THREE.Mesh(swordGeometry, swordMaterial);
        sword.position.set(0.8, 1.5, 0);
        group.add(sword);
        
        group.position.set(x, y, z);
        this.scene.add(group);
        this.entities.push(group);
    }

    // Crear aldeano
    createVillager(x, y, z) {
        const group = new THREE.Group();
        
        // Cuerpo del aldeano
        const bodyGeometry = new THREE.BoxGeometry(0.6, 1.2, 0.3);
        const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 0.8;
        group.add(body);
        
        // Cabeza
        const headGeometry = new THREE.SphereGeometry(0.3, 8, 6);
        const headMaterial = new THREE.MeshLambertMaterial({ color: 0xFFDBAC });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 1.6;
        group.add(head);
        
        // Sombrero
        const hatGeometry = new THREE.ConeGeometry(0.4, 0.3, 4);
        const hatMaterial = new THREE.MeshLambertMaterial({ color: 0x654321 });
        const hat = new THREE.Mesh(hatGeometry, hatMaterial);
        hat.position.y = 2;
        group.add(hat);
        
        group.position.set(x, y, z);
        this.scene.add(group);
        this.entities.push(group);
    }

    // Crear objetos recolectables
    createCollectibles() {
        console.log('⚔️ Creando objetos recolectables...');
        
        // Espadas
        this.createSword(0, 1, 0, 0x888888);
        this.createSword(5, 1, 5, 0xFFD700);
        this.createSword(-5, 1, 0, 0x888888);
        
        // Escudos
        this.createShield(-5, 1, 5);
        this.createShield(0, 1, -5);
        
        // Monedas
        this.createCoin(3, 1, 3);
        this.createCoin(-3, 1, 3);
        this.createCoin(3, 1, -3);
        this.createCoin(-3, 1, -3);
    }

    // Crear espada
    createSword(x, y, z, color) {
        const group = new THREE.Group();
        
        // Hoja
        const bladeGeometry = new THREE.BoxGeometry(0.05, 0.8, 0.02);
        const bladeMaterial = new THREE.MeshLambertMaterial({ color: color });
        const blade = new THREE.Mesh(bladeGeometry, bladeMaterial);
        blade.position.y = 0.4;
        group.add(blade);
        
        // Guarda
        const guardGeometry = new THREE.BoxGeometry(0.15, 0.1, 0.05);
        const guardMaterial = new THREE.MeshLambertMaterial({ color: 0x444444 });
        const guard = new THREE.Mesh(guardGeometry, guardMaterial);
        guard.position.y = 0.05;
        group.add(guard);
        
        // Mango
        const handleGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.3, 8);
        const handleMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 });
        const handle = new THREE.Mesh(handleGeometry, handleMaterial);
        handle.position.y = -0.15;
        group.add(handle);
        
        group.position.set(x, y, z);
        this.scene.add(group);
        this.entities.push(group);
    }

    // Crear escudo
    createShield(x, y, z) {
        const group = new THREE.Group();
        
        // Escudo principal
        const shieldGeometry = new THREE.CylinderGeometry(0.4, 0.35, 0.08, 8);
        const shieldMaterial = new THREE.MeshLambertMaterial({ color: 0x4A4A4A });
        const shield = new THREE.Mesh(shieldGeometry, shieldMaterial);
        shield.rotation.z = Math.PI / 2;
        group.add(shield);
        
        // Borde
        const borderGeometry = new THREE.TorusGeometry(0.37, 0.03, 8, 1);
        const borderMaterial = new THREE.MeshLambertMaterial({ color: 0x666666 });
        const border = new THREE.Mesh(borderGeometry, borderMaterial);
        border.rotation.z = Math.PI / 2;
        group.add(border);
        
        group.position.set(x, y, z);
        this.scene.add(group);
        this.entities.push(group);
    }

    // Crear moneda
    createCoin(x, y, z) {
        const geometry = new THREE.CylinderGeometry(0.1, 0.1, 0.02, 8);
        const material = new THREE.MeshLambertMaterial({ color: 0xFFD700 });
        const coin = new THREE.Mesh(geometry, material);
        coin.rotation.x = Math.PI / 2;
        coin.position.set(x, y, z);
        
        // Animación flotante
        coin.userData.floatAnimation = {
            amplitude: 0.1,
            speed: 0.002,
            offset: Math.random() * Math.PI * 2
        };
        
        this.scene.add(coin);
        this.entities.push(coin);
    }

    // Configurar controles de cámara
    setupControls() {
        console.log('🎮 Configurando controles...');
        
        let mouseX = 0, mouseY = 0;
        let targetX = 15, targetZ = 15;
        
        document.addEventListener('mousemove', (event) => {
            mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
            
            // Suavizar movimiento de cámara
            targetX = 15 + mouseX * 10;
            targetZ = 15 + mouseY * 10;
        });
        
        // Actualizar posición de cámara en cada frame
        this.updateCamera = () => {
            this.camera.position.x += (targetX - this.camera.position.x) * 0.05;
            this.camera.position.z += (targetZ - this.camera.position.z) * 0.05;
            this.camera.position.y = 15;
            this.camera.lookAt(0, 0, 0);
        };
    }

    // Configurar resize
    setupResize() {
        window.addEventListener('resize', () => {
            if (this.camera && this.renderer) {
                this.camera.aspect = window.innerWidth / window.innerHeight;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(window.innerWidth, window.innerHeight);
            }
        });
    }

    // Bucle de animación
    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        
        // Actualizar cámara
        if (this.updateCamera) {
            this.updateCamera();
        }
        
        // Animar entidades flotantes
        this.entities.forEach(entity => {
            if (entity.userData.floatAnimation) {
                const anim = entity.userData.floatAnimation;
                const time = Date.now() * anim.speed;
                entity.position.y += Math.sin(time + anim.offset) * anim.amplitude * 0.01;
            }
        });
        
        // Renderizar
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    // Obtener escena para integración
    getScene() {
        return this.scene;
    }

    // Obtener cámara para integración
    getCamera() {
        return this.camera;
    }

    // Obtener renderer para integración
    getRenderer() {
        return this.renderer;
    }

    // Limpiar mundo
    dispose() {
        console.log('🧹 Limpiando mundo medieval...');
        
        if (this.renderer) {
            this.renderer.dispose();
        }
        
        if (this.scene) {
            this.scene.traverse((object) => {
                if (object.geometry) object.geometry.dispose();
                if (object.material) object.material.dispose();
            });
        }
        
        this.entities = [];
        this.isInitialized = false;
    }
}

// Crear instancia global del mundo medieval
let medievalWorld = null;

// Función de inicialización global
window.initMedievalWorld = async function(containerId = 'container') {
    console.log('🏰 Inicializando Mundo Medieval Global...');
    
    try {
        medievalWorld = new MedievalWorld();
        const success = await medievalWorld.init(containerId);
        
        if (success) {
            console.log('✅ Mundo Medieval cargado exitosamente');
            window.medievalWorldLoaded = true;
            
            // Disparar evento de mundo cargado
            if (typeof window.onMedievalWorldLoaded === 'function') {
                window.onMedievalWorldLoaded(medievalWorld);
            }
            
            return medievalWorld;
        } else {
            console.error('❌ Error al inicializar Mundo Medieval');
            return null;
        }
    } catch (error) {
        console.error('❌ Error crítico al cargar Mundo Medieval:', error);
        return null;
    }
};

// Función para obtener el mundo medieval
window.getMedievalWorld = function() {
    return medievalWorld;
};

// Auto-inicialización si no hay otro sistema
if (typeof window.scene === 'undefined') {
    console.log('🚀 Auto-inicializando Mundo Medieval (no hay sistema principal)');
    window.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            window.initMedievalWorld();
        }, 100);
    });
}

export { MedievalWorld };

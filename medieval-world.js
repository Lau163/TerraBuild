import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// 1. Configuración Básica Mejorada
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB); // Cielo azul
scene.fog = new THREE.Fog(0x87CEEB, 10, 100); // Niebla medieval

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Limpiar contenedor y añadir renderer
const container = document.getElementById('container');
if (container) {
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
}

// Sistema de Entidades 3D para mundo medieval
const loader = new GLTFLoader();
let entidadesCargadas = [];

// Función para cargar entidades en el mundo medieval
window.cargarEntidadMedieval = function(path, position) {
    loader.load(path, (gltf) => {
        const modelo = gltf.scene;
        modelo.position.set(position.x, position.y, position.z);
        modelo.scale.set(0.5, 0.5, 0.5);
        modelo.castShadow = true;
        modelo.receiveShadow = true;
        scene.add(modelo);
        entidadesCargadas.push(modelo);
        console.log("Entidad medieval cargada:", path);
    }, undefined, (error) => {
        console.error("Error al cargar entidad medieval:", error);
    });
};

// Función para crear entidades en el mundo medieval
window.crearEntidadesEnMundoMedieval = function() {
    // Caballeros guardianes del castillo
    cargarEntidadMedieval('assets/models/caballero.glb', {x: 10, y: 2, z: 10});
    cargarEntidadMedieval('assets/models/caballero.glb', {x: -10, y: 2, z: 10});
    
    // Aldeanos cerca del castillo
    cargarEntidadMedieval('assets/models/aldeano.glb', {x: 5, y: 1, z: 5});
    cargarEntidadMedieval('assets/models/aldeano.glb', {x: -5, y: 1, z: 5});
    
    // Objetos en el mundo
    cargarEntidadMedieval('assets/models/espada_medieval.glb', {x: 0, y: 1, z: 0});
    cargarEntidadMedieval('assets/models/espada_medieval.glb', {x: 2, y: 1, z: 2});
};

// 2. Iluminación Medieval Mejorada
const sunLight = new THREE.DirectionalLight(0xffd700, 1.2); // Luz dorada medieval
sunLight.position.set(10, 20, 5);
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 2048;
sunLight.shadow.mapSize.height = 2048;
scene.add(sunLight);

const ambientLight = new THREE.AmbientLight(0x404040, 0.6); // Luz ambiental suave
scene.add(ambientLight);

// 3. Texturas y Materiales Medievales
const geometry = new THREE.BoxGeometry(1, 1, 1);

// Materiales con colores medievales
const materials = {
    grass: new THREE.MeshLambertMaterial({ color: 0x3b5d38 }), // Pasto oscuro
    stone: new THREE.MeshLambertMaterial({ color: 0x808080 }), // Piedra gris
    wood: new THREE.MeshLambertMaterial({ color: 0x8b4513 }), // Madera castaño
    gold: new THREE.MeshLambertMaterial({ color: 0xffd700 }), // Oro decorativo
    water: new THREE.MeshLambertMaterial({ color: 0x4682b4, transparent: true, opacity: 0.8 }) // Agua
};

// 4. Generación de Terreno Medieval Mejorada
function createWorld() {
    const worldSize = 20;
    const heightMap = [];
    
    // Generar mapa de alturas simple
    for (let x = 0; x < worldSize; x++) {
        heightMap[x] = [];
        for (let z = 0; z < worldSize; z++) {
            // Terreno base con variación
            const baseHeight = Math.floor(Math.sin(x * 0.3) * Math.cos(z * 0.3) * 2);
            heightMap[x][z] = baseHeight;
        }
    }
    
    // Crear bloques del terreno
    for (let x = 0; x < worldSize; x++) {
        for (let z = 0; z < worldSize; z++) {
            const height = heightMap[x][z];
            
            // Crear columna de bloques hasta la altura del terreno
            for (let y = 0; y <= height; y++) {
                const block = new THREE.Mesh(geometry, materials.stone);
                block.position.set(x, y, z);
                block.castShadow = true;
                block.receiveShadow = true;
                scene.add(block);
            }
            
            // Cubierta de pasto
            if (height >= 0) {
                const grass = new THREE.Mesh(geometry, materials.grass);
                grass.position.set(x, height + 1, z);
                grass.castShadow = true;
                grass.receiveShadow = true;
                scene.add(grass);
            }
            
            // Estructuras medievales aleatorias
            const rand = Math.random();
            if (rand > 0.95) {
                // Torre pequeña
                for (let y = 1; y <= 4; y++) {
                    const tower = new THREE.Mesh(geometry, materials.stone);
                    tower.position.set(x, height + y, z);
                    tower.castShadow = true;
                    scene.add(tower);
                }
            } else if (rand > 0.9) {
                // Árbol simple (tronco de madera)
                for (let y = 1; y <= 3; y++) {
                    const tree = new THREE.Mesh(geometry, materials.wood);
                    tree.position.set(x, height + y, z);
                    tree.castShadow = true;
                    scene.add(tree);
                }
            }
        }
    }
    
    // Añadir castillo simple en el centro
    createCastle(worldSize / 2, worldSize / 2);
}

function createCastle(centerX, centerZ) {
    const castleSize = 3;
    
    // Muros del castillo
    for (let x = -castleSize; x <= castleSize; x++) {
        for (let z = -castleSize; z <= castleSize; z++) {
            if (Math.abs(x) === castleSize || Math.abs(z) === castleSize) {
                // Muros
                for (let y = 1; y <= 5; y++) {
                    const wall = new THREE.Mesh(geometry, materials.stone);
                    wall.position.set(centerX + x, y, centerZ + z);
                    wall.castShadow = true;
                    scene.add(wall);
                }
            }
        }
    }
    
    // Torres en las esquinas
    const corners = [
        [-castleSize, -castleSize], [castleSize, -castleSize],
        [-castleSize, castleSize], [castleSize, castleSize]
    ];
    
    corners.forEach(([x, z]) => {
        for (let y = 1; y <= 7; y++) {
            const tower = new THREE.Mesh(geometry, materials.stone);
            tower.position.set(centerX + x, y, centerZ + z);
            tower.castShadow = true;
            scene.add(tower);
        }
    });
}

// 5. Controles de Cámara Mejorados
let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

// 6. Bucle de Animación Mejorado
function animate() {
    requestAnimationFrame(animate);
    
    // Rotación suave de la cámara alrededor del mundo
    const time = Date.now() * 0.0001;
    camera.position.x = Math.cos(time) * 25;
    camera.position.z = Math.sin(time) * 25;
    camera.position.y = 15;
    camera.lookAt(0, 0, 0);
    
    renderer.render(scene, camera);
}

// 7. Manejo de Ventana
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Inicializar mundo
createWorld();
animate();

// Cargar entidades después de un pequeño delay
setTimeout(() => {
    crearEntidadesEnMundoMedieval();
}, 2000);

// Exportar para acceso global
window.medievalWorldLoaded = true;

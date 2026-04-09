/**
 * Sistema de Integración Principal de TerraBuild
 * Asegura que todos los componentes funcionen juntos correctamente
 */

class TerraBuildIntegration {
    constructor() {
        this.systems = {
            mapLoader: null,
            gameSystem: null,
            craftingSystem: null,
            medievalWorld: null,
            characterLoader: null,
            entityManager: null
        };
        
        this.isInitialized = false;
        this.gameStarted = false;
        
        console.log('Sistema de Integración TerraBuild inicializado');
    }

    /**
     * Inicializa todos los sistemas del juego
     */
    async initializeAll() {
        console.log('=== INICIANDO SISTEMA TERRABUILD ===');
        
        try {
            // 1. Inicializar sistema de mapas
            await this.initializeMapSystem();
            
            // 2. Inicializar sistema de juego
            await this.initializeGameSystem();
            
            // 3. Inicializar sistema de fabricación
            await this.initializeCraftingSystem();
            
            // 4. Configurar controles globales
            this.setupGlobalControls();
            
            // 5. Configurar manejo de errores
            this.setupErrorHandling();
            
            // 6. Verificar integración
            await this.verifyIntegration();
            
            this.isInitialized = true;
            console.log('=== SISTEMA TERRABUILD INICIALIZADO CORRECTAMENTE ===');
            
            return true;
        } catch (error) {
            console.error('Error crítico en inicialización:', error);
            this.showCriticalError(error);
            return false;
        }
    }

    /**
     * Inicializa el sistema de mapas
     */
    async initializeMapSystem() {
        console.log('1. Inicializando sistema de mapas...');
        
        if (window.mapLoader) {
            this.systems.mapLoader = window.mapLoader;
            await this.systems.mapLoader.init();
            console.log('   Sistema de mapas listo');
        } else {
            throw new Error('MapLoader no disponible');
        }
    }

    /**
     * Inicializa el sistema de juego
     */
    async initializeGameSystem() {
        console.log('2. Inicializando sistema de juego...');
        
        if (window.gameSystem) {
            this.systems.gameSystem = window.gameSystem;
            console.log('   Sistema de juego listo');
        } else {
            console.warn('   GameSystem no disponible, usando fallback');
        }
    }

    /**
     * Inicializa el sistema de fabricación
     */
    async initializeCraftingSystem() {
        console.log('3. Inicializando sistema de fabricación...');
        
        if (window.craftingSystem) {
            this.systems.craftingSystem = window.craftingSystem;
            console.log('   Sistema de fabricación listo');
        } else {
            console.warn('   CraftingSystem no disponible');
        }
        
        if (window.craftingUI) {
            console.log('   UI de fabricación lista');
        } else {
            console.warn('   CraftingUI no disponible');
        }
    }

    /**
     * Configura controles globales
     */
    setupGlobalControls() {
        console.log('4. Configurando controles globales...');
        
        // Mapeo de funciones globales para compatibilidad
        window.startGame = () => this.startGame();
        window.startOriginalGame = () => this.startOriginalGame();
        window.backToMenu = () => this.backToMenu();
        window.openCrafting = () => this.openCrafting();
        window.showControls = () => this.showControls();
        window.showOptions = () => this.showOptions();
        window.showCharacterSelection = () => this.showCharacterSelection();
        
        console.log('   Controles globales configurados');
    }

    /**
     * Configura manejo de errores
     */
    setupErrorHandling() {
        console.log('5. Configurando manejo de errores...');
        
        window.addEventListener('error', (event) => {
            console.error('Error global:', event.error);
            this.showError(event.error.message);
        });
        
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Promesa rechazada:', event.reason);
            this.showError('Error en operación asíncrona');
        });
        
        console.log('   Manejo de errores configurado');
    }

    /**
     * Verifica la integración de todos los sistemas
     */
    async verifyIntegration() {
        console.log('6. Verificando integración...');
        
        const checks = [
            { name: 'MapLoader', check: () => window.mapLoader && window.mapLoader.maps },
            { name: 'CraftingSystem', check: () => window.craftingSystem && window.craftingSystem.recipes },
            { name: 'CraftingUI', check: () => window.craftingUI },
            { name: 'GameSystem', check: () => window.gameSystem },
            { name: 'MedievalWorld', check: () => window.medievalWorld }
        ];
        
        let passed = 0;
        let failed = 0;
        
        for (const { name, check } of checks) {
            try {
                if (check()) {
                    console.log(`   ${name}: OK`);
                    passed++;
                } else {
                    console.warn(`   ${name}: NO DISPONIBLE`);
                    failed++;
                }
            } catch (error) {
                console.error(`   ${name}: ERROR - ${error.message}`);
                failed++;
            }
        }
        
        console.log(`   Verificación completa: ${passed} OK, ${failed} con problemas`);
        
        if (failed > 0) {
            console.warn('Algunos sistemas no están disponibles, pero el juego puede funcionar');
        }
    }

    /**
     * Inicia el juego principal
     */
    async startGame() {
        if (this.gameStarted) {
            console.log('El juego ya está en ejecución');
            return;
        }
        
        console.log('Iniciando TerraBuild - Mundo Medieval...');
        
        try {
            // Ocultar menú principal
            document.getElementById('mainMenu').style.display = 'none';
            document.getElementById('backgroundVideo').style.display = 'none';
            document.getElementById('gameScreen').style.display = 'block';
            
            // Iniciar sistema de juego si está disponible
            if (this.systems.gameSystem && !this.systems.gameSystem.isRunning) {
                await this.systems.gameSystem.start();
                console.log('GameSystem iniciado');
            } else {
                // Fallback a mundo medieval
                await this.startMedievalWorld();
            }
            
            this.gameStarted = true;
            this.showGameMessage('¡Bienvenido a TerraBuild!\n\nUsa el mouse para mover la cámara\nE: Interactuar\nV: Cambiar vista\nC: Fabricación\nESC: Menú');
            
        } catch (error) {
            console.error('Error al iniciar el juego:', error);
            this.showError('No se pudo iniciar el juego: ' + error.message);
            this.backToMenu();
        }
    }

    /**
     * Inicia el juego original
     */
    async startOriginalGame() {
        console.log('Iniciando TerraBuild - Mundo Original...');
        
        try {
            // Ocultar menú principal
            document.getElementById('mainMenu').style.display = 'none';
            document.getElementById('backgroundVideo').style.display = 'none';
            document.getElementById('gameScreen').style.display = 'block';
            
            // Iniciar juego original (código existente)
            if (typeof init === 'function') {
                init();
                if (typeof animate === 'function') {
                    animate();
                }
            }
            
            this.gameStarted = true;
            this.showGameMessage('Mundo Original iniciado\n\nClic izquierdo: Avanzar\nClic derecho: Retroceder');
            
        } catch (error) {
            console.error('Error al iniciar juego original:', error);
            this.showError('No se pudo iniciar el juego original: ' + error.message);
            this.backToMenu();
        }
    }

    /**
     * Inicia el mundo medieval
     */
    async startMedievalWorld() {
        console.log('Iniciando mundo medieval...');
        
        try {
            if (window.initMedievalWorld) {
                const world = await window.initMedievalWorld('container');
                if (world) {
                    console.log('Mundo medieval iniciado');
                    
                    // Cargar entidades adicionales
                    setTimeout(() => {
                        if (window.crearEntidadesMedievales) {
                            window.crearEntidadesMedievales();
                        }
                    }, 1000);
                }
            }
        } catch (error) {
            console.error('Error al iniciar mundo medieval:', error);
            throw error;
        }
    }

    /**
     * Vuelve al menú principal
     */
    backToMenu() {
        console.log('Volviendo al menú principal...');
        
        try {
            // Detener sistemas
            if (this.systems.gameSystem && this.systems.gameSystem.isRunning) {
                this.systems.gameSystem.stop();
            }
            
            if (window.medievalWorld) {
                window.medievalWorld.cleanup();
            }
            
            // Restablecer estado
            this.gameStarted = false;
            
            // Mostrar menú principal
            document.getElementById('gameScreen').style.display = 'none';
            document.getElementById('mainMenu').style.display = 'block';
            document.getElementById('backgroundVideo').style.display = 'block';
            
            console.log('De vuelta al menú principal');
            
        } catch (error) {
            console.error('Error al volver al menú:', error);
        }
    }

    /**
     * Abre la interfaz de fabricación
     */
    openCrafting() {
        if (window.craftingUI) {
            window.craftingUI.open();
        } else {
            this.showGameMessage('Sistema de fabricación no disponible');
        }
    }

    /**
     * Muestra los controles del juego
     */
    showControls() {
        alert('CONTROLES TERRABUILD\n\nMUNDO ORIGINAL:\n· Clic izquierdo: Avanzar\n· Clic derecho: Retroceder\n· Movimiento libre con mouse\n\nMUNDO MEDIEVAL:\n· Cámara automática rotativa\n· Observa el castillo y estructuras\n\nCÁMARA:\n· V: Cambiar entre 1ra/3ra persona\n· Boton "Cambiar Vista": Cambiar modo\n· Boton "Resetear": Resetear posición\n· Boton "Ajustes": Mostrar ajustes finos\n· Q/E: Ajustar cámara lateral (3ra persona)\n· R/F: Ajustar cámara altura (3ra persona)\n· W/S: Ajustar cámara distancia (3ra persona)\n\nFABRICACIÓN:\n· Boton "Fabricación": Abrir mesa de trabajo\n· Arrastra materiales al grid\n· Clic en slots para limpiar\n· ESC: Cerrar interfaz\n\nVUELTA AL MENÚ:\n· Boton "Menú" en esquina superior derecha\n\nINTERACCIÓN:\n· E: Interactuar con personajes/objetos\n· I: Mostrar inventario');
    }

    /**
     * Muestra opciones
     */
    showOptions() {
        alert('OPCIONES TERRABUILD\n\nGráficos: Automáticos\nSonido: Activado\nControles: Mouse + Teclado\nIdioma: Español\n\nMás opciones próximamente...');
    }

    /**
     * Muestra selección de personajes
     */
    showCharacterSelection() {
        const screen = document.getElementById('characterSelectionScreen');
        if (screen) {
            document.getElementById('mainMenu').style.display = 'none';
            screen.style.display = 'block';
        } else {
            this.showGameMessage('Selección de personajes no disponible');
        }
    }

    /**
     * Muestra un mensaje en el juego
     */
    showGameMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `
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
            text-align: center;
            z-index: 10000;
            white-space: pre-line;
            box-shadow: 0 0 20px rgba(212, 175, 55, 0.5);
        `;
        messageDiv.textContent = message;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            if (document.body.contains(messageDiv)) {
                document.body.removeChild(messageDiv);
            }
        }, 3000);
    }

    /**
     * Muestra un error
     */
    showError(message) {
        console.error('ERROR:', message);
        this.showGameMessage(`Error: ${message}`);
    }

    /**
     * Muestra un error crítico
     */
    showCriticalError(error) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(139, 0, 0, 0.9);
            color: white;
            padding: 30px;
            border-radius: 10px;
            border: 3px solid #ff0000;
            font-family: 'Times New Roman', serif;
            font-size: 16px;
            text-align: center;
            z-index: 10001;
            box-shadow: 0 0 30px rgba(255, 0, 0, 0.5);
        `;
        errorDiv.innerHTML = `
            <h2 style="color: #ff6666; margin-top: 0;">Error Crítico</h2>
            <p>No se pudo inicializar TerraBuild correctamente.</p>
            <p><strong>Detalle:</strong> ${error.message}</p>
            <button onclick="location.reload()" style="
                background: #ff6666;
                border: 2px solid #ff0000;
                color: white;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 14px;
                margin-top: 15px;
            ">Recargar Página</button>
        `;
        
        document.body.appendChild(errorDiv);
    }

    /**
     * Obtiene el estado del sistema
     */
    getSystemStatus() {
        return {
            initialized: this.isInitialized,
            gameStarted: this.gameStarted,
            systems: {
                mapLoader: !!this.systems.mapLoader,
                gameSystem: !!this.systems.gameSystem,
                craftingSystem: !!this.systems.craftingSystem,
                craftingUI: !!window.craftingUI,
                medievalWorld: !!window.medievalWorld
            }
        };
    }
}

// Crear instancia global del sistema de integración
window.terraBuild = new TerraBuildIntegration();

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM listo, iniciando TerraBuild...');
    
    // Esperar un momento para que todos los scripts se carguen
    setTimeout(async () => {
        const success = await window.terraBuild.initializeAll();
        
        if (success) {
            console.log('TerraBuild está listo para jugar');
            // Mostrar mensaje de bienvenida
            setTimeout(() => {
                window.terraBuild.showGameMessage('¡TerraBuild está listo!\n\nSelecciona una opción del menú principal');
            }, 1000);
        }
    }, 1000);
});

// Prevenir errores de consola
window.addEventListener('load', () => {
    console.log('Página completamente cargada');
    
    // Verificar que Three.js esté disponible
    if (typeof THREE === 'undefined') {
        console.warn('THREE.js no está disponible, algunas funciones pueden no funcionar');
    }
});

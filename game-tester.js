/**
 * Sistema de Pruebas para TerraBuild
 * Verifica que todos los componentes funcionen correctamente
 */

class GameTester {
    constructor() {
        this.tests = [];
        this.results = [];
        this.isRunning = false;
        
        console.log('Sistema de pruebas inicializado');
    }

    /**
     * Ejecuta todas las pruebas
     */
    async runAllTests() {
        if (this.isRunning) {
            console.log('Las pruebas ya están en ejecución');
            return;
        }
        
        this.isRunning = true;
        this.results = [];
        
        console.log('=== INICIANDO PRUEBAS DEL SISTEMA TERRABUILD ===');
        
        try {
            // 1. Pruebas de componentes básicos
            await this.testBasicComponents();
            
            // 2. Pruebas del sistema de mapas
            await this.testMapSystem();
            
            // 3. Pruebas del sistema de fabricación
            await this.testCraftingSystem();
            
            // 4. Pruebas del sistema de juego
            await this.testGameSystem();
            
            // 5. Pruebas de integración
            await this.testIntegration();
            
            // 6. Pruebas de UI
            await this.testUI();
            
            this.generateReport();
            
        } catch (error) {
            console.error('Error en las pruebas:', error);
        } finally {
            this.isRunning = false;
        }
    }

    /**
     * Prueba componentes básicos
     */
    async testBasicComponents() {
        this.addTest('Verificar THREE.js', () => {
            return typeof THREE !== 'undefined';
        });
        
        this.addTest('Verificar objetos globales', () => {
            return window.terraBuild && window.mapLoader && window.craftingSystem;
        });
        
        this.addTest('Verificar DOM', () => {
            return document.getElementById('mainMenu') && document.getElementById('gameScreen');
        });
    }

    /**
     * Prueba el sistema de mapas
     */
    async testMapSystem() {
        this.addTest('MapLoader inicializado', () => {
            return window.mapLoader && window.mapLoader.maps && window.mapLoader.maps.length > 0;
        });
        
        this.addTest('Mapas disponibles', () => {
            return window.mapLoader.maps.length === 4;
        });
        
        this.addTest('Validador de mapas', () => {
            return window.mapValidator && typeof window.mapValidator.validateAllMaps === 'function';
        });
        
        this.addTest('Lector de Minecraft', () => {
            return window.minecraftMapReader && typeof window.minecraftMapReader.processMapRegion === 'function';
        });
    }

    /**
     * Prueba el sistema de fabricación
     */
    async testCraftingSystem() {
        this.addTest('CraftingSystem inicializado', () => {
            return window.craftingSystem && window.craftingSystem.recipes.size > 0;
        });
        
        this.addTest('Recetas de fabricación', () => {
            return window.craftingSystem.recipes.size >= 20;
        });
        
        this.addTest('CraftingUI disponible', () => {
            return window.craftingUI && typeof window.craftingUI.open === 'function';
        });
        
        this.addTest('Demostración de fabricación', () => {
            return window.craftingDemo && typeof window.craftingDemo.runFullDemo === 'function';
        });
    }

    /**
     * Prueba el sistema de juego
     */
    async testGameSystem() {
        this.addTest('GameSystem disponible', () => {
            return window.gameSystem && typeof window.gameSystem.start === 'function';
        });
        
        this.addTest('Mundo medieval disponible', () => {
            return window.medievalWorld || typeof window.initMedievalWorld === 'function';
        });
        
        this.addTest('Cargador de personajes', () => {
            return window.characterLoader || typeof window.initCharacterLoader === 'function';
        });
        
        this.addTest('Gestor de entidades', () => {
            return window.entityManager || typeof window.initEntityManager === 'function';
        });
    }

    /**
     * Prueba la integración
     */
    async testIntegration() {
        this.addTest('Sistema de integración', () => {
            return window.terraBuild && typeof window.terraBuild.initializeAll === 'function';
        });
        
        this.addTest('Funciones globales', () => {
            return typeof window.startGame === 'function' && 
                   typeof window.openCrafting === 'function' &&
                   typeof window.backToMenu === 'function';
        });
        
        this.addTest('Estado del sistema', () => {
            const status = window.terraBuild.getSystemStatus();
            return status && typeof status.initialized === 'boolean';
        });
    }

    /**
     * Prueba la UI
     */
    async testUI() {
        this.addTest('Menú principal visible', () => {
            const menu = document.getElementById('mainMenu');
            return menu && menu.style.display !== 'none';
        });
        
        this.addTest('Pantalla de juego disponible', () => {
            return document.getElementById('gameScreen');
        });
        
        this.addTest('Botones del menú', () => {
            const buttons = document.querySelectorAll('.menu-item');
            return buttons.length >= 5;
        });
        
        this.addTest('Estilos CSS cargados', () => {
            const styles = document.getElementsByTagName('style');
            return styles.length > 0;
        });
    }

    /**
     * Agrega una prueba
     */
    addTest(name, testFunction) {
        this.tests.push({ name, testFunction });
    }

    /**
     * Ejecuta una prueba
     */
    async runTest(test) {
        try {
            const startTime = Date.now();
            const result = await test.testFunction();
            const endTime = Date.now();
            
            return {
                name: test.name,
                passed: result === true,
                duration: endTime - startTime,
                error: null
            };
        } catch (error) {
            return {
                name: test.name,
                passed: false,
                duration: 0,
                error: error.message
            };
        }
    }

    /**
     * Genera un reporte de las pruebas
     */
    generateReport() {
        console.log('\n=== REPORTE DE PRUEBAS TERRABUILD ===');
        
        const passed = this.results.filter(r => r.passed).length;
        const failed = this.results.filter(r => !r.passed).length;
        const total = this.results.length;
        
        console.log(`\nResumen: ${passed}/${total} pruebas pasaron (${failed} fallaron)`);
        console.log(`Tasa de éxito: ${((passed / total) * 100).toFixed(1)}%`);
        
        if (passed > 0) {
            console.log('\nPruebas exitosas:');
            this.results.filter(r => r.passed).forEach(test => {
                console.log(`  ${test.name} (${test.duration}ms)`);
            });
        }
        
        if (failed > 0) {
            console.log('\nPruebas fallidas:');
            this.results.filter(r => !r.passed).forEach(test => {
                console.log(`  ${test.name} - ${test.error || 'Fallo desconocido'}`);
            });
        }
        
        // Recomendaciones
        console.log('\nRecomendaciones:');
        if (failed === 0) {
            console.log('  Sistema completamente funcional - ¡Listo para jugar!');
        } else if (failed <= 2) {
            console.log('  Sistema mayormente funcional - Algunas características pueden no estar disponibles');
        } else {
            console.log('  Sistema necesita atención - Revisa los errores antes de jugar');
        }
        
        // Guardar resultados
        this.testResults = {
            timestamp: new Date().toISOString(),
            total,
            passed,
            failed,
            successRate: (passed / total) * 100,
            results: this.results
        };
        
        return this.testResults;
    }

    /**
     * Muestra el estado actual del sistema
     */
    showSystemStatus() {
        console.log('\n=== ESTADO ACTUAL DEL SISTEMA ===');
        
        const status = {
            integration: window.terraBuild ? window.terraBuild.getSystemStatus() : null,
            maps: window.mapLoader ? {
                loaded: window.mapLoader.maps.length,
                available: window.mapLoader.maps.map(m => m.name)
            } : null,
            crafting: window.craftingSystem ? {
                recipes: window.craftingSystem.recipes.size,
                materials: window.craftingSystem.materials.size
            } : null,
            game: window.gameSystem ? {
                running: window.gameSystem.isRunning,
                initialized: window.gameSystem.initialized
            } : null
        };
        
        console.log('Integración:', status.integration);
        console.log('Mapas:', status.maps);
        console.log('Fabricación:', status.crafting);
        console.log('Juego:', status.game);
        
        return status;
    }

    /**
     * Prueba una función específica
     */
    async testFunction(functionName, ...args) {
        try {
            const func = window[functionName];
            if (typeof func === 'function') {
                const result = await func(...args);
                console.log(`${functionName}: ${result ? 'EXITOSO' : 'FALLO'}`);
                return result;
            } else {
                console.log(`${functionName}: NO DISPONIBLE`);
                return false;
            }
        } catch (error) {
            console.error(`${functionName}: ERROR - ${error.message}`);
            return false;
        }
    }

    /**
     * Verifica que el juego esté listo para jugar
     */
    async verifyGameReady() {
        console.log('\n=== VERIFICANDO QUE EL JUEGO ESTÉ LISTO ===');
        
        const checks = [
            { name: 'Integración inicializada', check: () => window.terraBuild && window.terraBuild.isInitialized },
            { name: 'Mapas cargados', check: () => window.mapLoader && window.mapLoader.maps.length > 0 },
            { name: 'Sistema de fabricación listo', check: () => window.craftingSystem && window.craftingSystem.recipes.size > 0 },
            { name: 'UI del menú funcional', check: () => document.getElementById('mainMenu') },
            { name: 'Controles configurados', check: () => typeof window.startGame === 'function' }
        ];
        
        let ready = true;
        for (const { name, check } of checks) {
            try {
                const result = check();
                console.log(`${name}: ${result ? 'LISTO' : 'NO LISTO'}`);
                if (!result) ready = false;
            } catch (error) {
                console.log(`${name}: ERROR - ${error.message}`);
                ready = false;
            }
        }
        
        console.log(`\nEstado general: ${ready ? 'LISTO PARA JUGAR' : 'NEEDS ATTENTION'}`);
        
        if (ready) {
            console.log('\n¡TerraBuild está completamente listo para jugar!');
            console.log('Puedes seleccionar cualquier opción del menú principal.');
        } else {
            console.log('\nAlgunos componentes necesitan atención, pero el juego debe ser funcional.');
        }
        
        return ready;
    }
}

// Crear instancia global del sistema de pruebas
window.gameTester = new GameTester();

// Funciones globales para pruebas
window.runTests = () => window.gameTester.runAllTests();
window.verifyGameReady = () => window.gameTester.verifyGameReady();
window.showSystemStatus = () => window.gameTester.showSystemStatus();

// Auto-verificar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        console.log('Ejecutando verificación automática del juego...');
        window.gameTester.verifyGameReady();
    }, 2000);
});

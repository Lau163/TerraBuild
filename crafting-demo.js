/**
 * Demostración del Sistema de Fabricación Medieval
 * Script para probar y demostrar el funcionamiento del crafting
 */

class CraftingDemo {
    constructor() {
        this.craftingSystem = window.craftingSystem;
        this.craftingUI = window.craftingUI;
        
        console.log('Demo de fabricación medieval inicializada');
        this.setupDemoMaterials();
    }

    /**
     * Configura materiales de demostración
     */
    setupDemoMaterials() {
        // Agregar materiales de prueba al inventario
        const demoMaterials = {
            'madera': 20,
            'piedra': 15,
            'hierro': 10,
            'oro': 5,
            'diamante': 2,
            'palo': 30,
            'cuerda': 10,
            'pedernal': 8,
            'polvo_redstone': 6
        };

        Object.entries(demoMaterials).forEach(([material, count]) => {
            this.craftingUI.inventory.set(material, count);
        });

        console.log('Materiales de demostración configurados:', demoMaterials);
    }

    /**
     * Muestra estadísticas del sistema de fabricación
     */
    showCraftingStats() {
        const stats = {
            totalRecipes: this.craftingSystem.recipes.size,
            totalMaterials: this.craftingSystem.materials.size,
            categories: {
                herramientas: this.craftingSystem.getRecipesByType('herramienta').length,
                armas: this.craftingSystem.getRecipesByType('arma').length,
                armadura: this.craftingSystem.getRecipesByType('armadura').length,
                magico: this.craftingSystem.getRecipesByType('magico').length,
                objeto: this.craftingSystem.getRecipesByType('objeto').length
            }
        };

        console.log('=== ESTADÍSTICAS DEL SISTEMA DE FABRICACIÓN ===');
        console.log(`Total de recetas: ${stats.totalRecipes}`);
        console.log(`Total de materiales: ${stats.totalMaterials}`);
        console.log('Recetas por categoría:');
        Object.entries(stats.categories).forEach(([category, count]) => {
            console.log(`  - ${category}: ${count}`);
        });

        return stats;
    }

    /**
     * Demuestra el crafting de cada categoría
     */
    demonstrateCrafting() {
        console.log('\n=== DEMOSTRACIÓN DE FABRICACIÓN ===');
        
        // Herramientas básicas
        this.demonstrateToolCrafting();
        
        // Armas
        this.demonstrateWeaponCrafting();
        
        // Armadura
        this.demonstrateArmorCrafting();
        
        // Objetos especiales
        this.demonstrateSpecialCrafting();
    }

    /**
     * Demuestra el crafting de herramientas
     */
    demonstrateToolCrafting() {
        console.log('\n--- HERRAMIENTAS BÁSICAS ---');
        
        const tools = ['hacha', 'pico', 'pala', 'azada'];
        const materials = ['madera', 'piedra', 'hierro'];
        
        tools.forEach(tool => {
            materials.forEach(material => {
                const recipeId = `${material}_${tool}`;
                const recipe = this.craftingSystem.recipes.get(recipeId);
                
                if (recipe) {
                    // Simular el patrón de crafting
                    this.craftingSystem.craftingGrid = this.simulateCraftingPattern(recipe);
                    const result = this.craftingSystem.checkRecipe();
                    
                    if (result) {
                        console.log(`  ${recipe.name}: ${recipe.description}`);
                        console.log(`    Durabilidad: ${recipe.durability}`);
                        console.log(`    Patrón: ${recipe.pattern.join(' | ')}`);
                    }
                }
            });
        });
    }

    /**
     * Demuestra el crafting de armas
     */
    demonstrateWeaponCrafting() {
        console.log('\n--- ARMAS MEDIEVALES ---');
        
        const weapons = ['espada'];
        const materials = ['hierro', 'diamante'];
        
        weapons.forEach(weapon => {
            materials.forEach(material => {
                const recipeId = `${material}_${weapon}`;
                const recipe = this.craftingSystem.recipes.get(recipeId);
                
                if (recipe) {
                    console.log(`  ${recipe.name}:`);
                    console.log(`    Daño: ${recipe.damage}`);
                    console.log(`    Durabilidad: ${recipe.durability}`);
                    console.log(`    Descripción: ${recipe.description}`);
                }
            });
        });

        // Arco especial
        const bowRecipe = this.craftingSystem.recipes.get('arco');
        if (bowRecipe) {
            console.log(`  ${bowRecipe.name}:`);
            console.log(`    Tipo: ${bowRecipe.type}`);
            console.log(`    Durabilidad: ${bowRecipe.durability}`);
            console.log(`    Descripción: ${bowRecipe.description}`);
        }
    }

    /**
     * Demuestra el crafting de armadura
     */
    demonstrateArmorCrafting() {
        console.log('\n--- ARMADURA MEDIEVAL ---');
        
        const armors = ['casco', 'pechera'];
        const materials = ['hierro', 'diamante'];
        
        armors.forEach(armor => {
            materials.forEach(material => {
                const recipeId = `${material}_${armor}`;
                const recipe = this.craftingSystem.recipes.get(recipeId);
                
                if (recipe) {
                    console.log(`  ${recipe.name}:`);
                    console.log(`    Protección: ${recipe.protection}`);
                    console.log(`    Durabilidad: ${recipe.durability}`);
                    console.log(`    Slot: ${recipe.slot}`);
                    console.log(`    Descripción: ${recipe.description}`);
                }
            });
        });
    }

    /**
     * Demuestra el crafting de objetos especiales
     */
    demonstrateSpecialCrafting() {
        console.log('\n--- OBJETOS ESPECIALES Y MÁGICOS ---');
        
        const specialItems = ['mechero', 'tijeras', 'cana_pesca', 'cubeta', 'brujula', 'reloj', 'varita_magica', 'amuleto_proteccion'];
        
        specialItems.forEach(itemId => {
            const recipe = this.craftingSystem.recipes.get(itemId);
            if (recipe) {
                console.log(`  ${recipe.name}:`);
                console.log(`    Tipo: ${recipe.type}`);
                console.log(`    Durabilidad: ${recipe.durability}`);
                if (recipe.damage) console.log(`    Daño: ${recipe.damage}`);
                if (recipe.protection) console.log(`    Protección: ${recipe.protection}`);
                console.log(`    Descripción: ${recipe.description}`);
                console.log(`    Materiales: ${this.formatRecipeIngredients(recipe.ingredients)}`);
            }
        });
    }

    /**
     * Simula un patrón de crafting en el grid
     */
    simulateCraftingPattern(recipe) {
        const grid = Array(9).fill(null);
        const pattern = recipe.pattern;
        const ingredients = recipe.ingredients;
        
        pattern.forEach((row, y) => {
            row.split('').forEach((cell, x) => {
                const gridIndex = y * 3 + x;
                if (cell === 'X') {
                    grid[gridIndex] = ingredients[`${x}${y}`];
                } else if (cell === 'S') {
                    grid[gridIndex] = 'palo';
                }
            });
        });
        
        return grid;
    }

    /**
     * Formatea los ingredientes de una receta
     */
    formatRecipeIngredients(ingredients) {
        const materialCounts = {};
        Object.values(ingredients).forEach(material => {
            materialCounts[material] = (materialCounts[material] || 0) + 1;
        });
        
        return Object.entries(materialCounts)
            .map(([material, count]) => `${count}x ${this.craftingSystem.materials.get(material)?.name || material}`)
            .join(', ');
    }

    /**
     * Realiza una demostración interactiva
     */
    runInteractiveDemo() {
        console.log('\n=== DEMOSTRACIÓN INTERACTIVA ===');
        
        // Demostrar crafting de un hacha de hierro
        console.log('\n1. Fabricando un Hacha de Hierro...');
        this.craftItemDemo('hierro_hacha');
        
        // Demostrar crafting de una espada de diamante
        console.log('\n2. Fabricando una Espada de Diamante...');
        this.craftItemDemo('diamante_espada');
        
        // Demostrar crafting de una brújula
        console.log('\n3. Fabricando una Brújula...');
        this.craftItemDemo('brujula');
        
        // Demostrar crafting de una varita mágica
        console.log('\n4. Fabricando una Varita Mágica...');
        this.craftItemDemo('varita_magica');
    }

    /**
     * Demuestra el crafting de un item específico
     */
    craftItemDemo(recipeId) {
        const recipe = this.craftingSystem.recipes.get(recipeId);
        if (!recipe) {
            console.log(`  Error: Receta ${recipeId} no encontrada`);
            return;
        }

        console.log(`  Receta: ${recipe.name}`);
        console.log(`  Materiales necesarios: ${this.formatRecipeIngredients(recipe.ingredients)}`);
        
        // Simular el patrón
        this.craftingSystem.craftingGrid = this.simulateCraftingPattern(recipe);
        
        // Verificar receta
        const result = this.craftingSystem.checkRecipe();
        if (result) {
            console.log(`  Receta válida: ${result.name}`);
            
            // Fabricar el item
            const craftResult = this.craftingSystem.craft();
            if (craftResult.success) {
                console.log(`  Item fabricado: ${craftResult.item.name}`);
                console.log(`  Propiedades: Durabilidad=${craftResult.item.durability}, Tipo=${craftResult.item.type}`);
                
                // Agregar al inventario
                this.craftingUI.addToInventory(craftResult.item);
                console.log(`  Item agregado al inventario`);
            } else {
                console.log(`  Error al fabricar: ${craftResult.error}`);
            }
        } else {
            console.log(`  Error: Patrón de crafting inválido`);
        }
        
        // Limpiar el grid
        this.craftingSystem.clearGrid();
    }

    /**
     * Muestra el inventario actual
     */
    showInventory() {
        console.log('\n=== INVENTARIO ACTUAL ===');
        
        if (this.craftingUI.inventory.size === 0) {
            console.log('Inventario vacío');
            return;
        }
        
        this.craftingUI.inventory.forEach((count, itemId) => {
            const recipe = this.craftingSystem.recipes.get(itemId);
            const itemName = recipe ? recipe.name : itemId;
            console.log(`  ${count}x ${itemName}`);
        });
    }

    /**
     * Ejecuta la demostración completa
     */
    runFullDemo() {
        console.log('INICIANDO DEMOSTRACIÓN COMPLETA DEL SISTEMA DE FABRICACIÓN MEDIEVAL');
        console.log('================================================================');
        
        // Mostrar estadísticas
        this.showCraftingStats();
        
        // Demostrar crafting
        this.demonstrateCrafting();
        
        // Demostración interactiva
        this.runInteractiveDemo();
        
        // Mostrar inventario final
        this.showInventory();
        
        console.log('\n=== DEMOSTRACIÓN COMPLETADA ===');
        console.log('Para abrir la interfaz de fabricación, usa: window.openCrafting()');
        console.log('Para ver las estadísticas, usa: window.craftingDemo.showCraftingStats()');
    }
}

// Crear instancia global de demo
window.craftingDemo = new CraftingDemo();

// Auto-ejecutar demo cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        console.log('Ejecutando demostración automática del sistema de fabricación...');
        window.craftingDemo.runFullDemo();
    }, 2000);
});

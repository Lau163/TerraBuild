/**
 * Sistema de Fabricación Medieval para TerraBuild
 * Adaptado del sistema de crafting de Minecraft con estilo medieval
 */

class CraftingSystem {
    constructor() {
        this.recipes = new Map();
        this.materials = new Map();
        this.craftingGrid = Array(9).fill(null);
        this.resultSlot = null;
        
        console.log('Sistema de fabricación medieval inicializado');
        this.initializeMaterials();
        this.initializeRecipes();
    }

    /**
     * Inicializa los materiales disponibles
     */
    initializeMaterials() {
        // Materiales básicos
        this.materials.set('madera', {
            name: 'Madera',
            icon: 'wood',
            durability: 1,
            rarity: 'comun'
        });
        
        this.materials.set('piedra', {
            name: 'Piedra',
            icon: 'stone',
            durability: 2,
            rarity: 'comun'
        });
        
        this.materials.set('hierro', {
            name: 'Hierro',
            icon: 'iron',
            durability: 3,
            rarity: 'raro'
        });
        
        this.materials.set('oro', {
            name: 'Oro',
            icon: 'gold',
            durability: 2,
            rarity: 'epico'
        });
        
        this.materials.set('diamante', {
            name: 'Diamante',
            icon: 'diamond',
            durability: 5,
            rarity: 'legendario'
        });
        
        // Componentes adicionales
        this.materials.set('palo', {
            name: 'Mango de Palo',
            icon: 'stick',
            durability: 1,
            rarity: 'comun'
        });
        
        this.materials.set('cuerda', {
            name: 'Cuerda',
            icon: 'string',
            durability: 1,
            rarity: 'comun'
        });
        
        this.materials.set('pedernal', {
            name: 'Pedernal',
            icon: 'flint',
            durability: 1,
            rarity: 'comun'
        });
        
        this.materials.set('polvo_redstone', {
            name: 'Polvo de Redstone',
            icon: 'redstone',
            durability: 1,
            rarity: 'raro'
        });
    }

    /**
     * Inicializa todas las recetas de fabricación
     */
    initializeRecipes() {
        // === HERRAMIENTAS BÁSICAS ===
        
        // Hachas
        this.addToolRecipe('hacha', ['madera', 'piedra', 'hierro', 'oro', 'diamante'], {
            pattern: ['XX', 'XS', ' S'],
            description: 'Herramienta para talar árboles'
        });
        
        // Picotas
        this.addToolRecipe('pico', ['madera', 'piedra', 'hierro', 'oro', 'diamante'], {
            pattern: ['XXX', ' S ', ' S '],
            description: 'Herramienta para minar rocas'
        });
        
        // Palas
        this.addToolRecipe('pala', ['madera', 'piedra', 'hierro', 'oro', 'diamante'], {
            pattern: [' X ', ' S ', ' S '],
            description: 'Herramienta para cavar tierra'
        });
        
        // Azadas
        this.addToolRecipe('azada', ['madera', 'piedra', 'hierro', 'oro', 'diamante'], {
            pattern: ['XX', ' S ', ' S '],
            description: 'Herramienta para agricultura'
        });

        // === HERRAMIENTAS ESPECIALES ===
        
        // Mechero
        this.addRecipe('mechero', {
            name: 'Mechero Medieval',
            pattern: ['   ', 'XF ', '   '],
            ingredients: { 'X': 'hierro', 'F': 'pedernal' },
            description: 'Crea fuego para antorchas',
            type: 'herramienta',
            durability: 50
        });

        // Tijeras
        this.addRecipe('tijeras', {
            name: 'Tijeras de Hierro',
            pattern: ['X  ', '   ', ' X '],
            ingredients: { 'X': 'hierro' },
            description: 'Corta lana y hojas',
            type: 'herramienta',
            durability: 100
        });

        // Caña de pescar
        this.addRecipe('cana_pesca', {
            name: 'Caña de Pescar',
            pattern: ['  X', ' X ', 'X X'],
            ingredients: { 'X': 'palo', 'S': 'cuerda' },
            description: 'Para pescar en ríos y lagos',
            type: 'herramienta',
            durability: 64
        });

        // === OBJETOS UTILITARIOS ===
        
        // Cubo
        this.addRecipe('cubeta', {
            name: 'Cubeta de Hierro',
            pattern: ['X X', ' X ', '   '],
            ingredients: { 'X': 'hierro' },
            description: 'Transporta líquidos',
            type: 'objeto',
            durability: 1000
        });

        // Brújula
        this.addRecipe('brujula', {
            name: 'Brújula Navegante',
            pattern: [' X ', 'XSX', ' X '],
            ingredients: { 'X': 'hierro', 'S': 'polvo_redstone' },
            description: 'Siempre apunta al spawn',
            type: 'herramienta',
            durability: 500
        });

        // Reloj
        this.addRecipe('reloj', {
            name: 'Reloj de Sol',
            pattern: [' X ', 'XSX', ' X '],
            ingredients: { 'X': 'oro', 'S': 'polvo_redstone' },
            description: 'Muestra el tiempo del día',
            type: 'herramienta',
            durability: 500
        });

        // === ARMAS MEDIEVALES ===
        
        // Espada básica
        this.addWeaponRecipe('espada', ['madera', 'piedra', 'hierro', 'oro', 'diamante'], {
            pattern: [' X ', ' X ', ' S '],
            description: 'Arma de combate cuerpo a cuerpo'
        });

        // Arco
        this.addRecipe('arco', {
            name: 'Arco Largo',
            pattern: ['X S', 'XS ', 'X S'],
            ingredients: { 'X': 'palo', 'S': 'cuerda' },
            description: 'Arma a distancia',
            type: 'arma',
            durability: 150
        });

        // === ARMADURA BÁSICA ===
        
        // Casco
        this.addArmorRecipe('casco', ['madera', 'piedra', 'hierro', 'oro', 'diamante'], {
            pattern: ['XXX', 'X X', '   '],
            description: 'Protección para la cabeza',
            slot: 'cabeza'
        });

        // Pechera
        this.addArmorRecipe('pechera', ['madera', 'piedra', 'hierro', 'oro', 'diamante'], {
            pattern: ['X X', 'XXX', 'XXX'],
            description: 'Protección para el torso',
            slot: 'pecho'
        });

        // === OBJETOS MÁGICOS ===
        
        // Varita mágica
        this.addRecipe('varita_magica', {
            name: 'Varita de Hechicero',
            pattern: ['  X', ' S ', 'S  '],
            ingredients: { 'X': 'diamante', 'S': 'palo' },
            description: 'Lanza hechizos elementales',
            type: 'magico',
            durability: 200
        });

        // Amuleto de protección
        this.addRecipe('amuleto_proteccion', {
            name: 'Amuleto Sagrado',
            pattern: [' X ', 'XSX', ' X '],
            ingredients: { 'X': 'oro', 'S': 'diamante' },
            description: 'Protección mágica',
            type: 'accesorio',
            durability: 1000
        });

        console.log(`${this.recipes.size} recetas de fabricación cargadas`);
    }

    /**
     * Agrega una receta de herramienta con múltiples materiales
     */
    addToolRecipe(toolName, materials, config) {
        materials.forEach(material => {
            const recipe = {
                name: `${this.materials.get(material).name} ${toolName}`,
                pattern: config.pattern,
                ingredients: this.parsePattern(config.pattern, material),
                description: config.description,
                type: 'herramienta',
                durability: this.getToolDurability(material),
                material: material,
                tool: toolName
            };
            this.recipes.set(`${material}_${toolName}`, recipe);
        });
    }

    /**
     * Agrega una receta de arma con múltiples materiales
     */
    addWeaponRecipe(weaponName, materials, config) {
        materials.forEach(material => {
            const recipe = {
                name: `${this.materials.get(material).name} ${weaponName}`,
                pattern: config.pattern,
                ingredients: this.parsePattern(config.pattern, material),
                description: config.description,
                type: 'arma',
                damage: this.getWeaponDamage(material),
                durability: this.getWeaponDurability(material),
                material: material,
                weapon: weaponName
            };
            this.recipes.set(`${material}_${weaponName}`, recipe);
        });
    }

    /**
     * Agrega una receta de armadura con múltiples materiales
     */
    addArmorRecipe(armorName, materials, config) {
        materials.forEach(material => {
            const recipe = {
                name: `${this.materials.get(material).name} ${armorName}`,
                pattern: config.pattern,
                ingredients: this.parsePattern(config.pattern, material),
                description: config.description,
                type: 'armadura',
                protection: this.getArmorProtection(material),
                durability: this.getArmorDurability(material),
                material: material,
                armor: armorName,
                slot: config.slot
            };
            this.recipes.set(`${material}_${armorName}`, recipe);
        });
    }

    /**
     * Agrega una receta simple
     */
    addRecipe(id, config) {
        const recipe = {
            name: config.name,
            pattern: config.pattern,
            ingredients: config.ingredients,
            description: config.description,
            type: config.type,
            durability: config.durability || 100
        };
        
        if (config.damage) recipe.damage = config.damage;
        if (config.protection) recipe.protection = config.protection;
        if (config.slot) recipe.slot = config.slot;
        
        this.recipes.set(id, recipe);
    }

    /**
     * Convierte un patrón de crafting a ingredientes
     */
    parsePattern(pattern, material) {
        const ingredients = {};
        pattern.forEach((row, y) => {
            row.split('').forEach((cell, x) => {
                if (cell === 'X') {
                    ingredients[`${x}${y}`] = material;
                } else if (cell === 'S') {
                    ingredients[`${x}${y}`] = 'palo';
                }
            });
        });
        return ingredients;
    }

    /**
     * Obtiene la durabilidad de una herramienta según el material
     */
    getToolDurability(material) {
        const durabilityMap = {
            'madera': 60,
            'piedra': 132,
            'hierro': 251,
            'oro': 33,
            'diamante': 1562
        };
        return durabilityMap[material] || 100;
    }

    /**
     * Obtiene el daño de un arma según el material
     */
    getWeaponDamage(material) {
        const damageMap = {
            'madera': 4,
            'piedra': 5,
            'hierro': 6,
            'oro': 4,
            'diamante': 7
        };
        return damageMap[material] || 3;
    }

    /**
     * Obtiene la durabilidad de un arma según el material
     */
    getWeaponDurability(material) {
        const durabilityMap = {
            'madera': 60,
            'piedra': 132,
            'hierro': 251,
            'oro': 33,
            'diamante': 1562
        };
        return durabilityMap[material] || 100;
    }

    /**
     * Obtiene la protección de armadura según el material
     */
    getArmorProtection(material) {
        const protectionMap = {
            'madera': 1,
            'piedra': 2,
            'hierro': 4,
            'oro': 2,
            'diamante': 8
        };
        return protectionMap[material] || 1;
    }

    /**
     * Obtiene la durabilidad de armadura según el material
     */
    getArmorDurability(material) {
        const durabilityMap = {
            'madera': 60,
            'piedra': 132,
            'hierro': 240,
            'oro': 100,
            'diamante': 500
        };
        return durabilityMap[material] || 100;
    }

    /**
     * Verifica si una receta puede ser fabricada con el grid actual
     */
    checkRecipe() {
        for (const [recipeId, recipe] of this.recipes) {
            if (this.matchesPattern(recipe)) {
                this.resultSlot = {
                    item: recipeId,
                    recipe: recipe
                };
                return recipe;
            }
        }
        this.resultSlot = null;
        return null;
    }

    /**
     * Verifica si el grid actual coincide con el patrón de una receta
     */
    matchesPattern(recipe) {
        const pattern = recipe.pattern;
        const ingredients = recipe.ingredients;
        
        for (let y = 0; y < pattern.length; y++) {
            for (let x = 0; x < pattern[y].length; x++) {
                const cell = pattern[y][x];
                const gridIndex = y * 3 + x;
                const gridItem = this.craftingGrid[gridIndex];
                
                if (cell === 'X') {
                    const requiredMaterial = ingredients[`${x}${y}`];
                    if (!gridItem || gridItem !== requiredMaterial) {
                        return false;
                    }
                } else if (cell === 'S') {
                    if (!gridItem || gridItem !== 'palo') {
                        return false;
                    }
                } else if (cell === ' ') {
                    if (gridItem) {
                        return false;
                    }
                }
            }
        }
        
        return true;
    }

    /**
     * Fabrica el item del resultado
     */
    craft() {
        if (!this.resultSlot) {
            return { success: false, error: 'No hay receta válida' };
        }
        
        const recipe = this.resultSlot.recipe;
        
        // Consumir materiales del grid
        this.craftingGrid = Array(9).fill(null);
        
        // Crear el item fabricado
        const craftedItem = {
            id: this.resultSlot.item,
            name: recipe.name,
            type: recipe.type,
            description: recipe.description,
            durability: recipe.durability,
            damage: recipe.damage,
            protection: recipe.protection,
            slot: recipe.slot,
            material: recipe.material
        };
        
        console.log(`Item fabricado: ${craftedItem.name}`);
        
        // Limpiar resultado
        this.resultSlot = null;
        
        return { 
            success: true, 
            item: craftedItem,
            message: `${craftedItem.name} fabricado exitosamente`
        };
    }

    /**
     * Limpia el grid de crafting
     */
    clearGrid() {
        this.craftingGrid = Array(9).fill(null);
        this.resultSlot = null;
    }

    /**
     * Obtiene todas las recetas disponibles
     */
    getAllRecipes() {
        return Array.from(this.recipes.entries()).map(([id, recipe]) => ({
            id,
            ...recipe
        }));
    }

    /**
     * Obtiene recetas por tipo
     */
    getRecipesByType(type) {
        return this.getAllRecipes().filter(recipe => recipe.type === type);
    }

    /**
     * Obtiene recetas que se pueden fabricar con los materiales disponibles
     */
    getCraftableRecipes(inventory) {
        return this.getAllRecipes().filter(recipe => {
            return Object.values(recipe.ingredients).every(material => 
                inventory.has(material) && inventory.get(material) > 0
            );
        });
    }
}

// Crear instancia global del sistema de fabricación
window.craftingSystem = new CraftingSystem();

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    console.log('Sistema de fabricación medieval listo');
});

/**
 * Interfaz de Usuario del Sistema de Fabricación Medieval
 * UI completa para el sistema de crafting de TerraBuild
 */

class CraftingUI {
    constructor() {
        this.isOpen = false;
        this.craftingSystem = window.craftingSystem;
        this.currentCategory = 'todas';
        this.inventory = new Map(); // Inventario del jugador
        
        console.log('UI de fabricación medieval inicializada');
    }

    /**
     * Abre la interfaz de fabricación
     */
    open() {
        if (this.isOpen) return;
        
        this.isOpen = true;
        this.createCraftingInterface();
        this.setupEventListeners();
        this.updateRecipeList();
        
        console.log('Interfaz de fabricación abierta');
    }

    /**
     * Cierra la interfaz de fabricación
     */
    close() {
        if (!this.isOpen) return;
        
        const craftingUI = document.getElementById('crafting-interface');
        if (craftingUI) {
            document.body.removeChild(craftingUI);
        }
        
        this.isOpen = false;
        console.log('Interfaz de fabricación cerrada');
    }

    /**
     * Crea la interfaz completa de fabricación
     */
    createCraftingInterface() {
        const craftingUI = document.createElement('div');
        craftingUI.id = 'crafting-interface';
        craftingUI.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 900px;
            height: 600px;
            background: linear-gradient(135deg, rgba(139, 69, 19, 0.95), rgba(101, 67, 33, 0.95));
            border: 3px solid #d4af37;
            border-radius: 15px;
            box-shadow: 0 0 30px rgba(212, 175, 55, 0.5);
            z-index: 10000;
            font-family: 'Times New Roman', serif;
            color: #d4af37;
        `;

        craftingUI.innerHTML = `
            <!-- Header -->
            <div class="crafting-header" style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px 20px;
                background: rgba(0, 0, 0, 0.3);
                border-bottom: 2px solid #d4af37;
                border-radius: 12px 12px 0 0;
            ">
                <h2 style="margin: 0; font-size: 24px; text-shadow: 2px 2px 4px rgba(0,0,0,0.8);">
                    Mesa de Fabricación Medieval
                </h2>
                <div style="display: flex; gap: 10px;">
                    <button onclick="window.backToMenu()" style="
                        background: rgba(212, 175, 55, 0.2);
                        border: 2px solid #d4af37;
                        color: #d4af37;
                        padding: 8px 15px;
                        border-radius: 5px;
                        cursor: pointer;
                        font-family: 'Times New Roman', serif;
                        font-size: 16px;
                    ">Menú</button>
                    <button onclick="window.craftingUI.close()" style="
                        background: rgba(212, 175, 55, 0.2);
                        border: 2px solid #d4af37;
                        color: #d4af37;
                        padding: 8px 15px;
                        border-radius: 5px;
                        cursor: pointer;
                        font-family: 'Times New Roman', serif;
                        font-size: 16px;
                    ">Cerrar</button>
                </div>
            </div>

            <!-- Main Content -->
            <div class="crafting-content" style="
                display: flex;
                height: calc(100% - 60px);
            ">
                <!-- Left Panel - Crafting Grid -->
                <div class="crafting-panel" style="
                    flex: 1;
                    padding: 20px;
                    border-right: 2px solid #d4af37;
                ">
                    <h3 style="margin-top: 0; text-align: center; margin-bottom: 20px;">
                        Mesa de Trabajo
                    </h3>
                    
                    <!-- Crafting Grid 3x3 -->
                    <div class="crafting-grid" style="
                        display: grid;
                        grid-template-columns: repeat(3, 60px);
                        grid-template-rows: repeat(3, 60px);
                        gap: 5px;
                        margin: 0 auto 20px;
                        padding: 15px;
                        background: rgba(0, 0, 0, 0.2);
                        border: 2px solid #d4af37;
                        border-radius: 10px;
                    ">
                        ${this.generateCraftingGrid()}
                    </div>

                    <!-- Result Slot -->
                    <div class="result-slot" style="
                        text-align: center;
                        padding: 15px;
                        background: rgba(0, 0, 0, 0.2);
                        border: 2px solid #d4af37;
                        border-radius: 10px;
                    ">
                        <div style="margin-bottom: 10px; font-weight: bold;">Resultado</div>
                        <div id="result-display" style="
                            width: 60px;
                            height: 60px;
                            margin: 0 auto;
                            background: rgba(0, 0, 0, 0.3);
                            border: 1px solid #d4af37;
                            border-radius: 5px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 12px;
                            color: #888;
                        ">?</div>
                        <div id="result-info" style="margin-top: 10px; font-size: 12px; min-height: 40px;">
                            Arrastra materiales aquí
                        </div>
                    </div>

                    <!-- Craft Button -->
                    <button id="craft-button" onclick="window.craftingUI.craft()" disabled style="
                        width: 100%;
                        padding: 12px;
                        margin-top: 15px;
                        background: rgba(212, 175, 55, 0.3);
                        border: 2px solid #d4af37;
                        color: #d4af37;
                        border-radius: 8px;
                        cursor: pointer;
                        font-family: 'Times New Roman', serif;
                        font-size: 16px;
                        font-weight: bold;
                        text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
                    " disabled>Fabricar</button>
                </div>

                <!-- Right Panel - Recipe Book -->
                <div class="recipe-panel" style="
                    flex: 1;
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                ">
                    <h3 style="margin-top: 0; text-align: center; margin-bottom: 15px;">
                        Libro de Recetas
                    </h3>

                    <!-- Category Filter -->
                    <div class="category-filter" style="
                        display: flex;
                        gap: 10px;
                        margin-bottom: 15px;
                        justify-content: center;
                    ">
                        <button onclick="window.craftingUI.filterRecipes('todas')" class="category-btn active" data-category="todas">Todas</button>
                        <button onclick="window.craftingUI.filterRecipes('herramienta')" class="category-btn" data-category="herramienta">Herramientas</button>
                        <button onclick="window.craftingUI.filterRecipes('arma')" class="category-btn" data-category="arma">Armas</button>
                        <button onclick="window.craftingUI.filterRecipes('armadura')" class="category-btn" data-category="armadura">Armadura</button>
                        <button onclick="window.craftingUI.filterRecipes('magico')" class="category-btn" data-category="magico">Mágico</button>
                    </div>

                    <!-- Recipe List -->
                    <div class="recipe-list" style="
                        flex: 1;
                        overflow-y: auto;
                        background: rgba(0, 0, 0, 0.2);
                        border: 2px solid #d4af37;
                        border-radius: 10px;
                        padding: 10px;
                    ">
                        <div id="recipe-container">
                            <!-- Las recetas se cargarán aquí -->
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Agregar estilos CSS
        this.addCraftingStyles();
        
        document.body.appendChild(craftingUI);
    }

    /**
     * Genera el grid de crafting 3x3
     */
    generateCraftingGrid() {
        let gridHTML = '';
        for (let i = 0; i < 9; i++) {
            gridHTML += `
                <div class="crafting-slot" data-slot="${i}" style="
                    background: rgba(0, 0, 0, 0.3);
                    border: 1px solid #d4af37;
                    border-radius: 5px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                " ondrop="window.craftingUI.handleDrop(event)" ondragover="window.craftingUI.handleDragOver(event)" onclick="window.craftingUI.clearSlot(${i})">
                    <span style="font-size: 10px; color: #666;">${i + 1}</span>
                </div>
            `;
        }
        return gridHTML;
    }

    /**
     * Agrega estilos CSS para la interfaz
     */
    addCraftingStyles() {
        if (document.getElementById('crafting-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'crafting-styles';
        styles.textContent = `
            .crafting-slot:hover {
                background: rgba(212, 175, 55, 0.2) !important;
                transform: scale(1.05);
            }
            
            .crafting-slot.filled {
                background: rgba(212, 175, 55, 0.3) !important;
                border-color: #ffd700 !important;
            }
            
            .category-btn {
                background: rgba(212, 175, 55, 0.2);
                border: 1px solid #d4af37;
                color: #d4af37;
                padding: 5px 10px;
                border-radius: 5px;
                cursor: pointer;
                font-family: 'Times New Roman', serif;
                font-size: 12px;
                transition: all 0.3s ease;
            }
            
            .category-btn:hover {
                background: rgba(212, 175, 55, 0.4);
            }
            
            .category-btn.active {
                background: rgba(212, 175, 55, 0.5);
                border-color: #ffd700;
                color: #ffd700;
            }
            
            .recipe-item {
                background: rgba(0, 0, 0, 0.2);
                border: 1px solid #d4af37;
                border-radius: 8px;
                padding: 10px;
                margin-bottom: 10px;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .recipe-item:hover {
                background: rgba(212, 175, 55, 0.2);
                transform: translateX(5px);
            }
            
            .recipe-name {
                font-weight: bold;
                margin-bottom: 5px;
                color: #ffd700;
            }
            
            .recipe-description {
                font-size: 12px;
                color: #d4af37;
                margin-bottom: 5px;
            }
            
            .recipe-materials {
                font-size: 11px;
                color: #aaa;
            }
            
            #craft-button:not(:disabled):hover {
                background: rgba(212, 175, 55, 0.5) !important;
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(212, 175, 55, 0.3);
            }
            
            #craft-button:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
        `;
        document.head.appendChild(styles);
    }

    /**
     * Configura los event listeners
     */
    setupEventListeners() {
        // Event listener para teclas
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });

        // Event listener para cerrar al hacer clic fuera
        document.getElementById('crafting-interface').addEventListener('click', (e) => {
            if (e.target.id === 'crafting-interface') {
                this.close();
            }
        });
    }

    /**
     * Actualiza la lista de recetas
     */
    updateRecipeList() {
        const container = document.getElementById('recipe-container');
        if (!container) return;

        const recipes = this.currentCategory === 'todas' 
            ? this.craftingSystem.getAllRecipes()
            : this.craftingSystem.getRecipesByType(this.currentCategory);

        container.innerHTML = recipes.map(recipe => `
            <div class="recipe-item" onclick="window.craftingUI.showRecipeDetails('${recipe.id}')">
                <div class="recipe-name">${recipe.name}</div>
                <div class="recipe-description">${recipe.description}</div>
                <div class="recipe-materials">
                    ${this.formatRecipeMaterials(recipe.ingredients)}
                </div>
            </div>
        `).join('');

        if (recipes.length === 0) {
            container.innerHTML = '<div style="text-align: center; color: #888;">No hay recetas en esta categoría</div>';
        }
    }

    /**
     * Formatea los materiales de una receta para mostrar
     */
    formatRecipeMaterials(ingredients) {
        const materialCounts = {};
        Object.values(ingredients).forEach(material => {
            materialCounts[material] = (materialCounts[material] || 0) + 1;
        });
        
        return Object.entries(materialCounts)
            .map(([material, count]) => `${count}x ${this.craftingSystem.materials.get(material)?.name || material}`)
            .join(', ');
    }

    /**
     * Filtra recetas por categoría
     */
    filterRecipes(category) {
        this.currentCategory = category;
        
        // Actualizar botones activos
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === category);
        });
        
        this.updateRecipeList();
    }

    /**
     * Muestra detalles de una receta
     */
    showRecipeDetails(recipeId) {
        const recipe = this.craftingSystem.recipes.get(recipeId);
        if (!recipe) return;

        // Crear modal de detalles
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, rgba(139, 69, 19, 0.95), rgba(101, 67, 33, 0.95));
            border: 3px solid #d4af37;
            border-radius: 15px;
            padding: 20px;
            z-index: 10001;
            min-width: 300px;
            box-shadow: 0 0 30px rgba(212, 175, 55, 0.5);
        `;

        modal.innerHTML = `
            <h3 style="margin-top: 0; color: #ffd700;">${recipe.name}</h3>
            <p style="color: #d4af37;">${recipe.description}</p>
            <div style="margin: 15px 0;">
                <strong style="color: #ffd700;">Materiales:</strong><br>
                ${this.formatRecipeMaterials(recipe.ingredients)}
            </div>
            <div style="margin: 15px 0;">
                <strong style="color: #ffd700;">Propiedades:</strong><br>
                ${this.formatRecipeProperties(recipe)}
            </div>
            <button onclick="this.parentElement.remove()" style="
                background: rgba(212, 175, 55, 0.3);
                border: 2px solid #d4af37;
                color: #d4af37;
                padding: 8px 15px;
                border-radius: 5px;
                cursor: pointer;
                font-family: 'Times New Roman', serif;
            ">Cerrar</button>
        `;

        document.body.appendChild(modal);

        // Cerrar al hacer clic fuera
        setTimeout(() => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.remove();
                }
            });
        }, 100);
    }

    /**
     * Formatea las propiedades de una receta
     */
    formatRecipeProperties(recipe) {
        const properties = [];
        
        if (recipe.durability) {
            properties.push(`Durabilidad: ${recipe.durability}`);
        }
        
        if (recipe.damage) {
            properties.push(`Daño: ${recipe.damage}`);
        }
        
        if (recipe.protection) {
            properties.push(`Protección: ${recipe.protection}`);
        }
        
        if (recipe.type) {
            properties.push(`Tipo: ${recipe.type}`);
        }
        
        return properties.length > 0 ? properties.join('<br>') : 'Sin propiedades especiales';
    }

    /**
     * Maneja el evento de soltar en el grid
     */
    handleDrop(event) {
        event.preventDefault();
        const slot = parseInt(event.target.dataset.slot);
        const material = event.dataTransfer.getData('material');
        
        if (material && !isNaN(slot)) {
            this.setSlotMaterial(slot, material);
        }
    }

    /**
     * Maneja el evento de arrastrar sobre el grid
     */
    handleDragOver(event) {
        event.preventDefault();
    }

    /**
     * Establece un material en un slot del grid
     */
    setSlotMaterial(slot, material) {
        this.craftingSystem.craftingGrid[slot] = material;
        this.updateCraftingGrid();
        this.checkRecipe();
    }

    /**
     * Limpia un slot del grid
     */
    clearSlot(slot) {
        this.craftingSystem.craftingGrid[slot] = null;
        this.updateCraftingGrid();
        this.checkRecipe();
    }

    /**
     * Actualiza la visualización del grid
     */
    updateCraftingGrid() {
        const slots = document.querySelectorAll('.crafting-slot');
        slots.forEach((slot, index) => {
            const material = this.craftingSystem.craftingGrid[index];
            if (material) {
                slot.classList.add('filled');
                slot.innerHTML = `
                    <div style="text-align: center;">
                        <div style="font-size: 10px; color: #ffd700;">${this.craftingSystem.materials.get(material)?.name || material}</div>
                    </div>
                `;
            } else {
                slot.classList.remove('filled');
                slot.innerHTML = `<span style="font-size: 10px; color: #666;">${index + 1}</span>`;
            }
        });
    }

    /**
     * Verifica si hay una receta válida
     */
    checkRecipe() {
        const recipe = this.craftingSystem.checkRecipe();
        const resultDisplay = document.getElementById('result-display');
        const resultInfo = document.getElementById('result-info');
        const craftButton = document.getElementById('craft-button');
        
        if (recipe) {
            resultDisplay.innerHTML = `
                <div style="text-align: center;">
                    <div style="font-size: 10px; color: #ffd700; font-weight: bold;">${recipe.name}</div>
                </div>
            `;
            resultInfo.textContent = recipe.description;
            craftButton.disabled = false;
            craftButton.textContent = 'Fabricar';
        } else {
            resultDisplay.innerHTML = '?';
            resultInfo.textContent = 'Arrastra materiales aquí';
            craftButton.disabled = true;
            craftButton.textContent = 'Fabricar';
        }
    }

    /**
     * Fabrica el item
     */
    craft() {
        const result = this.craftingSystem.craft();
        
        if (result.success) {
            // Mostrar mensaje de éxito
            this.showMessage(`${result.item.name} fabricado exitosamente`, 'success');
            
            // Agregar al inventario (simulado)
            this.addToInventory(result.item);
            
            // Limpiar el grid
            this.updateCraftingGrid();
            this.checkRecipe();
        } else {
            this.showMessage(result.error, 'error');
        }
    }

    /**
     * Agrega un item al inventario
     */
    addToInventory(item) {
        const current = this.inventory.get(item.id) || 0;
        this.inventory.set(item.id, current + 1);
        console.log(`Item agregado al inventario: ${item.name} (Total: ${current + 1})`);
    }

    /**
     * Muestra un mensaje temporal
     */
    showMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'success' ? 'rgba(0, 128, 0, 0.8)' : 'rgba(128, 0, 0, 0.8)'};
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            font-family: 'Times New Roman', serif;
            font-size: 14px;
            z-index: 10002;
            animation: fadeInOut 3s ease-in-out;
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
     * Simula agregar materiales al inventario para pruebas
     */
    addTestMaterials() {
        const testMaterials = ['madera', 'piedra', 'hierro', 'palo', 'cuerda'];
        testMaterials.forEach(material => {
            this.inventory.set(material, 10);
        });
        console.log('Materiales de prueba agregados al inventario');
    }
}

// Crear instancia global de la UI
window.craftingUI = new CraftingUI();

// Función global para abrir la interfaz
window.openCrafting = function() {
    window.craftingUI.open();
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    console.log('UI de fabricación lista');
    
    // Agregar materiales de prueba para desarrollo
    window.craftingUI.addTestMaterials();
});

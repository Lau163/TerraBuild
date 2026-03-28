/**
 * Minecraft Map Reader - Lector de mapas de Minecraft para TerraBuild
 * Convierte archivos .mca de Minecraft a datos utilizables en el juego
 */

class MinecraftMapReader {
    constructor() {
        this.regionSize = 32; // 32x32 chunks por región
        this.chunkSize = 16; // 16x16x256 bloques por chunk
        this.blockMapping = this.initializeBlockMapping();
    }

    /**
     * Inicializa el mapeo de bloques de Minecraft a TerraBuild
     */
    initializeBlockMapping() {
        return {
            // Bloques básicos de tierra
            0: 'air',                    // Air
            1: 'stone',                  // Stone
            2: 'grass',                  // Grass
            3: 'dirt',                   // Dirt
            4: 'cobblestone',            // Cobblestone
            5: 'wood_plank',             // Wood Plank
            6: 'sapling',                // Sapling
            7: 'bedrock',                // Bedrock
            8: 'water',                  // Water (flowing)
            9: 'water',                  // Water (source)
            10: 'lava',                  // Lava (flowing)
            11: 'lava',                  // Lava (source)
            12: 'sand',                  // Sand
            13: 'gravel',                // Gravel
            14: 'gold_ore',              // Gold Ore
            15: 'iron_ore',              // Iron Ore
            16: 'coal_ore',              // Coal Ore
            17: 'log',                   // Wood Log
            18: 'leaves',                // Leaves
            19: 'sponge',                // Sponge
            20: 'glass',                 // Glass
            21: 'lapis_ore',             // Lapis Lazuli Ore
            22: 'lapis_block',           // Lapis Lazuli Block
            23: 'dispenser',             // Dispenser
            24: 'sandstone',             // Sandstone
            25: 'note_block',            // Note Block
            26: 'bed',                   // Bed
            27: 'golden_rail',           // Powered Rail
            28: 'detector_rail',         // Detector Rail
            29: 'sticky_piston',         // Sticky Piston
            30: 'web',                   // Cobweb
            31: 'tall_grass',            // Tall Grass
            32: 'dead_bush',             // Dead Bush
            33: 'piston',                // Piston
            34: 'piston_head',           // Piston Head
            35: 'wool',                  // Wool
            36: 'piston_extension',      // Piston Extension
            37: 'yellow_flower',         // Dandelion
            38: 'red_flower',            // Poppy
            39: 'brown_mushroom',        // Brown Mushroom
            40: 'red_mushroom',          // Red Mushroom
            41: 'gold_block',            // Gold Block
            42: 'iron_block',            // Iron Block
            43: 'stone_slab',            // Double Stone Slab
            44: 'stone_slab',            // Stone Slab
            45: 'brick_block',           // Bricks
            46: 'tnt',                   // TNT
            47: 'bookshelf',             // Bookshelf
            48: 'mossy_cobblestone',     // Mossy Cobblestone
            49: 'obsidian',              // Obsidian
            50: 'torch',                 // Torch
            51: 'fire',                  // Fire
            52: 'spawner',               // Monster Spawner
            53: 'oak_stairs',            // Oak Stairs
            54: 'chest',                 // Chest
            55: 'redstone_wire',         // Redstone Wire
            56: 'diamond_ore',           // Diamond Ore
            57: 'diamond_block',         // Diamond Block
            58: 'crafting_table',        // Crafting Table
            59: 'wheat',                 // Wheat
            60: 'farmland',              // Farmland
            61: 'furnace',               // Furnace
            62: 'furnace',               // Burning Furnace
            63: 'sign',                  // Standing Sign
            64: 'door_wood',             // Oak Door
            65: 'ladder',                // Ladder
            66: 'rail',                  // Rail
            67: 'stone_stairs',          // Cobblestone Stairs
            68: 'wall_sign',             // Wall Sign
            69: 'lever',                 // Lever
            70: 'stone_pressure_plate',  // Stone Pressure Plate
            71: 'door_iron',             // Iron Door
            72: 'wood_pressure_plate',   // Wooden Pressure Plate
            73: 'redstone_ore',          // Redstone Ore
            74: 'redstone_torch',        // Redstone Torch (off)
            75: 'redstone_torch',        // Redstone Torch (on)
            76: 'stone_button',          // Stone Button
            77: 'snow_layer',            // Snow
            78: 'ice',                   // Ice
            79: 'snow_block',            // Snow Block
            80: 'cactus',                // Cactus
            81: 'reeds',                 // Sugar Cane
            82: 'clay',                  // Clay
            83: 'jukebox',               // Jukebox
            84: 'fence',                 // Fence
            85: 'pumpkin',               // Pumpkin
            86: 'netherrack',            // Netherrack
            87: 'soul_sand',             // Soul Sand
            88: 'glowstone',             // Glowstone
            89: 'jack_o_lantern',        // Jack o'Lantern
            90: 'cake',                  // Cake
            91: 'repeater',              // Redstone Repeater (off)
            92: 'repeater',              // Redstone Repeater (on)
            93: 'stained_glass',         // Stained Glass
            94: 'trapdoor',              // Trapdoor
            95: 'monster_egg',           // Monster Egg
            96: 'stone_bricks',          // Stone Bricks
            97: 'brown_mushroom_block',  // Huge Brown Mushroom
            98: 'red_mushroom_block',    // Huge Red Mushroom
            99: 'iron_bars',             // Iron Bars
            100: 'glass_pane',           // Glass Pane
            101: 'melon',                 // Melon
            102: 'pumpkin_stem',         // Pumpkin Stem
            103: 'melon_stem',           // Melon Stem
            104: 'vine',                  // Vine
            105: 'fence_gate',           // Fence Gate
            106: 'brick_stairs',         // Brick Stairs
            107: 'stone_brick_stairs',   // Stone Brick Stairs
            108: 'mycelium',             // Mycelium
            109: 'lily_pad',             // Lily Pad
            110: 'nether_brick',         // Nether Brick
            111: 'nether_brick_fence',   // Nether Brick Fence
            112: 'nether_brick_stairs',  // Nether Brick Stairs
            113: 'nether_wart',          // Nether Wart
            114: 'enchanting_table',     // Enchanting Table
            115: 'brewing_stand',        // Brewing Stand
            116: 'cauldron',             // Cauldron
            117: 'end_portal',           // End Portal
            118: 'end_portal_frame',     // End Portal Frame
            119: 'end_stone',            // End Stone
            120: 'dragon_egg',           // Dragon Egg
            121: 'redstone_lamp',        // Redstone Lamp (off)
            122: 'redstone_lamp',        // Redstone Lamp (on)
            123: 'wood_slab',             // Double Wooden Slab
            124: 'wood_slab',            // Wooden Slab
            125: 'sandstone_stairs',     // Sandstone Stairs
            126: 'emerald_ore',          // Emerald Ore
            127: 'ender_chest',          // Ender Chest
            128: 'tripwire_hook',        // Tripwire Hook
            129: 'tripwire',             // Tripwire
            130: 'emerald_block',        // Emerald Block
            131: 'spruce_stairs',        // Spruce Stairs
            132: 'birch_stairs',         // Birch Stairs
            133: 'jungle_stairs',        // Jungle Stairs
            134: 'command_block',        // Command Block
            135: 'beacon',               // Beacon
            136: 'cobblestone_wall',     // Cobblestone Wall
            137: 'flower_pot',           // Flower Pot
            138: 'carrots',              // Carrots
            139: 'potatoes',             // Potatoes
            140: 'wood_button',          // Wooden Button
            141: 'skull',                // Mob Head
            142: 'anvil',                 // Anvil
            143: 'trapped_chest',        // Trapped Chest
            144: 'light_weighted_pressure_plate', // Light Weighted Pressure Plate
            145: 'heavy_weighted_pressure_plate', // Heavy Weighted Pressure Plate
            146: 'comparator',           // Redstone Comparator (off)
            147: 'comparator',           // Redstone Comparator (on)
            148: 'daylight_detector',    // Daylight Detector
            149: 'redstone_block',       // Redstone Block
            150: 'quartz_ore',           // Nether Quartz Ore
            151: 'hopper',               // Hopper
            152: 'quartz_block',         // Quartz Block
            153: 'quartz_stairs',        // Quartz Stairs
            154: 'activator_rail',       // Activator Rail
            155: 'dropper',              // Dropper
            156: 'stained_hardened_clay', // Stained Clay
            157: 'stained_glass_pane',   // Stained Glass Pane
            158: 'leaves2',              // Leaves (Acacia/Dark Oak)
            159: 'log2',                 // Wood (Acacia/Dark Oak)
            160: 'stained_hardened_clay', // Stained Clay
            161: 'stained_hardened_clay', // Stained Clay
            162: 'stained_hardened_clay', // Stained Clay
            163: 'stained_hardened_clay', // Stained Clay
            164: 'stained_hardened_clay', // Stained Clay
            165: 'slime',                // Slime Block
            166: 'barrier',              // Barrier
            167: 'iron_trapdoor',        // Iron Trapdoor
            168: 'prismarine',           // Prismarine
            169: 'prismarine',           // Prismarine Bricks
            170: 'prismarine',           // Dark Prismarine
            171: 'sea_lantern',          // Sea Lantern
            172: 'hay_block',            // Hay Block
            173: 'carpet',               // Carpet
            174: 'hardened_clay',        // Hardened Clay
            175: 'coal_block',           // Coal Block
            176: 'packed_ice',           // Packed Ice
            177: 'red_sandstone',        // Red Sandstone
            178: 'red_sandstone_stairs', // Red Sandstone Stairs
            179: 'red_sandstone',        // Double Red Sandstone Slab
            180: 'red_sandstone',        // Red Sandstone Slab
            181: 'fence_gate',           // Spruce Fence Gate
            182: 'fence_gate',           // Birch Fence Gate
            183: 'fence_gate',           // Jungle Fence Gate
            184: 'fence_gate',           // Dark Oak Fence Gate
            185: 'fence_gate',           // Acacia Fence Gate
            186: 'fence_gate',           // Spruce Fence Gate
            187: 'fence_gate',           // Birch Fence Gate
            188: 'fence_gate',           // Jungle Fence Gate
            189: 'fence_gate',           // Dark Oak Fence Gate
            190: 'fence_gate',           // Acacia Fence Gate
            191: 'fence_gate',           // Spruce Fence Gate
            192: 'fence_gate',           // Birch Fence Gate
            193: 'fence_gate',           // Jungle Fence Gate
            194: 'fence_gate',           // Dark Oak Fence Gate
            195: 'fence_gate',           // Acacia Fence Gate
            196: 'fence_gate',           // Spruce Fence Gate
            197: 'fence_gate',           // Birch Fence Gate
            198: 'fence_gate',           // Jungle Fence Gate
            199: 'fence_gate',           // Dark Oak Fence Gate
            200: 'fence_gate',           // Acacia Fence Gate
            201: 'fence_gate',           // Spruce Fence Gate
            202: 'fence_gate',           // Birch Fence Gate
            203: 'fence_gate',           // Jungle Fence Gate
            204: 'fence_gate',           // Dark Oak Fence Gate
            205: 'fence_gate',           // Acacia Fence Gate
            206: 'fence_gate',           // Spruce Fence Gate
            207: 'fence_gate',           // Birch Fence Gate
            208: 'fence_gate',           // Jungle Fence Gate
            209: 'fence_gate',           // Dark Oak Fence Gate
            210: 'fence_gate',           // Acacia Fence Gate
            211: 'fence_gate',           // Spruce Fence Gate
            212: 'fence_gate',           // Birch Fence Gate
            213: 'fence_gate',           // Jungle Fence Gate
            214: 'fence_gate',           // Dark Oak Fence Gate
            215: 'fence_gate',           // Acacia Fence Gate
            216: 'fence_gate',           // Spruce Fence Gate
            217: 'fence_gate',           // Birch Fence Gate
            218: 'fence_gate',           // Jungle Fence Gate
            219: 'fence_gate',           // Dark Oak Fence Gate
            220: 'fence_gate',           // Acacia Fence Gate
            221: 'fence_gate',           // Spruce Fence Gate
            222: 'fence_gate',           // Birch Fence Gate
            223: 'fence_gate',           // Jungle Fence Gate
            224: 'fence_gate',           // Dark Oak Fence Gate
            225: 'fence_gate',           // Acacia Fence Gate
            226: 'fence_gate',           // Spruce Fence Gate
            227: 'fence_gate',           // Birch Fence Gate
            228: 'fence_gate',           // Jungle Fence Gate
            229: 'fence_gate',           // Dark Oak Fence Gate
            230: 'fence_gate',           // Acacia Fence Gate
            231: 'fence_gate',           // Spruce Fence Gate
            232: 'fence_gate',           // Birch Fence Gate
            233: 'fence_gate',           // Jungle Fence Gate
            234: 'fence_gate',           // Dark Oak Fence Gate
            235: 'fence_gate',           // Acacia Fence Gate
            236: 'fence_gate',           // Spruce Fence Gate
            237: 'fence_gate',           // Birch Fence Gate
            238: 'fence_gate',           // Jungle Fence Gate
            239: 'fence_gate',           // Dark Oak Fence Gate
            240: 'fence_gate',           // Acacia Fence Gate
            241: 'fence_gate',           // Spruce Fence Gate
            242: 'fence_gate',           // Birch Fence Gate
            243: 'fence_gate',           // Jungle Fence Gate
            244: 'fence_gate',           // Dark Oak Fence Gate
            245: 'fence_gate',           // Acacia Fence Gate
            246: 'fence_gate',           // Spruce Fence Gate
            247: 'fence_gate',           // Birch Fence Gate
            248: 'fence_gate',           // Jungle Fence Gate
            249: 'fence_gate',           // Dark Oak Fence Gate
            250: 'fence_gate',           // Acacia Fence Gate
            251: 'fence_gate',           // Spruce Fence Gate
            252: 'fence_gate',           // Birch Fence Gate
            253: 'fence_gate',           // Jungle Fence Gate
            254: 'fence_gate',           // Dark Oak Fence Gate
            255: 'fence_gate'            // Acacia Fence Gate
        };
    }

    /**
     * Lee un archivo de región (.mca) y extrae los datos de los chunks
     */
    async readRegionFile(filePath) {
        try {
            console.log(`📂 Leyendo archivo de región: ${filePath}`);
            
            // En una implementación real, esto leería el archivo binario .mca
            // Por ahora, simulamos la lectura con datos de ejemplo
            const regionData = await this.simulateRegionRead(filePath);
            
            return regionData;
        } catch (error) {
            console.error('❌ Error al leer archivo de región:', error);
            throw error;
        }
    }

    /**
     * Simula la lectura de un archivo de región (para desarrollo)
     */
    async simulateRegionRead(filePath) {
        // Simular estructura de región con chunks de ejemplo
        const regionData = {
            filePath: filePath,
            chunks: new Map(),
            regionX: 0,
            regionZ: 0
        };

        // Generar chunks simulados basados en el nombre del archivo
        const fileName = filePath.split('/').pop().split('.')[0];
        const coords = fileName.match(/r\.(-?\d+)\.(-?\d+)/);
        
        if (coords) {
            regionData.regionX = parseInt(coords[1]);
            regionData.regionZ = parseInt(coords[2]);
        }

        // Generar chunks de ejemplo
        for (let x = 0; x < this.regionSize; x++) {
            for (let z = 0; z < this.regionSize; z++) {
                const chunkKey = `${x},${z}`;
                const chunkData = this.generateSimulatedChunk(x, z, regionData.regionX, regionData.regionZ);
                regionData.chunks.set(chunkKey, chunkData);
            }
        }

        console.log(`✅ Región simulada: ${regionData.chunks.size} chunks generados`);
        return regionData;
    }

    /**
     * Genera un chunk simulado basado en la posición
     */
    generateSimulatedChunk(localX, localZ, regionX, regionZ) {
        const chunkX = regionX * this.regionSize + localX;
        const chunkZ = regionZ * this.regionSize + localZ;
        
        const chunk = {
            x: chunkX,
            z: chunkZ,
            sections: []
        };

        // Generar secciones del chunk (cada sección es 16x16x16 bloques)
        for (let y = 0; y < 16; y++) {
            const section = {
                y: y,
                blocks: new Array(16 * 16 * 16).fill(0), // air por defecto
                data: new Array(16 * 16 * 8).fill(0)     // metadata
            };

            // Generar terreno básico
            for (let bx = 0; bx < 16; bx++) {
                for (let bz = 0; bz < 16; bz++) {
                    for (let by = 0; by < 16; by++) {
                        const worldY = y * 16 + by;
                        const blockIndex = (by * 16 + bz) * 16 + bx;
                        
                        // Generar altura del terreno
                        const height = this.getTerrainHeight(chunkX * 16 + bx, chunkZ * 16 + bz);
                        
                        if (worldY === 0) {
                            // Bedrock en la capa inferior
                            section.blocks[blockIndex] = 7;
                        } else if (worldY < height - 3) {
                            // Stone bajo tierra
                            section.blocks[blockIndex] = 1;
                        } else if (worldY < height - 1) {
                            // Dirt cerca de la superficie
                            section.blocks[blockIndex] = 3;
                        } else if (worldY === height - 1 && worldY > 60) {
                            // Grass en la superficie
                            section.blocks[blockIndex] = 2;
                        } else if (worldY < height && worldY <= 60) {
                            // Sand o gravel en niveles bajos
                            section.blocks[blockIndex] = Math.random() > 0.5 ? 12 : 13;
                        }

                        // Agregar estructuras simples
                        if (worldY === height && Math.random() < 0.02) {
                            // Árboles ocasionales
                            if (worldY > 62) {
                                section.blocks[blockIndex] = 17; // log
                            }
                        }

                        // Agregar minerales
                        if (worldY < height - 4 && worldY > 5) {
                            const oreChance = this.getOreChance(worldY);
                            if (Math.random() < oreChance) {
                                section.blocks[blockIndex] = this.getRandomOre(worldY);
                            }
                        }
                    }
                }
            }

            chunk.sections.push(section);
        }

        return chunk;
    }

    /**
     * Calcula la altura del terreno para una posición
     */
    getTerrainHeight(x, z) {
        // Simular terreno con ruido simple
        const scale = 0.05;
        const height = 64 + 
            Math.sin(x * scale) * 10 + 
            Math.cos(z * scale) * 10 + 
            Math.sin((x + z) * scale * 0.5) * 5;
        
        return Math.floor(Math.max(10, Math.min(120, height)));
    }

    /**
     * Obtiene la probabilidad de mineral según la altura
     */
    getOreChance(y) {
        if (y < 16) return 0.05;  // Diamante
        if (y < 32) return 0.08;  // Oro
        if (y < 48) return 0.12;  // Hierro
        if (y < 64) return 0.15;  // Carbón
        return 0.02;
    }

    /**
     * Obtiene un mineral aleatorio según la altura
     */
    getRandomOre(y) {
        if (y < 16) return 56;  // Diamond ore
        if (y < 32) return 14;  // Gold ore
        if (y < 48) return 15;  // Iron ore
        return 16;              // Coal ore
    }

    /**
     * Convierte los datos del chunk a un formato utilizable por TerraBuild
     */
    convertChunkToTerraBuild(chunk) {
        const terraBuildChunk = {
            x: chunk.x,
            z: chunk.z,
            blocks: [],
            heightmap: new Array(16 * 16).fill(0)
        };

        // Procesar todas las secciones del chunk
        for (const section of chunk.sections) {
            for (let bx = 0; bx < 16; bx++) {
                for (let bz = 0; bz < 16; bz++) {
                    for (let by = 0; by < 16; by++) {
                        const worldY = section.y * 16 + by;
                        const blockIndex = (by * 16 + bz) * 16 + bx;
                        const blockId = section.blocks[blockIndex];
                        
                        if (blockId !== 0) { // No es aire
                            const blockType = this.blockMapping[blockId] || 'unknown';
                            
                            terraBuildChunk.blocks.push({
                                x: chunk.x * 16 + bx,
                                y: worldY,
                                z: chunk.z * 16 + bz,
                                type: blockType,
                                data: section.data[Math.floor(blockIndex / 2)]
                            });

                            // Actualizar heightmap
                            const heightIndex = bz * 16 + bx;
                            if (worldY > terraBuildChunk.heightmap[heightIndex]) {
                                terraBuildChunk.heightmap[heightIndex] = worldY;
                            }
                        }
                    }
                }
            }
        }

        return terraBuildChunk;
    }

    /**
     * Procesa todos los archivos de región de un mapa
     */
    async processMapRegion(mapPath) {
        console.log(`🗺️ Procesando regiones del mapa: ${mapPath}`);
        
        const regionPath = `${mapPath}/region`;
        const processedChunks = new Map();
        
        try {
            // Listar archivos de región
            const regionFiles = await this.getRegionFiles(regionPath);
            
            for (const regionFile of regionFiles) {
                console.log(`📂 Procesando región: ${regionFile}`);
                
                const regionData = await this.readRegionFile(`${regionPath}/${regionFile}`);
                
                // Convertir cada chunk al formato de TerraBuild
                for (const [chunkKey, chunk] of regionData.chunks) {
                    const terraBuildChunk = this.convertChunkToTerraBuild(chunk);
                    processedChunks.set(chunkKey, terraBuildChunk);
                }
            }
            
            console.log(`✅ Mapa procesado: ${processedChunks.size} chunks convertidos`);
            return processedChunks;
            
        } catch (error) {
            console.error('❌ Error al procesar mapa:', error);
            throw error;
        }
    }

    /**
     * Obtiene la lista de archivos de región
     */
    async getRegionFiles(regionPath) {
        // En una implementación real, esto leería el directorio
        // Por ahora, simulamos los archivos basados en lo que vimos
        return [
            'r.-1.-1.mca', 'r.-1.-2.mca', 'r.-1.0.mca', 'r.-1.1.mca',
            'r.-2.-1.mca', 'r.-2.-2.mca', 'r.-2.0.mca', 'r.-2.1.mca',
            'r.0.-1.mca', 'r.0.-2.mca', 'r.0.0.mca', 'r.0.1.mca',
            'r.1.-1.mca', 'r.1.-2.mca', 'r.1.0.mca', 'r.1.1.mca'
        ];
    }

    /**
     * Genera datos de estructuras para el mapa
     */
    generateStructures(mapPath) {
        // Analizar el nombre del mapa para determinar qué estructuras generar
        const mapName = mapPath.toLowerCase();
        
        const structures = {
            houses: [],
            trees: [],
            decorations: [],
            special: []
        };

        if (mapName.includes('house')) {
            structures.houses.push(
                { x: 0, y: 10, z: 0, type: 'medieval_house' },
                { x: 20, y: 10, z: 15, type: 'medieval_house_small' }
            );
        }

        if (mapName.includes('mansion')) {
            structures.houses.push(
                { x: 0, y: 15, z: 0, type: 'medieval_mansion' },
                { x: 40, y: 10, z: 30, type: 'medieval_house' },
                { x: -40, y: 10, z: 30, type: 'medieval_house' }
            );
        }

        if (mapName.includes('village')) {
            structures.houses.push(
                { x: 0, y: 12, z: 0, type: 'village_center' },
                { x: 25, y: 10, z: 20, type: 'village_house' },
                { x: -25, y: 10, z: 20, type: 'village_house' },
                { x: 50, y: 10, z: -20, type: 'village_house' },
                { x: -50, y: 10, z: -20, type: 'village_house' }
            );
        }

        if (mapName.includes('palace')) {
            structures.special.push(
                { x: 0, y: 20, z: 0, type: 'royal_palace' },
                { x: 60, y: 15, z: 60, type: 'palace_garden' },
                { x: -60, y: 15, z: 60, type: 'palace_garden' }
            );
        }

        // Agregar árboles y decoraciones
        for (let i = 0; i < 50; i++) {
            structures.trees.push({
                x: (Math.random() - 0.5) * 300,
                y: 10,
                z: (Math.random() - 0.5) * 300,
                type: Math.random() > 0.5 ? 'oak' : 'pine'
            });
        }

        return structures;
    }
}

// Crear instancia global del lector de mapas
window.minecraftMapReader = new MinecraftMapReader();

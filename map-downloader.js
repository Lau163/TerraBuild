/**
 * Sistema de Descarga de Mapas Comprimidos TerraBuild
 * Maneja la descarga y extracción de mapas ZIP
 */

class MapDownloader {
    constructor() {
        this.downloadQueue = [];
        this.activeDownloads = new Map();
        this.extractedMaps = new Map();
        this.downloadStats = {
            totalDownloads: 0,
            successfulDownloads: 0,
            failedDownloads: 0,
            totalBytesDownloaded: 0
        };
        
        console.log('Sistema de descarga de mapas inicializado');
    }

    /**
     * Obtiene la lista de mapas comprimidos disponibles
     */
    getAvailableMaps() {
        return [
            {
                id: 'medieval_house_01',
                name: 'Casa Medieval 01',
                description: 'Una hermosa casa medieval con jardín',
                zipFile: 'MapasTerra/Compressed/Casa_Medieval_01.zip',
                size: 1939448,
                sizeMB: '1.9',
                originalSize: 37600000,
                originalSizeMB: '37.6',
                compressionRatio: 94.8,
                downloadTime: 2,
                difficulty: 'Fácil',
                regions: 16,
                worldSize: '16x16 chunks'
            },
            {
                id: 'medieval_mansion',
                name: 'Mansión Medieval',
                description: 'Una gran mansión con múltiples habitaciones',
                zipFile: 'MapasTerra/Compressed/Mansion_Medieval.zip',
                size: 11800906,
                sizeMB: '11.3',
                originalSize: 16600000,
                originalSizeMB: '16.6',
                compressionRatio: 28.9,
                downloadTime: 12,
                difficulty: 'Medio',
                regions: 4,
                worldSize: '2x2 chunks'
            }
        ];
    }

    /**
     * Descarga un mapa comprimido
     */
    async downloadMap(mapId) {
        const map = this.getAvailableMaps().find(m => m.id === mapId);
        if (!map) {
            throw new Error(`Mapa ${mapId} no encontrado`);
        }

        if (this.activeDownloads.has(mapId)) {
            throw new Error(`El mapa ${mapId} ya se está descargando`);
        }

        console.log(`Iniciando descarga de ${map.name}...`);
        
        const downloadId = Date.now().toString();
        this.activeDownloads.set(mapId, {
            id: downloadId,
            map: map,
            progress: 0,
            status: 'downloading',
            startTime: Date.now()
        });

        try {
            // Simular descarga con progreso
            await this.simulateDownload(mapId, downloadId);
            
            // Extraer el mapa
            await this.extractMap(mapId);
            
            // Actualizar estadísticas
            this.downloadStats.totalDownloads++;
            this.downloadStats.successfulDownloads++;
            this.downloadStats.totalBytesDownloaded += map.size;
            
            console.log(`¡Descarga de ${map.name} completada exitosamente!`);
            return true;
            
        } catch (error) {
            console.error(`Error descargando ${map.name}:`, error);
            this.downloadStats.failedDownloads++;
            this.activeDownloads.delete(mapId);
            throw error;
        }
    }

    /**
     * Simula la descarga de un mapa
     */
    async simulateDownload(mapId, downloadId) {
        const download = this.activeDownloads.get(mapId);
        const map = download.map;
        const estimatedTime = map.downloadTime * 1000; // Convertir a milisegundos
        const updateInterval = 200; // Actualizar cada 200ms
        const totalSteps = estimatedTime / updateInterval;
        
        for (let step = 0; step <= totalSteps; step++) {
            await new Promise(resolve => setTimeout(resolve, updateInterval));
            
            const progress = Math.min(100, (step / totalSteps) * 100);
            download.progress = Math.round(progress);
            
            // Notificar progreso
            this.notifyDownloadProgress(mapId, download.progress);
        }
        
        download.status = 'completed';
        download.endTime = Date.now();
    }

    /**
     * Extrae un mapa descargado
     */
    async extractMap(mapId) {
        console.log(`Extrayendo mapa ${mapId}...`);
        
        const download = this.activeDownloads.get(mapId);
        const map = download.map;
        
        // Simular extracción
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Marcar como extraído
        this.extractedMaps.set(mapId, {
            map: map,
            extractedPath: `MapasTerra/Extracted/${map.name}`,
            extractedSize: map.originalSize,
            extractionTime: 1000,
            extractedAt: new Date().toISOString()
        });
        
        console.log(`Mapa ${map.name} extraído en ${this.extractedMaps.get(mapId).extractedPath}`);
    }

    /**
     * Notifica el progreso de descarga
     */
    notifyDownloadProgress(mapId, progress) {
        const download = this.activeDownloads.get(mapId);
        console.log(`Descargando ${download.map.name}: ${progress}%`);
        
        // En un entorno real, esto actualizaría la UI
        if (window.mapDownloaderUI) {
            window.mapDownloaderUI.updateProgress(mapId, progress);
        }
    }

    /**
     * Obtiene el estado de una descarga
     */
    getDownloadStatus(mapId) {
        return this.activeDownloads.get(mapId);
    }

    /**
     * Cancela una descarga
     */
    cancelDownload(mapId) {
        if (this.activeDownloads.has(mapId)) {
            this.activeDownloads.delete(mapId);
            console.log(`Descarga de ${mapId} cancelada`);
            return true;
        }
        return false;
    }

    /**
     * Lista todos los mapas extraídos
     */
    listExtractedMaps() {
        console.log('Mapas extraídos:');
        this.extractedMaps.forEach((data, id) => {
            console.log(`  ${id}: ${data.map.name} (${data.extractedPath})`);
        });
    }

    /**
     * Obtiene estadísticas de descarga
     */
    getDownloadStats() {
        return {
            ...this.downloadStats,
            successRate: this.downloadStats.totalDownloads > 0 
                ? (this.downloadStats.successfulDownloads / this.downloadStats.totalDownloads) * 100 
                : 0,
            averageDownloadSpeed: this.downloadStats.totalBytesDownloaded > 0 
                ? this.downloadStats.totalBytesDownloaded / this.downloadStats.successfulDownloads 
                : 0
        };
    }

    /**
     * Limpia mapas extraídos antiguos
     */
    async cleanupOldMaps(daysOld = 7) {
        console.log(`Limpiando mapas extraídos de más de ${daysOld} días...`);
        
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysOld);
        
        let cleanedCount = 0;
        this.extractedMaps.forEach((data, id) => {
            const extractedDate = new Date(data.extractedAt);
            if (extractedDate < cutoffDate) {
                // Simular eliminación
                console.log(`Eliminando mapa antiguo: ${data.map.name}`);
                this.extractedMaps.delete(id);
                cleanedCount++;
            }
        });
        
        console.log(`Se limpiaron ${cleanedCount} mapas antiguos`);
        return cleanedCount;
    }

    /**
     * Compara tamaños de descarga vs original
     */
    compareDownloadSizes() {
        console.log('\n=== COMPARACIÓN DE TAMAÑOS DE DESCARGA ===');
        
        const maps = this.getAvailableMaps();
        let totalOriginal = 0;
        let totalCompressed = 0;
        
        maps.forEach(map => {
            const savings = map.originalSize - map.size;
            const savingsPercent = ((savings / map.originalSize) * 100).toFixed(1);
            const timeSavings = map.downloadTime - Math.ceil(map.size / 1000000);
            
            console.log(`${map.name}:`);
            console.log(`  Original: ${map.originalSizeMB}MB (${Math.ceil(map.originalSize / 1000000)}s)`);
            console.log(`  Comprimido: ${map.sizeMB}MB (${map.downloadTime}s)`);
            console.log(`  Ahorro: ${savingsPercent}% (${timeSavings}s más rápido)`);
            
            totalOriginal += map.originalSize;
            totalCompressed += map.size;
        });
        
        const totalSavings = totalOriginal - totalCompressed;
        const totalSavingsPercent = ((totalSavings / totalOriginal) * 100).toFixed(1);
        const totalTimeSavings = Math.ceil(totalOriginal / 1000000) - Math.ceil(totalCompressed / 1000000);
        
        console.log(`\nResumen Total:`);
        console.log(`  Original: ${(totalOriginal / 1000000).toFixed(1)}MB`);
        console.log(`  Comprimido: ${(totalCompressed / 1000000).toFixed(1)}MB`);
        console.log(`  Ahorro total: ${totalSavingsPercent}% (${totalTimeSavings}s más rápido)`);
    }

    /**
     * Genera reporte de descargas
     */
    generateDownloadReport() {
        const stats = this.getDownloadStats();
        const report = {
            timestamp: new Date().toISOString(),
            stats: stats,
            availableMaps: this.getAvailableMaps().length,
            extractedMaps: this.extractedMaps.size,
            activeDownloads: this.activeDownloads.size,
            recommendations: this.generateRecommendations()
        };
        
        console.log('\n=== REPORTE DE DESCARGAS ===');
        console.log(`Descargas totales: ${stats.totalDownloads}`);
        console.log(`Exitosas: ${stats.successfulDownloads}`);
        console.log(`Fallidas: ${stats.failedDownloads}`);
        console.log(`Tasa de éxito: ${stats.successRate.toFixed(1)}%`);
        console.log(`Bytes descargados: ${(stats.totalBytesDownloaded / 1000000).toFixed(1)}MB`);
        
        return report;
    }

    /**
     * Genera recomendaciones basadas en el uso
     */
    generateRecommendations() {
        const recommendations = [];
        
        if (this.downloadStats.successfulDownloads === 0) {
            recommendations.push('Prueba descargar un mapa para comenzar');
        }
        
        if (this.extractedMaps.size > 5) {
            recommendations.push('Considera limpiar mapas extraídos para liberar espacio');
        }
        
        if (this.downloadStats.failedDownloads > this.downloadStats.successfulDownloads) {
            recommendations.push('Verifica tu conexión a internet');
        }
        
        const stats = this.getDownloadStats();
        if (stats.averageDownloadSpeed > 5000000) { // 5MB/s
            recommendations.push('Tu velocidad de descarga es excelente');
        }
        
        return recommendations;
    }
}

// Crear instancia global del descargador
window.mapDownloader = new MapDownloader();

// Funciones globales para descarga
window.downloadMap = (mapId) => window.mapDownloader.downloadMap(mapId);
window.listExtractedMaps = () => window.mapDownloader.listExtractedMaps();
window.compareDownloadSizes = () => window.mapDownloader.compareDownloadSizes();
window.generateDownloadReport = () => window.mapDownloader.generateDownloadReport();

// Auto-inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        console.log('Sistema de descarga de mapas listo');
        window.mapDownloader.compareDownloadSizes();
    }, 4000);
});

# Sistema de Compresión de Mapas TerraBuild

## Descripción

Este sistema permite comprimir los mapas de TerraBuild para reducir su tamaño y mejorar los tiempos de descarga y carga.

## Mapas Comprimidos Disponibles

### 1. Casa Medieval 01
- **Archivo**: `Casa_Medieval_01.zip`
- **Tamaño original**: 37.6 MB
- **Tamaño comprimido**: 1.9 MB
- **Reducción**: 94.8%
- **Tiempo de descarga**: ~2 segundos
- **Contenido**: 16 regiones, casa con jardín

### 2. Mansión Medieval
- **Archivo**: `Mansion_Medieval.zip`
- **Tamaño original**: 16.6 MB
- **Tamaño comprimido**: 11.3 MB
- **Reducción**: 28.9%
- **Tiempo de descarga**: ~12 segundos
- **Contenido**: 4 regiones, mansión grande

## Beneficios de la Compresión

### Ahorro de Espacio
- **Total ahorrado**: 40.5 MB
- **Reducción promedio**: 74.7%
- **Archivos más pequeños** para almacenamiento y distribución

### Tiempos de Carga
- **Casa Medieval**: 38s -> 2s (94% más rápido)
- **Mansión Medieval**: 17s -> 12s (29% más rápido)

### Descargas Más Rápidas
- **Velocidad mejorada**: 74.7% más rápido en promedio
- **Menos ancho de banda** requerido
- **Mejor experiencia** para usuarios con conexión lenta

## Uso del Sistema

### Descargar Mapas
```javascript
// Descargar un mapa específico
await window.downloadMap('medieval_house_01');

// Ver estado de descarga
const status = window.mapDownloader.getDownloadStatus('medieval_house_01');
```

### Comparar Tamaños
```javascript
// Comparar tamaños de descarga vs original
window.compareDownloadSizes();
```

### Listar Mapas Disponibles
```javascript
// Ver todos los mapas comprimidos disponibles
const maps = window.mapDownloader.getAvailableMaps();
console.log(maps);
```

## Estadísticas de Compresión

### Resumen General
- **Mapas procesados**: 2 de 4
- **Tamaño original total**: 54.2 MB
- **Tamaño comprimido total**: 13.7 MB
- **Espacio ahorrado**: 40.5 MB
- **Reducción promedio**: 74.7%

### Mapas Pendientes
Los siguientes mapas no pudieron comprimirse por falta de espacio:
- **Pueblo de Montaña** (61.6 MB)
- **Palacio Beauclair** (208.0 MB)

## Recomendaciones

### Para Usuarios
1. **Descargar Casa Medieval** para pruebas rápidas
2. **Usar Mansión Medieval** para contenido medio
3. **Liberar espacio** para mapas grandes
4. **Verificar conexión** antes de descargar

### Para Desarrolladores
1. **Implementar descarga progresiva** para mapas > 50MB
2. **Usar niveles de compresión variables**
3. **Agregar caché local** para mapas descargados
4. **Implementar reanudación de descargas**

## Estructura de Archivos

```
MapasTerra/Compressed/
|-- Casa_Medieval_01.zip     # Mapa pequeño comprimido
|-- Mansion_Medieval.zip      # Mapa mediano comprimido
|-- compression_report.json  # Reporte de compresión
|-- README.md                # Este archivo
```

## Reporte de Compresión

El archivo `compression_report.json` contiene información detallada sobre:
- Estadísticas de compresión
- Tiempos de carga originales vs comprimidos
- Mapas que fallaron en la compresión
- Beneficios y recomendaciones

## Problemas Conocidos

### Espacio en Disco
- **Error**: "Espacio en disco insuficiente"
- **Solución**: Liberar espacio o usar compresión parcial
- **Afecta**: Mapas > 50MB

### Extracción
- **Requiere**: Espacio adicional para extracción
- **Sugerencia**: Limpiar mapas extraídos antiguos

## Futuras Mejoras

1. **Compresión por partes** para mapas grandes
2. **Descarga en streaming** 
3. **Compresión diferencial** (solo cambios)
4. **Nube storage** para mapas comprimidos
5. **Auto-limpieza** de mapas extraídos

## Soporte

Para problemas con la compresión o descarga de mapas:
1. **Verificar espacio disponible** en disco
2. **Revisar conexión a internet**
3. **Limpiar caché** del navegador
4. **Contactar soporte** si persiste el problema

---

**Última actualización**: 9 de abril de 2026  
**Versión**: 1.0  
**Sistema**: TerraBuild Map Compression

# TerraBuild - Juego Medieval 3D

## Descripción

TerraBuild es un juego de aventura medieval 3D inspirado en Minecraft, con personajes seleccionables, sistema de fabricación, múltiples mapas y un mundo inmersivo.

## Características Principales

### Mundo Medieval
- **Renderizado 3D** con THREE.js
- **Cámara rotativa automática** y controles manuales
- **Mundo dinámico** con estructuras medievales
- **Sistema de día/noche** y efectos visuales

### Sistema de Mapas
- **4 mapas medievales** disponibles:
  - Casa Medieval 01 (16 regiones, 37.6 MB)
  - Pueblo de Montaña (26 regiones, 61.6 MB)
  - Palacio Beauclair (51 regiones, 208.0 MB)
  - Mansión Medieval (4 regiones, 16.6 MB)
- **Integración con mapas de Minecraft** (.mca files)
- **Sistema de validación** automático de mapas

### Sistema de Fabricación
- **25+ recetas** de fabricación medieval
- **5 categorías**: Herramientas, Armas, Armadura, Mágico, Objetos
- **Materiales**: Madera, Piedra, Hierro, Oro, Diamante
- **Interfaz intuitiva** con drag & drop
- **Propiedades dinámicas**: Durabilidad, daño, protección

### Personajes
- **Guerrero P1**: Alta fuerza, combate cuerpo a cuerpo
- **Mago P2**: Hechizos elementales, conocimiento arcano
- **Sistema de animaciones** y personalización

## Instalación y Configuración

### Requisitos
- Navegador web moderno (Chrome, Firefox, Edge, Safari)
- Conexión a internet (para cargar THREE.js)
- Al menos 4GB de RAM recomendado

### Pasos de Instalación

1. **Descargar los archivos** del proyecto
2. **Colocar en servidor web** (XAMPP, Apache, Nginx, etc.)
3. **Acceder a `index.html`** desde el navegador
4. **Esperar la carga** automática de sistemas

### Estructura de Archivos

```
TerraBuild/
|-- index.html                 # Página principal
|-- main.css                   # Estilos medievales
|-- character-loader.js        # Sistema de personajes
|-- crafting-system.js         # Motor de fabricación
|-- crafting-ui.js            # Interfaz de fabricación
|-- crafting-demo.js          # Demostración de fabricación
|-- entity-manager.js          # Gestor de entidades
|-- game-system.js            # Sistema principal del juego
|-- game-tester.js            # Sistema de pruebas
|-- map-loader.js              # Cargador de mapas
|-- map-validator.js           # Validador de mapas
|-- medieval-world.js          # Mundo medieval 3D
|-- minecraft-map-reader.js    # Lector de mapas Minecraft
|-- terra-build-integration.js # Integración principal
|-- assets/                    # Recursos del juego
|-- MapasTerra/               # Mapas del juego
|   |-- A_Medieval_House_01/
|   |-- Medieval_Mansion/
|   |-- Medieval_Mountain_Village/
|   |-- Beauclair_Palace/
```

## Controles del Juego

### Mundo Original
- **Clic izquierdo**: Avanzar
- **Clic derecho**: Retroceder
- **Movimiento libre** con mouse

### Mundo Medieval
- **Cámara automática rotativa**
- **V**: Cambiar entre 1ra/3ra persona
- **Botón "Cambiar Vista"**: Cambiar modo
- **Botón "Resetear"**: Resetear posición
- **Q/E**: Ajustar cámara lateral (3ra persona)
- **R/F**: Ajustar cámara altura (3ra persona)
- **W/S**: Ajustar cámara distancia (3ra persona)

### Controles Generales
- **E**: Interactuar con personajes/objetos
- **I**: Mostrar inventario
- **C**: Abrir fabricación
- **ESC**: Menú principal / Pausar

### Fabricación
- **Botón "Fabricación"**: Abrir mesa de trabajo
- **Arrastra materiales** al grid 3x3
- **Clic en slots** para limpiar
- **ESC**: Cerrar interfaz

## Sistema de Fabricación

### Herramientas Básicas
- **Hachas**: Para talar árboles
- **Picotas**: Para minar rocas
- **Palas**: Para cavar tierra
- **Azadas**: Para agricultura

### Armas
- **Espadas**: 5 niveles (madera, piedra, hierro, oro, diamante)
- **Arco Largo**: Combate a distancia
- **Tijeras**: Para lana y hojas

### Armadura
- **Cascos**: Protección para la cabeza
- **Pecheras**: Protección para el torso
- **Sistema de slots**: Cabeza, pecho

### Objetos Especiales
- **Mechero**: Hierro + Pedernal
- **Cubeta**: 3 lingotes de hierro
- **Brújula**: Hierro + Redstone
- **Reloj**: Oro + Redstone
- **Varita Mágica**: Diamante + Palo
- **Amuleto Sagrado**: Oro + Diamante

## Mapas Disponibles

### Casa Medieval 01
- **Tamaño**: Pequeño (16 regiones)
- **Complejidad**: Baja
- **Ideal para**: Pruebas rápidas
- **Tiempo de carga**: ~2 segundos

### Pueblo de Montaña
- **Tamaño**: Mediano (26 regiones)
- **Complejidad**: Media
- **Ideal para**: Exploración
- **Tiempo de carga**: ~3 segundos

### Palacio Beauclair
- **Tamaño**: Enorme (51 regiones)
- **Complejidad**: Alta
- **Ideal para**: Experiencia completa
- **Tiempo de carga**: ~6 segundos

### Mansión Medieval
- **Tamaño**: Compacto (4 regiones)
- **Complejidad**: Media
- **Ideal para**: Desarrollo
- **Tiempo de carga**: ~1 segundo

## Solución de Problemas

### Problemas Comunes

#### El juego no carga
- **Verificar consola**: F12 para ver errores
- **Recargar página**: Ctrl + F5
- **Verificar servidor**: Asegurar que está corriendo

#### Mapas no disponibles
- **Verificar carpeta MapasTerra**: Debe existir
- **Validar mapas**: `window.validateMaps()` en consola
- **Revisar permisos**: Carpeta debe ser accesible

#### Fabricación no funciona
- **Verificar materiales**: `window.craftingUI.inventory` en consola
- **Reiniciar sistema**: `window.craftingSystem = new CraftingSystem()`
- **Probar demo**: `window.craftingDemo.runFullDemo()`

#### Controles no responden
- **Verificar foco**: Clic en la ventana del juego
- **Reiniciar controles**: `window.terraBuild.setupGlobalControls()`
- **Probar funciones**: `window.gameTester.testFunction('startGame')`

### Herramientas de Depuración

#### Consola del Navegador
```javascript
// Verificar estado del sistema
window.terraBuild.getSystemStatus()

// Ejecutar pruebas completas
window.runTests()

// Verificar que el juego esté listo
window.verifyGameReady()

// Validar mapas
window.validateMaps()

// Probar fabricación
window.craftingDemo.runFullDemo()
```

#### Sistema de Pruebas Integrado
- **Automático**: Se ejecuta al cargar la página
- **Manual**: `window.runTests()`
- **Reporte**: Muestra estado de todos los componentes

## Desarrollo y Modificación

### Agregar Nuevos Mapas
1. **Colocar archivos** en `MapasTerra/NuevoMapa/`
2. **Agregar entrada** en `map-loader.js`
3. **Actualizar validador** en `map-validator.js`
4. **Probar carga**: `window.mapValidator.validateMapById('nuevo_mapa')`

### Agregar Nuevas Recetas
1. **Definir receta** en `crafting-system.js`
2. **Agregar materiales** si es necesario
3. **Probar fabricación**: `window.craftingUI.open()`
4. **Verificar demo**: `window.craftingDemo.runFullDemo()`

### Modificar Personajes
1. **Editar modelos** en `assets/models/`
2. **Actualizar loader** en `character-loader.js`
3. **Modificar animaciones** si es necesario
4. **Probar selección**: `window.showCharacterSelection()`

## Rendimiento y Optimización

### Recomendaciones
- **Usar Casa Medieval** para desarrollo
- **Limitar objetos** en escenas grandes
- **Optimizar texturas** para mejor rendimiento
- **Monitorear memoria** en consola

### Estadísticas del Sistema
- **Memoria recomendada**: 4GB+
- **VRAM recomendada**: 2GB+
- **Procesador**: Moderno con soporte WebGL
- **Navegador**: Chrome 90+ o Firefox 88+

## Créditos y Licencia

### Tecnologías Utilizadas
- **THREE.js**: Motor 3D
- **WebGL**: Renderizado gráfico
- **JavaScript ES6+**: Lenguaje principal
- **CSS3**: Estilos y animaciones

### Recursos
- **Mapas**: Comunidad Minecraft
- **Modelos 3D**: Creaciones originales
- **Texturas**: Recursos libres
- **Audio**: Efectos de sonido medievales

## Soporte y Contacto

### Reporte de Errores
- **GitHub Issues**: [Repositorio del proyecto]
- **Consola**: Capturar errores con F12
- **Información del sistema**: Navegador, versión, SO

### Comunidad
- **Discord**: [Servidor de TerraBuild]
- **Foro**: [Foro de discusión]
- **Wiki**: [Documentación extendida]

---

**¡Gracias por jugar TerraBuild!**

*Versión 1.0 - Sistema completo y funcional*

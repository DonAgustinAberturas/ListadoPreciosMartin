# Estructura Modular del JavaScript

## Descripción
El código JavaScript ha sido reorganizado en módulos para mejorar la mantenibilidad y organización del proyecto.

## Estructura de Archivos

```
js/
├── main.js              # Archivo principal que importa todos los módulos
├── modules/
│   ├── config.js        # Configuración de archivos de datos
│   ├── dataParser.js    # Funciones para parsear datos TXT
│   ├── dataLoader.js    # Funciones para cargar datos
│   ├── ui.js           # Funciones de interfaz de usuario
│   └── modal.js        # Funciones del modal de productos
└── README.md           # Esta documentación
```

## Módulos

### `config.js`
- Contiene las rutas de todos los archivos de datos TXT
- Exporta `dataFiles` con todas las configuraciones

### `dataParser.js`
- Función `parseData()` para convertir texto TXT a objetos JavaScript
- Maneja diferentes formatos de datos (con/sin modelo, dimensiones, etc.)

### `dataLoader.js`
- Función `loadData()` para cargar datos desde archivos TXT
- Función `applyFilter()` para filtrar productos
- Función `updatePrices()` para actualizar precios
- Maneja la lógica de carga de datos para cada pestaña

### `ui.js`
- Función `switchTab()` para cambiar entre pestañas
- Función `displayTable()` para mostrar tablas de productos
- Función `showEmptyState()` para mostrar estados vacíos

### `modal.js`
- Función `openModal()` para abrir el modal de productos
- Función `closeModal()` para cerrar el modal
- Función `generateProductImage()` para generar imágenes según el tipo de producto

### `main.js`
- Archivo principal que importa todos los módulos
- Configura todos los event listeners
- Inicializa la aplicación

## Ventajas de la Modularización

1. **Mantenibilidad**: Cada función tiene su propósito específico
2. **Reutilización**: Los módulos pueden ser reutilizados en otros proyectos
3. **Organización**: Código más limpio y fácil de entender
4. **Escalabilidad**: Fácil agregar nuevas funcionalidades
5. **Debugging**: Más fácil encontrar y corregir errores

## Uso

El archivo `index.html` ahora incluye:
```html
<script type="module" src="js/main.js"></script>
```

Esto permite usar módulos ES6 y mantener la funcionalidad existente.

## Compatibilidad

- Requiere un servidor web (no funciona con `file://`)
- Compatible con navegadores modernos que soporten ES6 modules
- Mantiene toda la funcionalidad original del proyecto

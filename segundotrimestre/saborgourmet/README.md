# 🍽️ Sistema de Gestión - Sabor Gourmet

## Descripción General

**Sabor Gourmet** es un sistema completo de gestión para restaurantes desarrollado con **Programación Orientada a Objetos (POO)** siguiendo una arquitectura de componentes moderna. El sistema permite administrar eficientemente mesas, pedidos, facturación y generar reportes de ventas.

### Restaurante "Sabor Gourmet"
- 📍 Sistema diseñado para gestionar un restaurante con múltiples mesas
- 👥 Manejo de personal (meseros, chefs, cajeros)
- 🍴 Gestión completa del menú
- 💰 Facturación automática con cálculo de impuestos
- 📊 Reportes y análisis de ventas

---

## 📋 Características Principales

### 1. **Gestión de Mesas**
- Visualizar todas las mesas en tiempo real
- Ver estado (Libre, Ocupada, Reservada)
- Filtrar por estado y capacidad
- Asignar mesero responsable
- Registrar tiempo de ocupación

### 2. **Gestión de Pedidos**
- Menú interactivo organizado por categorías
- Agregar items al pedido dinámicamente
- Modificar cantidades en tiempo real
- Cálculo automático de subtotales
- Estados de pedido (Pendiente, En Preparación, Listo, Servido)

### 3. **Facturación**
- Generar facturas automáticas
- Cálculo de IVA (19%)
- Múltiples métodos de pago
- Vista previa de factura
- Historial de facturas

### 4. **Reportes y Análisis**
- Dashboard con estadísticas principales
- Platos más populares
- Horas pico de venta
- Total de ventas
- Exportar datos (PDF, Excel, CSV)

---

## 🏗️ Arquitectura del Sistema

### Diagrama de Componentes

```
┌─────────────────────────────────────────┐
│   SISTEMA DE GESTIÓN SABOR GOURMET     │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────────┐  ┌──────────────┐  │
│  │ Módulo Mesas │  │ Módulo Pedidos│  │
│  └──────────────┘  └──────────────┘  │
│                                         │
│  ┌──────────────┐  ┌──────────────┐  │
│  │ Facturación  │  │   Reportes   │  │
│  └──────────────┘  └──────────────┘  │
│           ▼                            │
│  ┌──────────────────────────────────┐ │
│  │  Controller Central (App.js)     │ │
│  └──────────────────────────────────┘ │
│           ▼                            │
│  ┌──────────────────────────────────┐ │
│  │    Capa de Datos (LocalStorage)  │ │
│  └──────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### Clases del Sistema (POO)

#### Clase Trabajador
```javascript
new Trabajador(
  id,           // Identificador único
  nombre,       // Nombre del trabajador
  cargo,        // 'mesero', 'chef', 'cajero'
  email,        // Correo electrónico
  telefono,     // Número de contacto
  turno         // 'mañana', 'tarde', 'noche'
)
```

#### Clase MenuItem
```javascript
new MenuItem(
  id,           // Identificador único
  nombre,       // Nombre del plato
  descripcion,  // Descripción del plato
  precio,       // Precio en formato numérico
  categoria,    // 'Entrada', 'Plato Principal', 'Postre', 'Bebida'
  preparacion   // Tiempo de preparación en minutos
)
```

#### Clase Mesa
```javascript
new Mesa(
  id,           // Identificador único
  numero,       // Número de mesa (1-N)
  capacidad     // Cantidad de personas
)
```

#### Clase Pedido
```javascript
new Pedido(mesa)  // Vinculado a una mesa específica
  - agregarItem(menuItem, cantidad)
  - removerItem(detallePedido)
  - calcularTotal()
  - cambiarEstado(nuevoEstado)
```

#### Clase Factura
```javascript
new Factura(pedido)  // Generada a partir de un pedido
  - calcularImpuesto()
  - agregarPropina(monto)
  - generarFactura()
```

#### Clase Restaurante (Singleton)
```javascript
// Una única instancia en toda la aplicación
const restaurante = Restaurante.getInstance()
  - agregarMesa(mesa)
  - agregarMenuItemm(menuItem)
  - crearPedido(mesa)
  - crearFactura(pedido)
  - generarReporte()
```

---

## 📁 Estructura de Archivos

```
saborgourmet/
├── index.html                 # Página principal
├── package.json              # Configuración de Node.js
├── DIAGRAMAS.md             # Diagramas de componentes y clases
├── README.md                # Este archivo
├── css/
│   ├── styles.css           # Estilos Bootstrap base
│   └── custom.css           # Estilos personalizados
├── js/
│   ├── classes.js           # Definición de todas las clases POO
│   ├── app.js               # Lógica principal de la aplicación
│   └── scripts.js           # Inicialización y utilidades
├── assets/
│   ├── img/                 # Imágenes del proyecto
│   └── favicon.ico          # Icono de la página
```

---

## 🚀 Instalación y Uso

### 1. Abrir el Proyecto
```bash
cd /home/pepewow/apuntes/Frontend/segundotrimestre/saborgourmet
# Abrir index.html en un navegador web
```

### 2. Cargar Datos de Demostración
1. Ir a la pestaña **"Mesas"**
2. Hacer clic en el botón **"Cargar Datos Demo"**
3. El sistema cargará automáticamente:
   - 8 mesas con diferentes capacidades
   - 3 trabajadores (meseros y chef)
   - 10 artículos de menú
   - Un pedido de ejemplo

### 3. Gestionar Mesas
- Visualizar estado de cada mesa (Libre/Ocupada)
- Filtrar por estado o capacidad
- Ocupar/liberar mesas con los botones de acción
- Ver tiempo de ocupación en tiempo real

### 4. Crear Pedidos
1. Ir a **"Pedidos"**
2. Seleccionar una mesa del dropdown
3. Hacer clic en items del menú para agregarlos
4. Ajustar cantidades si es necesario
5. Hacer clic en **"Guardar Pedido"**

### 5. Facturar
1. Ir a **"Facturación"**
2. Seleccionar un pedido listo de la tabla
3. Hacer clic en **"Generar"**
4. Ver vista previa de la factura

### 6. Consultar Reportes
1. Ir a **"Reportes"**
2. Ver estadísticas en tiempo real:
   - Total de ventas
   - Pedidos procesados
   - Mesas ocupadas
   - Platos más populares

---

## 💻 Tecnologías Utilizadas

### Frontend
- **HTML5**: Estructura semántica
- **CSS3**: Estilos responsivos y animaciones
- **JavaScript (POO)**: Lógica de negocio orientada a objetos
- **Bootstrap 5**: Framework CSS para interfaz responsiva

### Herramientas
- **Font Awesome 6**: Iconografía profesional
- **LocalStorage**: Persistencia de datos en el navegador
- **Bootstrap Bundle**: Componentes interactivos (modales, etc.)

### Dependencias (package.json)
```json
{
  "devDependencies": {
    "webpack": "^5.88.0",
    "babel": "^7.22.0"
  },
  "dependencies": {
    "bootstrap": "^5.3.0",
    "chart.js": "^3.9.1"
  }
}
```

---

## 🎨 Interfaz de Usuario

### Tema de Colores
- **Primario**: Azul marino (#1D809F)
- **Secundario**: Amarillo gourmet (#ecb807)
- **Éxito**: Verde (#198754)
- **Peligro**: Rojo (#dc3545)
- **Información**: Cyan (#0dcaf0)
- **Advertencia**: Amarillo (#ffc107)

### Componentes Principales
- **Navbar**: Navegación entre módulos con logo
- **Cards**: Contenedores de información
- **Badges**: Indicadores de estado
- **Tablas**: Listados de datos
- **Modales**: Formularios emergentes
- **Alerts**: Notificaciones de usuario

---

## 🔧 Principios POO Implementados

### 1. **Encapsulación**
Cada clase encapsula sus propiedades y métodos:
```javascript
class Mesa {
    constructor(id, numero, capacidad) {
        this.id = id;
        this.numero = numero;
        this.estado = 'libre';  // Propiedad privada lógicamente
    }
    
    ocupar(mesero) {          // Método público
        this.estado = 'ocupada';
    }
}
```

### 2. **Herencia**
El patrón Singleton en Restaurante:
```javascript
class Restaurante {
    static instancia = null;
    static getInstance() {
        if (!Restaurante.instancia) {
            new Restaurante();
        }
        return Restaurante.instancia;
    }
}
```

### 3. **Polimorfismo**
Métodos con comportamiento diferente:
```javascript
// Diferentes tipos de reportes
generarReporte()  // Genera reporte general
platosPopulares() // Genera reporte de platos
ventasPorHora()   // Genera reporte de horas pico
```

### 4. **Composición y Agregación**
- Restaurante compone Mesas, MenuItems, Trabajadores
- Mesa contiene Pedido
- Pedido agrega DetallePedido
- Factura se genera a partir de Pedido

---

## 📊 Flujo de Datos

```
1. Usuario selecciona mesa
   ↓
2. Sistema crea Pedido vinculado a Mesa
   ↓
3. Usuario agrega MenuItems al Pedido
   ↓
4. Sistema calcula totales automáticamente
   ↓
5. Usuario guarda Pedido
   ↓
6. Sistema crea Factura desde Pedido
   ↓
7. Datos se guardan en LocalStorage
   ↓
8. Reportes se actualizan en tiempo real
```

---

## 📝 Funcionalidades Avanzadas

### Gestión de Estado
- Estados de Mesa: Libre, Ocupada, Reservada
- Estados de Pedido: Pendiente, Preparación, Listo, Servido
- Disponibilidad de MenuItems

### Cálculos Automáticos
- Subtotal del pedido
- Cálculo de IVA (19%)
- Total con impuestos
- Tiempo de ocupación de mesas

### Persistencia de Datos
- LocalStorage para datos locales
- JSON para exportación
- Sincronización automática

### Análisis y Reportes
- Platos más vendidos
- Horas pico de venta
- Ingresos totales
- Ticket promedio

---

## 🐛 Solución de Problemas

### El sistema no carga datos
**Solución**: Hacer clic en "Cargar Datos Demo" en la pestaña de Mesas.

### Los datos no se guardan
**Solución**: Verificar que LocalStorage esté habilitado en el navegador.

### La interfaz se ve desalineada
**Solución**: Actualizar la página (Ctrl+R o F5).

### No aparecen datos en reportes
**Solución**: Crear al menos un pedido completo y generar una factura.

---

## 🎓 Conceptos Educativos

Este proyecto es un excelente ejemplo de:

1. **Programación Orientada a Objetos** en JavaScript
2. **Arquitectura de Componentes** en aplicaciones web
3. **Diseño Responsivo** con Bootstrap 5
4. **Gestión de Estado** en aplicaciones web
5. **Persistencia de Datos** con LocalStorage
6. **Interfaces de Usuario** modernas e intuitivas

---

## 📚 Diagramas UML Incluidos

Ver el archivo `DIAGRAMAS.md` para:
- ✅ Diagrama de Componentes del sistema
- ✅ Diagrama de Clases completo
- ✅ Relaciones entre clases
- ✅ Patrones de diseño utilizados

---

## 🔐 Seguridad y Validaciones

El sistema incluye:
- ✅ Validación de formularios
- ✅ Prevención de errores en cálculos
- ✅ Sincronización de datos
- ✅ Alertas de confirmación

---

## 📱 Responsividad

La interfaz es completamente responsiva:
- ✅ Desktop (1200px+)
- ✅ Tablet (768px - 1199px)
- ✅ Mobile (< 768px)

---

## 🚀 Mejoras Futuras

1. Backend con Node.js/Express
2. Base de datos (MongoDB/PostgreSQL)
3. Autenticación de usuarios
4. Sistema de sincronización en tiempo real (WebSockets)
5. Aplicación móvil (React Native)
6. Integración con sistemas de pago
7. Historial completo de transacciones
8. Análisis avanzados con Chart.js

---

## 📄 Licencia

Este proyecto es un trabajo educativo creado para demostrar principios de POO y arquitectura de software.

---

## ✉️ Soporte

Para preguntas o sugerencias sobre el proyecto, consultar la documentación incluida o revisar los comentarios en el código.

---

## 🎉 ¡Disfruta tu Sistema de Gestión!

**Sabor Gourmet** está listo para optimizar la gestión de tu restaurante.

```
   ╔═══════════════════════════╗
   ║  🍽️  SABOR GOURMET  🍽️   ║
   ║  Sistema de Gestión      ║
   ║  Versión 1.0             ║
   ╚═══════════════════════════╝
```

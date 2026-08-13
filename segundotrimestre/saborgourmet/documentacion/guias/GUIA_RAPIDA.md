# 🚀 Guía Rápida de Inicio - Sabor Gourmet

## ⚡ 5 Pasos para Comenzar

### Paso 1: Abrir la Aplicación
```
1. Abre el archivo index.html en tu navegador
2. Verás la interfaz principal con 4 pestañas principales
```

### Paso 2: Cargar Datos de Demostración
```
1. Vuelve a la pestaña "Mesas"
2. Haz clic en el botón azul "Cargar Datos Demo"
3. ¡Se cargarán automáticamente 8 mesas, personal y menú!
```

### Paso 3: Explorar Mesas
```
1. Visualiza las 8 mesas disponibles en la pantalla
2. Las mesas verdes = LIBRES, rojo = OCUPADAS
3. Usa los filtros para ver solo mesas libres o de cierta capacidad
4. Haz clic en cualquier mesa para ocuparla/liberarla
```

### Paso 4: Crear un Pedido
```
1. Ve a la pestaña "Pedidos"
2. En el lado izquierdo ves el menú organizado por categorías
3. En el lado derecho:
   - Selecciona una mesa del dropdown
   - Haz clic en items del menú para agregarlos
   - Ajusta cantidades con +/-
   - El total se calcula automáticamente (incluye IVA 19%)
4. Haz clic en "Guardar Pedido"
```

### Paso 5: Generar Factura
```
1. Ve a la pestaña "Facturación"
2. Verás los pedidos listos para facturar
3. Haz clic en "Generar" para cualquier pedido
4. ¡La factura aparecerá en el panel derecho!
```

---

## 📊 Ver Reportes

```
1. Ve a la pestaña "Reportes"
2. Verás tarjetas con:
   - Total de ventas
   - Cantidad de pedidos
   - Mesas ocupadas
   - Platos vendidos
3. Abajo aparecerán:
   - Platos populares
   - Horas pico de venta
```

---

## 🎮 Atajos Útiles

| Acción | Ubicación |
|--------|-----------|
| Ver todas las mesas | Mesas → Limpiar Filtros |
| Crear nuevo item menú | Pedidos → Crear Menú |
| Cambiar estado pedido | Pedidos → Tabla de pedidos → dropdown |
| Exportar datos | Reportes → Botones de descarga |

---

## 💡 Ejemplo Completo

### Escenario: Servir a una familia de 4 personas

1. **Ocupar Mesa**
   - Ve a Mesas
   - Busca una mesa de 4 personas (verde)
   - Haz clic en el botón ✓ para ocuparla

2. **Crear Pedido**
   - Ve a Pedidos
   - Selecciona la mesa ocupada
   - Agrega 2 Ceviches, 2 Filetes Gourmet, 2 Tiramisús
   - Total debe ser: $182.21

3. **Facturar**
   - Ve a Facturación
   - Busca el pedido en la tabla
   - Haz clic en "Generar"
   - Recibirás la factura en PDF (descarga en reportes)

4. **Ver Reportes**
   - Ve a Reportes
   - Verás que el total de ventas aumentó
   - Verás los platos vendidos en "Platos Populares"

---

## 🔧 Solución Rápida de Problemas

### Problema: No aparecen datos en Pedidos
**Solución**: Vuelve a "Mesas" y haz clic en "Cargar Datos Demo"

### Problema: Los totales no se calculan
**Solución**: Actualiza la página (F5) y recarga datos demo

### Problema: Las mesas no cambian de estado
**Solución**: Haz clic en los botones ✓ (ocupar) o ✕ (liberar)

### Problema: No puedo crear un pedido
**Solución**: 
1. Primero selecciona una mesa en el dropdown
2. Luego haz clic en items del menú

---

## 📋 Checklista de Tareas

- [ ] He abierto index.html en el navegador
- [ ] He cargado datos de demostración
- [ ] He creado mi primer pedido
- [ ] He generado una factura
- [ ] He visto los reportes
- [ ] He filtrado mesas por capacidad
- [ ] He modificado cantidades en un pedido
- [ ] He probado a ocupar y liberar una mesa

---

## 🎓 Aprende POO con Sabor Gourmet

Este proyecto demuestra:

### Clases
```javascript
// Una clase para cada concepto del restaurante
new Trabajador(...)  // Personal
new MenuItem(...)    // Platos
new Mesa(...)       // Mesas
new Pedido(...)     // Órdenes
new Factura(...)    // Documentos
```

### Herencia y Polimorfismo
```javascript
// Métodos con comportamientos diferentes según el tipo
mesa.ocupar()       // Cambiar estado
pedido.guardar()    // Registrar datos
factura.generar()   // Crear documento
```

### Encapsulación
```javascript
// Propiedades protegidas, métodos públicos
class Mesa {
    this.estado = 'libre'  // Propiedad
    ocupar() { ... }       // Método
}
```

---

## 🌐 Acceso a Módulos

### Navbar (Navegación Principal)
- 🪑 **Mesas**: Gestión de mesas y ocupación
- 📋 **Pedidos**: Crear y gestionar pedidos
- 🧾 **Facturación**: Generar facturas
- 📊 **Reportes**: Análisis y estadísticas

---

## 💾 Datos Automáticos

### Se guarda automáticamente:
- ✅ Estado de cada mesa
- ✅ Todos los pedidos creados
- ✅ Todas las facturas generadas
- ✅ Historial de cambios

### Se borra cuando:
- ❌ Cierres el navegador (puedes guardar en JSON)
- ❌ Limpies el caché del navegador
- ❌ Hagas clic en "Cargar Datos Demo" nuevamente

---

## 📞 Datos de Demostración

### Mesas
- 4 mesas para 2 personas
- 2 mesas para 4 personas
- 2 mesas para 6 personas
- 1 mesa para 8 personas

### Trabajadores
- Juan García (Mesero)
- María López (Mesero)
- Carlos Rodríguez (Chef)

### Menú (10 Items)
- Entrada: Ceviche, Tabla de Quesos
- Plato: Filete, Salmón, Pasta, Arroz
- Postre: Tiramisú, Flan
- Bebida: Agua, Vino

---

## 🎉 ¡Listo para Empezar!

Ya tienes todo lo que necesitas. 

**Próximo paso**: Abre `index.html` y haz clic en "Cargar Datos Demo"

¿Preguntas? Consulta `README.md` para documentación completa.

```
   🍽️  ¡Bienvenido a Sabor Gourmet!  🍽️
```

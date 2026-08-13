# 🔧 Guía de Debugging y Solución de Problemas

## 🐛 Problemas Comunes y Soluciones

### 1. "La página no carga"

**Síntomas:**
- Pantalla en blanco
- Error de conexión

**Soluciones:**
```
1. Verifica que el archivo index.html existe
   cd /home/pepewow/apuntes/Frontend/segundotrimestre/saborgourmet
   
2. Abre directamente en el navegador:
   file:///home/pepewow/apuntes/Frontend/segundotrimestre/saborgourmet/index.html
   
3. Abre la consola del navegador (F12) y busca errores de red
   
4. Limpia el caché del navegador:
   - Chrome: Ctrl+Shift+Delete
   - Firefox: Ctrl+Shift+Delete
   - Safari: Cmd+Option+E
```

---

### 2. "No aparecen las mesas"

**Síntomas:**
- Mensaje "No hay mesas cargadas"
- Contenedor vacío

**Soluciones:**
```
1. Haz clic en "Cargar Datos Demo" (botón azul)
   
2. Abre la consola (F12) y verifica:
   console.log(app.restaurante.mesas)
   
3. Verifica que LocalStorage esté habilitado:
   - Abre Configuración del navegador
   - Busca "LocalStorage" o "Cookies"
   - Asegúrate que está habilitado
   
4. Si el problema persiste:
   - Limpia caché
   - Recarga la página (Ctrl+F5)
   - Vuelve a cargar datos demo
```

---

### 3. "Los datos no se guardan"

**Síntomas:**
- Al recargar, los pedidos desaparecen
- Las mesas vuelven a estado "libre"

**Soluciones:**
```
1. Verifica en la consola del navegador:
   F12 → Pestaña "Storage" → LocalStorage
   
2. Busca la clave "saborgourmet_data"
   
3. Si no existe, el problema es con LocalStorage:
   - Navegador en modo privado/incógnito: esto desactiva LocalStorage
   - Limpia cookies y datos de sitio
   - Abre el sitio en modo normal
   
4. Ejecuta en la consola para forzar guardado:
   app.guardarDataEnStorage()
   console.log("Datos guardados")
```

---

### 4. "El total no se calcula correctamente"

**Síntomas:**
- Totales incorrectos
- IVA no aparece
- Suma mal de items

**Soluciones:**
```javascript
1. Abre la consola (F12) y ejecuta:
   app.pedidoActual.calcularTotal()
   console.log(app.pedidoActual.total)
   
2. Verifica que los precios sean números:
   app.restaurante.menu.forEach(item => {
       console.log(item.nombre, typeof item.precio, item.precio)
   })
   
3. Recalcula manualmente:
   - Elimina todos los items
   - Agrégalos de nuevo
   - El total debería recalcularse

4. Si sigue fallando:
   - Abre DevTools (F12)
   - Pestaña "Console"
   - Copia cualquier error rojo
   - Intenta reportarlo
```

---

### 5. "No puedo crear un pedido"

**Síntomas:**
- Error al intentar guardar pedido
- Items no se agregan
- Dropdown de mesa vacío

**Soluciones:**
```
1. Verifica que haya mesas:
   - Ve a Mesas
   - Haz clic en "Cargar Datos Demo"
   
2. Selecciona una mesa en el dropdown:
   - El dropdown debe mostrar "Mesa 1, Mesa 2, etc."
   - Si está vacío, no hay mesas cargadas
   
3. Agrega items del menú:
   - Haz clic en cualquier item del lado izquierdo
   - El item debe aparecer en el lado derecho
   
4. Si el botón "Guardar Pedido" está deshabilitado:
   - Necesitas al menos 1 item en el pedido
   - Si hay items pero está gris, actualiza la página

5. Comprueba en la consola:
   console.log("Mesas:", app.restaurante.mesas.length)
   console.log("Menú:", app.restaurante.menu.length)
   console.log("Pedido actual:", app.pedidoActual)
```

---

### 6. "La factura se ve mal"

**Síntomas:**
- Texto cortado
- Números fuera de lugar
- Formatos incorrectos

**Soluciones:**
```
1. Abre desde una pantalla grande:
   - Factura está optimizada para 400px
   - En celulares puede verse rara
   
2. Zoom correcto del navegador:
   - Presiona Ctrl+0 (reset a 100%)
   - Si necesitas zoom, usa Ctrl++ o Ctrl+-
   
3. Actualiza la página:
   - F5 para refrescar
   - Ctrl+F5 para limpiar caché
   
4. Verifica que la factura tenga datos:
   - Debe haber un pedido con items
   - El total debe ser > 0
   - Haz clic en "Generar" nuevamente
```

---

### 7. "Los botones no responden"

**Síntomas:**
- Botones no reaccionan al clic
- Las mesas no cambian de estado
- Los filtros no funcionan

**Soluciones:**
```javascript
1. Verifica que JavaScript está habilitado:
   - Abre DevTools (F12)
   - Si ves errores rojos, hay problemas JS
   
2. Abre la consola y ejecuta:
   typeof app  // Debe decir "object"
   typeof app.ocuparMesa  // Debe decir "function"
   
3. Prueba manualmente en consola:
   app.ocuparMesa(1)  // Intenta ocupar mesa 1
   app.renderizarMesas()  // Redibuja mesas
   
4. Si aún no funciona:
   - Limpia caché (Ctrl+Shift+Delete)
   - Recarga la página (Ctrl+F5)
   - Vuelve a cargar datos demo
```

---

### 8. "La interfaz se ve desalineada"

**Síntomas:**
- Elementos fuera de lugar
- Texto encima de botones
- Grid mal formado

**Soluciones:**
```
1. Zoom del navegador:
   - Presiona Ctrl+0 para resetear zoom
   
2. Redimensiona la ventana:
   - Maximiza el navegador
   - Intenta en pantalla completa (F11)
   
3. Limpia estilos caché:
   - Ctrl+Shift+Delete (borrar caché)
   - Ctrl+F5 (recarga con caché limpio)
   
4. Cambia de navegador:
   - Si solo te pasa en un navegador
   - Prueba en Chrome, Firefox, Safari, Edge
   
5. Abre DevTools y verifica CSS:
   - F12 → Pestaña Elements/Inspector
   - Busca el elemento problemático
   - Revisa los estilos aplicados
```

---

## 🔍 Debugging Avanzado

### Inspeccionar Datos en Consola

```javascript
// Ver todas las mesas
console.table(app.restaurante.mesas)

// Ver todo el menú
console.table(app.restaurante.menu)

// Ver todos los pedidos
console.table(app.restaurante.pedidos)

// Ver todas las facturas
console.table(app.restaurante.facturas)

// Ver el restaurante (Singleton)
console.log(app.restaurante)

// Ver el pedido actual
console.log(app.pedidoActual)

// Ver datos guardados en LocalStorage
console.log(localStorage.getItem('saborgourmet_data'))

// Ver estadísticas
console.table(app.restaurante.obtenerEstadisticas())
```

---

### Forzar Reinicio

```javascript
// Limpiar TODOS los datos
app.restaurante.limpiarDatos()
console.log("Datos limpios")

// Recargar interfaz
app.renderizarMesas()
app.renderizarMenu()
app.renderizarPedidos()

// Guardar nuevamente
app.guardarDataEnStorage()
console.log("Sistema reiniciado")
```

---

### Verificar Instalación

```javascript
// Verificar que todas las clases existen
console.assert(typeof Trabajador === 'function', 'Trabajador no existe')
console.assert(typeof MenuItem === 'function', 'MenuItem no existe')
console.assert(typeof Mesa === 'function', 'Mesa no existe')
console.assert(typeof Pedido === 'function', 'Pedido no existe')
console.assert(typeof Factura === 'function', 'Factura no existe')
console.assert(typeof App === 'function', 'App no existe')

// Si todos pasan, el sistema está correctamente instalado
console.log("✅ Todas las clases están disponibles")
```

---

## 📋 Checklist de Verificación

### Si algo no funciona, verifica esto:

- [ ] El navegador es moderno (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- [ ] La página se carga sin errores en consola (F12)
- [ ] LocalStorage está habilitado (no estás en modo privado)
- [ ] JavaScript está habilitado en el navegador
- [ ] Has cargado datos demo ("Cargar Datos Demo")
- [ ] Zoom del navegador está en 100% (Ctrl+0)
- [ ] Has intentado limpiar caché (Ctrl+Shift+Delete + Ctrl+F5)
- [ ] Los archivos CSS se cargan (verifica en F12 → Network)
- [ ] Los archivos JS se cargan sin errores (verifica en F12 → Console)
- [ ] La aplicación global "app" existe (escribe "app" en F12)

---

## 🆘 Si Nada Funciona

### Reinicio Completo:

```
1. Abre DevTools (F12)
2. Pestaña "Storage"
3. Haz clic derecho en "Local Storage"
4. "Delete All" o borra la entrada "saborgourmet_data"
5. Recarga la página (F5)
6. Espera a que cargue completamente
7. Haz clic en "Cargar Datos Demo"
```

### Si sigue sin funcionar:

```
1. Cierra el navegador completamente
2. Vuelve a abrirlo
3. Ve a:
   file:///home/pepewow/apuntes/Frontend/segundotrimestre/saborgourmet/index.html
4. Abre DevTools (F12)
5. Copia cualquier error rojo
6. Intenta en otro navegador
```

---

## 📞 Información de Navegadores

### Chrome/Chromium
```
DevTools: F12 o Ctrl+Shift+I
Caché:    Ctrl+Shift+Delete
Recargar: Ctrl+F5
```

### Firefox
```
DevTools: F12 o Ctrl+Shift+I
Caché:    Ctrl+Shift+Delete
Recargar: Ctrl+F5
```

### Safari
```
DevTools: Cmd+Option+I (habilitar en Preferencias)
Caché:    Cmd+Option+E
Recargar: Cmd+R o Cmd+Shift+R
```

### Edge
```
DevTools: F12 o Ctrl+Shift+I
Caché:    Ctrl+Shift+Delete
Recargar: Ctrl+F5
```

---

## ✅ Verificación de Funcionalidad

### Para confirmar que todo funciona:

1. **Sistema inicia**: Ves el navbar con 4 pestañas
2. **Datos cargan**: Haces clic en "Cargar Datos Demo" y ves 8 mesas
3. **Pedidos funcionan**: Creas un pedido y aparece en la tabla
4. **Facturas se generan**: Haces clic en "Generar" y ves factura
5. **Reportes actualizan**: El total en reportes cambia cuando factura
6. **Datos se guardan**: Recarga la página, los datos permanecen

Si todo esto funciona, ✅ **¡El sistema está 100% operativo!**

---

## 🎓 Trucos Útiles

### Ver qué está pasando:
```javascript
// Habilitar logs detallados
window.DEBUG = true

// Rastrear cambios
Object.observe = function() {
    console.log("Cambio detectado")
}

// Ver cada operación
app.renderizarMesas() // Fuerza redibujado
app.actualizarReportes() // Actualiza stats
```

### Acelerar pruebas:
```javascript
// Crear pedido automático
const mesa1 = app.restaurante.obtenerMesa(1)
const pedido = app.restaurante.crearPedido(mesa1)
pedido.agregarItem(app.restaurante.menu[0], 2)
pedido.agregarItem(app.restaurante.menu[2], 1)

// Generar factura
const factura = app.restaurante.crearFactura(pedido)
console.log(factura.generarFactura())
```

---

## 📊 Logs Útiles

```javascript
// Ver todo lo que sucede
console.log = (function(original) {
    return function(...args) {
        original.apply(console, ['[LOG]', ...args])
    }
})(console.log)
```

---

¡Si aún tienes problemas, consulta README.md o GUIA_RAPIDA.md!

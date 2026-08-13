/**
 * SISTEMA DE GESTIÓN DE RESTAURANTE "SABOR GOURMET"
 * Clases basadas en Programación Orientada a Objetos (POO)
 * Sigue la arquitectura definida en los diagramas de componentes y clases
 */

// ======================== CLASE TRABAJADOR ========================
class Trabajador {
    constructor(id, nombre, cargo, email, telefono, turno = 'mañana') {
        this.id = id;
        this.nombre = nombre;
        this.cargo = cargo; // 'mesero', 'chef', 'cajero'
        this.email = email;
        this.telefono = telefono;
        this.turno = turno;
        this.activo = true;
    }

    obtenerInfo() {
        return {
            id: this.id,
            nombre: this.nombre,
            cargo: this.cargo,
            email: this.email,
            telefono: this.telefono,
            turno: this.turno,
            activo: this.activo
        };
    }

    cambiarTurno(nuevoTurno) {
        this.turno = nuevoTurno;
    }

    desactivar() {
        this.activo = false;
    }

    activar() {
        this.activo = true;
    }
}

// ======================== CLASE MENUITEM ========================
class MenuItem {
    constructor(id, nombre, descripcion, precio, categoria = 'Plato Principal', preparacion = 15) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = parseFloat(precio);
        this.categoria = categoria;
        this.disponible = true;
        this.preparacion = preparacion; // minutos
    }

    obtenerPrecio() {
        return this.precio;
    }

    esDisponible() {
        return this.disponible;
    }

    tiempoPreparacion() {
        return this.preparacion;
    }

    cambiarDisponibilidad(disponible) {
        this.disponible = disponible;
    }

    cambiarPrecio(nuevoPrecio) {
        this.precio = parseFloat(nuevoPrecio);
    }
}

// ======================== CLASE DETALLEPEDIDO ========================
class DetallePedido {
    constructor(menuItem, cantidad = 1) {
        this.menuItem = menuItem;
        this.cantidad = cantidad;
        this.precioUnitario = menuItem.obtenerPrecio();
        this.subtotal = this.precioUnitario * this.cantidad;
        this.observaciones = '';
    }

    calcularSubtotal() {
        this.subtotal = this.precioUnitario * this.cantidad;
        return this.subtotal;
    }

    modificarCantidad(nuevaCantidad) {
        this.cantidad = parseInt(nuevaCantidad);
        this.calcularSubtotal();
    }

    agregarObservaciones(obs) {
        this.observaciones = obs;
    }

    obtenerDetalles() {
        return {
            item: this.menuItem.nombre,
            cantidad: this.cantidad,
            precioUnitario: this.precioUnitario,
            subtotal: this.subtotal,
            observaciones: this.observaciones
        };
    }
}

// ======================== CLASE PEDIDO ========================
class Pedido {
    static contador = 1;

    constructor(mesa) {
        this.id = Pedido.contador++;
        this.mesa = mesa;
        this.items = [];
        this.fecha = new Date();
        this.estado = 'pendiente'; // 'pendiente', 'preparacion', 'listo', 'servido'
        this.total = 0;
        this.observaciones = '';
    }

    agregarItem(menuItem, cantidad = 1) {
        const detalleExistente = this.items.find(d => d.menuItem.id === menuItem.id);
        
        if (detalleExistente) {
            detalleExistente.modificarCantidad(detalleExistente.cantidad + cantidad);
        } else {
            const detalle = new DetallePedido(menuItem, cantidad);
            this.items.push(detalle);
        }
        this.calcularTotal();
    }

    removerItem(detallePedido) {
        const index = this.items.indexOf(detallePedido);
        if (index > -1) {
            this.items.splice(index, 1);
            this.calcularTotal();
        }
    }

    modificarCantidad(detallePedido, nuevaCantidad) {
        detallePedido.modificarCantidad(nuevaCantidad);
        this.calcularTotal();
    }

    calcularTotal() {
        this.total = this.items.reduce((sum, detalle) => sum + detalle.subtotal, 0);
        return this.total;
    }

    cambiarEstado(nuevoEstado) {
        this.estado = nuevoEstado;
    }

    obtenerItems() {
        return this.items;
    }

    obtenerDetalles() {
        return {
            id: this.id,
            mesa: this.mesa.numero,
            items: this.items.map(d => d.obtenerDetalles()),
            fecha: this.fecha.toLocaleString('es-ES'),
            estado: this.estado,
            total: this.total,
            observaciones: this.observaciones
        };
    }

    agregarObservaciones(obs) {
        this.observaciones = obs;
    }
}

// ======================== CLASE MESA ========================
class Mesa {
    constructor(id, numero, capacidad = 4) {
        this.id = id;
        this.numero = numero;
        this.capacidad = capacidad;
        this.estado = 'libre'; // 'libre', 'ocupada', 'reservada'
        this.pedido = null;
        this.mesero = null;
        this.horaOcupacion = null;
    }

    ocupar(mesero) {
        this.estado = 'ocupada';
        this.mesero = mesero;
        this.horaOcupacion = new Date();
    }

    liberar() {
        this.estado = 'libre';
        this.mesero = null;
        this.horaOcupacion = null;
        this.pedido = null;
    }

    reservar() {
        this.estado = 'reservada';
    }

    asignarPedido(pedido) {
        this.pedido = pedido;
    }

    obtenerPedido() {
        return this.pedido;
    }

    obtenerTiempoOcupacion() {
        if (!this.horaOcupacion) return 0;
        const ahora = new Date();
        return Math.round((ahora - this.horaOcupacion) / 60000); // minutos
    }

    cambiarEstado(nuevoEstado) {
        this.estado = nuevoEstado;
    }

    obtenerInfo() {
        return {
            id: this.id,
            numero: this.numero,
            capacidad: this.capacidad,
            estado: this.estado,
            mesero: this.mesero ? this.mesero.nombre : 'Sin asignar',
            tiempoOcupacion: this.obtenerTiempoOcupacion(),
            tienePedido: this.pedido !== null
        };
    }
}

// ======================== CLASE FACTURA ========================
class Factura {
    static contador = 1000;

    constructor(pedido) {
        this.id = Factura.contador++;
        this.pedido = pedido;
        this.fecha = new Date();
        this.subtotal = pedido.total;
        this.impuesto = this.calcularImpuesto();
        this.propina = 0;
        this.total = this.subtotal + this.impuesto;
        this.metodoPago = 'efectivo';
    }

    calcularImpuesto() {
        const TASA_IVA = 0.19;
        return parseFloat((this.subtotal * TASA_IVA).toFixed(2));
    }

    agregarPropina(monto) {
        this.propina = parseFloat(monto);
        this.total = this.subtotal + this.impuesto + this.propina;
    }

    cambiarMetodoPago(metodo) {
        this.metodoPago = metodo;
    }

    generarFactura() {
        const detalles = this.pedido.obtenerDetalles();
        return {
            numeroFactura: this.id,
            fecha: this.fecha.toLocaleString('es-ES'),
            mesa: detalles.mesa,
            items: detalles.items,
            subtotal: this.subtotal,
            iva: this.impuesto,
            propina: this.propina,
            total: this.total,
            metodoPago: this.metodoPago
        };
    }

    obtenerDetalles() {
        return this.generarFactura();
    }

    exportarJSON() {
        return JSON.stringify(this.generarFactura(), null, 2);
    }
}

// ======================== CLASE REPORTE ========================
class Reporte {
    constructor(fechaInicio = null, fechaFin = null) {
        this.fechaInicio = fechaInicio || new Date();
        this.fechaFin = fechaFin || new Date();
        this.pedidos = [];
        this.facturas = [];
    }

    agregarPedido(pedido) {
        this.pedidos.push(pedido);
    }

    agregarFactura(factura) {
        this.facturas.push(factura);
    }

    generarReporte() {
        return {
            fechaInicio: this.fechaInicio.toLocaleDateString('es-ES'),
            fechaFin: this.fechaFin.toLocaleDateString('es-ES'),
            totalVentas: this.ingresoTotal(),
            cantidadPedidos: this.pedidos.length,
            platosVendidos: this.platosVendidos(),
            ingresoPromedioPorPedido: this.ingresoPromedioPorPedido()
        };
    }

    ventasPorHora() {
        const ventas = new Map();
        this.pedidos.forEach(pedido => {
            const hora = pedido.fecha.getHours() + ':00';
            const cantidad = ventas.get(hora) || 0;
            ventas.set(hora, cantidad + 1);
        });
        return ventas;
    }

    platosPopulares() {
        const contador = {};
        this.pedidos.forEach(pedido => {
            pedido.items.forEach(detalle => {
                const nombre = detalle.menuItem.nombre;
                contador[nombre] = (contador[nombre] || 0) + detalle.cantidad;
            });
        });
        
        return Object.entries(contador)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([nombre, cantidad]) => ({ nombre, cantidad }));
    }

    ingresoTotal() {
        return this.facturas.reduce((sum, factura) => sum + factura.total, 0);
    }

    ingresoPromedioPorPedido() {
        if (this.pedidos.length === 0) return 0;
        return (this.ingresoTotal() / this.pedidos.length).toFixed(2);
    }

    platosVendidos() {
        return this.pedidos.reduce((sum, pedido) => {
            return sum + pedido.items.reduce((itemSum, detalle) => itemSum + detalle.cantidad, 0);
        }, 0);
    }

    exportarJSON() {
        return JSON.stringify(this.generarReporte(), null, 2);
    }

    exportarCSV() {
        const reporte = this.generarReporte();
        let csv = 'Reporte de Ventas - Sabor Gourmet\n\n';
        csv += `Período: ${reporte.fechaInicio} a ${reporte.fechaFin}\n`;
        csv += `Total Ventas,${reporte.totalVentas}\n`;
        csv += `Cantidad Pedidos,${reporte.cantidadPedidos}\n`;
        csv += `Platos Vendidos,${reporte.platosVendidos}\n`;
        csv += `Ingreso Promedio,${reporte.ingresoPromedioPorPedido}\n`;
        return csv;
    }
}

// ======================== CLASE RESTAURANTE (SINGLETON) ========================
class Restaurante {
    static instancia = null;

    constructor(nombre = 'Sabor Gourmet', direccion = '', telefono = '') {
        if (Restaurante.instancia) {
            return Restaurante.instancia;
        }

        this.nombre = nombre;
        this.direccion = direccion;
        this.telefono = telefono;
        this.mesas = [];
        this.menu = [];
        this.trabajadores = [];
        this.pedidos = [];
        this.facturas = [];
        this.reporteActual = new Reporte();

        Restaurante.instancia = this;
    }

    static getInstance() {
        if (!Restaurante.instancia) {
            new Restaurante();
        }
        return Restaurante.instancia;
    }

    agregarMesa(mesa) {
        this.mesas.push(mesa);
    }

    agregarMenuItemm(menuItem) {
        this.menu.push(menuItem);
    }

    agregarTrabajador(trabajador) {
        this.trabajadores.push(trabajador);
    }

    obtenerMesa(id) {
        return this.mesas.find(m => m.id === id);
    }

    obtenerMenuItems() {
        return this.menu;
    }

    crearPedido(mesa) {
        const pedido = new Pedido(mesa);
        this.pedidos.push(pedido);
        return pedido;
    }

    crearFactura(pedido) {
        const factura = new Factura(pedido);
        this.facturas.push(factura);
        this.reporteActual.agregarFactura(factura);
        return factura;
    }

    generarReporte(fechaInicio = null, fechaFin = null) {
        const reporte = new Reporte(fechaInicio, fechaFin);
        this.pedidos.forEach(p => reporte.agregarPedido(p));
        this.facturas.forEach(f => reporte.agregarFactura(f));
        return reporte;
    }

    obtenerEstadisticas() {
        const mesasOcupadas = this.mesas.filter(m => m.estado === 'ocupada').length;
        const totalVentas = this.facturas.reduce((sum, f) => sum + f.total, 0);
        const totalPedidos = this.pedidos.length;

        return {
            mesasOcupadas,
            mesasLibres: this.mesas.length - mesasOcupadas,
            totalMesas: this.mesas.length,
            totalVentas,
            totalPedidos,
            ticketPromedio: totalPedidos > 0 ? (totalVentas / totalPedidos).toFixed(2) : 0
        };
    }

    limpiarDatos() {
        // Método para limpiar datos de demostración
        this.mesas = [];
        this.menu = [];
        this.trabajadores = [];
        this.pedidos = [];
        this.facturas = [];
        this.reporteActual = new Reporte();
        Pedido.contador = 1;
        Factura.contador = 1000;
    }
}

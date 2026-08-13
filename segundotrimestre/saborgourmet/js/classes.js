/**
 * SISTEMA DE GESTIÓN DE RESTAURANTE "SABOR GOURMET"
 * Clases basadas en Programación Orientada a Objetos (POO)
 */

// ======================== CLASE USUARIO ========================
class Usuario {
    constructor(id, nombre, username, email, password, rol = 'mesero') {
        this.id = id;
        this.nombre = nombre;
        this.username = username;
        this.email = email;
        this.password = password;
        this.rol = rol; // 'admin', 'mesero', 'chef', 'cajero'
        this.activo = true;
        this.fechaCreacion = new Date();
    }

    validarCredenciales(credencial, pass) {
        const coincideUsuario = (this.username.toLowerCase() === credencial.toLowerCase() || 
                           this.email.toLowerCase() === credencial.toLowerCase());
        return coincideUsuario && this.password === pass && this.activo;
    }

    obtenerPermisos() {
        const permisosPorRol = {
            'admin': ['dashboard', 'mesas', 'pedidos', 'cocina', 'facturacion', 'clientes', 'usuarios', 'reportes', 'historial'],
            'mesero': ['dashboard', 'mesas', 'pedidos', 'clientes'],
            'chef': ['dashboard', 'cocina'],
            'cajero': ['dashboard', 'pedidos', 'facturacion', 'clientes', 'reportes']
        };
        return permisosPorRol[this.rol] || ['dashboard'];
    }

    tienePermiso(modulo) {
        return this.obtenerPermisos().includes(modulo);
    }

    obtenerInfo() {
        return {
            id: this.id,
            nombre: this.nombre,
            username: this.username,
            email: this.email,
            rol: this.rol,
            activo: this.activo,
            fechaCreacion: this.fechaCreacion
        };
    }
}

// ======================== CLASE CLIENTE ========================
class Cliente {
    constructor(id, nombre, documento, email, telefono, direccion = '') {
        this.id = id;
        this.nombre = nombre;
        this.documento = documento;
        this.email = email;
        this.telefono = telefono;
        this.direccion = direccion;
        this.fechaRegistro = new Date();
        this.visitas = 1;
    }

    incrementarVisita() {
        this.visitas++;
    }

    obtenerInfo() {
        return {
            id: this.id,
            nombre: this.nombre,
            documento: this.documento,
            email: this.email,
            telefono: this.telefono,
            direccion: this.direccion,
            visitas: this.visitas
        };
    }
}

// ======================== CLASE BITACORA / AUDITORIA ========================
class BitacoraAudit {
    static contador = 1;

    constructor(usuario, accion, detalle) {
        this.id = BitacoraAudit.contador++;
        this.fecha = new Date();
        this.usuario = usuario ? (usuario.nombre || usuario.username) : 'Sistema';
        this.rol = usuario ? usuario.rol : 'Sistema';
        this.accion = accion;
        this.detalle = detalle;
    }

    obtenerDetalles() {
        return {
            id: this.id,
            fecha: this.fecha.toLocaleString('es-ES'),
            usuario: this.usuario,
            rol: this.rol,
            accion: this.accion,
            detalle: this.detalle
        };
    }
}

// ======================== CLASE TRABAJADOR ========================
class Trabajador {
    constructor(id, nombre, cargo, email, telefono, turno = 'mañana') {
        this.id = id;
        this.nombre = nombre;
        this.cargo = cargo;
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
        this.preparacion = preparacion;
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

    constructor(mesa, mesero = null, cliente = null) {
        this.id = Pedido.contador++;
        this.mesa = mesa;
        this.mesero = mesero;
        this.cliente = cliente;
        this.items = [];
        this.fecha = new Date();
        this.estado = 'pendiente';
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
            mesa: this.mesa ? this.mesa.numero : 'N/A',
            mesero: this.mesero ? (this.mesero.nombre || this.mesero) : 'Sin asignar',
            cliente: this.cliente ? this.cliente.nombre : 'Consumidor Final',
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
        this.estado = 'libre';
        this.pedido = null;
        this.mesero = null;
        this.cliente = null;
        this.horaOcupacion = null;
    }

    ocupar(mesero, cliente = null) {
        this.estado = 'ocupada';
        this.mesero = mesero;
        this.cliente = cliente;
        this.horaOcupacion = new Date();
    }

    liberar() {
        this.estado = 'libre';
        this.mesero = null;
        this.cliente = null;
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
        return Math.round((ahora - new Date(this.horaOcupacion)) / 60000);
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
            mesero: this.mesero ? (this.mesero.nombre || this.mesero) : 'Sin asignar',
            cliente: this.cliente ? this.cliente.nombre : 'Sin cliente',
            tiempoOcupacion: this.obtenerTiempoOcupacion(),
            tienePedido: this.pedido !== null
        };
    }
}

// ======================== CLASE FACTURA ========================
class Factura {
    static contador = 1000;

    constructor(pedido, cliente = null, propina = 0, descuento = 0, metodoPago = 'efectivo', cajero = 'Sistema') {
        this.id = Factura.contador++;
        this.pedido = pedido;
        this.cliente = cliente || (pedido ? pedido.cliente : null);
        this.fecha = new Date();
        this.subtotal = pedido ? pedido.total : 0;
        this.descuento = parseFloat(descuento);
        this.subtotalConDescuento = Math.max(0, this.subtotal - this.descuento);
        this.impuesto = parseFloat((this.subtotalConDescuento * 0.19).toFixed(2));
        this.propina = parseFloat(propina);
        this.total = parseFloat((this.subtotalConDescuento + this.impuesto + this.propina).toFixed(2));
        this.metodoPago = metodoPago;
        this.cajero = cajero;
    }

    generarFactura() {
        const detalles = this.pedido ? this.pedido.obtenerDetalles() : { mesa: 'N/A', items: [] };
        return {
            numeroFactura: this.id,
            fecha: this.fecha.toLocaleString('es-ES'),
            mesa: detalles.mesa,
            cliente: this.cliente ? this.cliente.nombre : 'Consumidor Final',
            documentoCliente: this.cliente ? (this.cliente.documento || 'N/A') : 'N/A',
            cajero: this.cajero,
            items: detalles.items,
            subtotal: this.subtotal,
            descuento: this.descuento,
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
            const fecha = new Date(pedido.fecha);
            const hora = fecha.getHours() + ':00';
            const cantidad = ventas.get(hora) || 0;
            ventas.set(hora, cantidad + 1);
        });
        return ventas;
    }

    platosPopulares() {
        const contador = {};
        this.pedidos.forEach(pedido => {
            pedido.items.forEach(detalle => {
                const nombre = detalle.menuItem ? detalle.menuItem.nombre : (detalle.item || 'Producto');
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

    constructor(nombre = 'Sabor Gourmet', direccion = 'Calle Principal #45-12', telefono = '555-9000') {
        if (Restaurante.instancia) {
            return Restaurante.instancia;
        }

        this.nombre = nombre;
        this.direccion = direccion;
        this.telefono = telefono;
        this.mesas = [];
        this.menu = [];
        this.trabajadores = [];
        this.usuarios = [];
        this.clientes = [];
        this.pedidos = [];
        this.facturas = [];
        this.auditoria = [];
        this.usuarioActual = null;
        this.reporteActual = new Reporte();

        Restaurante.instancia = this;
    }

    static getInstance() {
        if (!Restaurante.instancia) {
            new Restaurante();
        }
        return Restaurante.instancia;
    }

    registrarLog(accion, detalle) {
        const log = new BitacoraAudit(this.usuarioActual, accion, detalle);
        this.auditoria.unshift(log);
    }

    autenticar(credencial, password) {
        const usuarioEncontrado = this.usuarios.find(u => u.validarCredenciales(credencial, password));
        if (usuarioEncontrado) {
            this.usuarioActual = usuarioEncontrado;
            this.registrarLog('Inicio de Sesión', `El usuario ${usuarioEncontrado.username} ha iniciado sesión`);
            return { exito: true, usuario: usuarioEncontrado };
        }
        return { exito: false, mensaje: 'Credenciales inválidas o usuario inactivo' };
    }

    cerrarSesion() {
        if (this.usuarioActual) {
            this.registrarLog('Cierre de Sesión', `El usuario ${this.usuarioActual.username} ha cerrado sesión`);
        }
        this.usuarioActual = null;
    }

    recuperarPassword(correo) {
        const u = this.usuarios.find(user => user.email.toLowerCase() === correo.toLowerCase());
        if (u) {
            this.registrarLog('Solicitud Contraseña', `Solicitud de recuperación para ${correo}`);
            return { exito: true, contraseñaTemporal: u.password, mensaje: `Instrucciones enviadas a ${correo}. Tu clave actual es: ${u.password}` };
        }
        return { exito: false, mensaje: 'El correo ingresado no se encuentra registrado' };
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

    agregarUsuario(usuario) {
        this.usuarios.push(usuario);
        this.registrarLog('Usuario Creado', `Se creó el usuario ${usuario.username} con rol ${usuario.rol}`);
    }

    agregarCliente(cliente) {
        this.clientes.push(cliente);
        this.registrarLog('Cliente Registrado', `Se registró al cliente ${cliente.nombre} (${cliente.documento})`);
    }

    obtenerMesa(id) {
        return this.mesas.find(m => m.id === id);
    }

    obtenerMenuItems() {
        return this.menu;
    }

    crearPedido(mesa, mesero = null, cliente = null) {
        const meseroAsignado = mesero || (this.usuarioActual ? this.usuarioActual.nombre : 'Mesero General');
        const pedido = new Pedido(mesa, meseroAsignado, cliente);
        this.pedidos.push(pedido);
        this.registrarLog('Pedido Creado', `Pedido #${pedido.id} creado para Mesa ${mesa ? mesa.numero : 'N/A'}`);
        return pedido;
    }

    crearFactura(pedido, cliente = null, propina = 0, descuento = 0, metodoPago = 'efectivo') {
        const cajero = this.usuarioActual ? this.usuarioActual.nombre : 'Cajero General';
        const factura = new Factura(pedido, cliente, propina, descuento, metodoPago, cajero);
        this.facturas.push(factura);
        this.reporteActual.agregarFactura(factura);
        
        if (pedido && pedido.mesa) {
            pedido.mesa.liberar();
        }

        this.registrarLog('Factura Emitida', `Factura #${factura.id} emitida por $${factura.total} - Método: ${metodoPago}`);
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
        this.mesas = [];
        this.menu = [];
        this.trabajadores = [];
        this.usuarios = [];
        this.clientes = [];
        this.pedidos = [];
        this.facturas = [];
        this.auditoria = [];
        this.usuarioActual = null;
        this.reporteActual = new Reporte();
        Pedido.contador = 1;
        Factura.contador = 1000;
        BitacoraAudit.contador = 1;
    }
}

/**
 * APP.JS - Lógica Principal de la Aplicación
 * Coordina la interacción entre las clases y la interfaz
 */

class App {
    constructor() {
        this.restaurante = Restaurante.getInstance();
        this.mesaSeleccionada = null;
        this.pedidoActual = null;
        this.moduloActual = 'mesas';
        
        this.init();
    }

    init() {
        this.cargarDataDelStorage();
        this.renderizarMesas();
        this.renderizarMenu();
        this.renderizarPedidos();
        this.renderizarFacturacion();
        this.actualizarReportes();
    }

    // ======================== GESTIÓN DE MESAS ========================

    generarMesasDemo() {
        // Limpiar datos previos
        this.restaurante.limpiarDatos();

        // Crear mesas
        const mesas = [
            new Mesa(1, 1, 2),
            new Mesa(2, 2, 2),
            new Mesa(3, 3, 4),
            new Mesa(4, 4, 4),
            new Mesa(5, 5, 4),
            new Mesa(6, 6, 6),
            new Mesa(7, 7, 6),
            new Mesa(8, 8, 8),
        ];

        mesas.forEach(mesa => this.restaurante.agregarMesa(mesa));

        // Crear trabajadores
        const trabajadores = [
            new Trabajador(1, 'Juan García', 'mesero', 'juan@saborgourmet.com', '555-1001', 'mañana'),
            new Trabajador(2, 'María López', 'mesero', 'maria@saborgourmet.com', '555-1002', 'tarde'),
            new Trabajador(3, 'Carlos Rodríguez', 'chef', 'carlos@saborgourmet.com', '555-1003', 'mañana'),
        ];

        trabajadores.forEach(t => this.restaurante.agregarTrabajador(t));

        // Crear menú
        const menuItems = [
            new MenuItem(1, 'Ceviche de Camarones', 'Camarones frescos con limón y hierbas', 18.99, 'Entrada', 10),
            new MenuItem(2, 'Tabla de Quesos', 'Selección de quesos variados', 22.50, 'Entrada', 5),
            new MenuItem(3, 'Filete Gourmet', 'Filete premium con salsa de champiñones', 35.99, 'Plato Principal', 25),
            new MenuItem(4, 'Salmón a la Mantequilla', 'Salmón fresco con limón y hierbas', 32.50, 'Plato Principal', 20),
            new MenuItem(5, 'Pasta Carbonara', 'Pasta italiana clásica', 28.99, 'Plato Principal', 15),
            new MenuItem(6, 'Arroz con Mariscos', 'Arroz fresco con camarones y mejillones', 34.99, 'Plato Principal', 25),
            new MenuItem(7, 'Tiramisú', 'Postre italiano tradicional', 12.99, 'Postre', 5),
            new MenuItem(8, 'Flan de Caramelo', 'Postre casero', 10.99, 'Postre', 5),
            new MenuItem(9, 'Agua Mineral', 'Agua mineral con gas o sin gas', 2.50, 'Bebida', 1),
            new MenuItem(10, 'Vino Tinto Reserva', 'Vino tinto de la casa', 45.00, 'Bebida', 1),
        ];

        menuItems.forEach(item => this.restaurante.agregarMenuItemm(item));

        // Crear pedidos y facturas de demostración
        const mesa3 = this.restaurante.obtenerMesa(3);
        const mesa3Pedido = this.restaurante.crearPedido(mesa3);
        mesa3Pedido.agregarItem(menuItems[0], 2); // Ceviche x2
        mesa3Pedido.agregarItem(menuItems[2], 2); // Filete x2
        mesa3Pedido.agregarItem(menuItems[6], 2); // Tiramisú x2
        mesa3Pedido.cambiarEstado('listo');
        mesa3.ocupar(trabajadores[0]);
        mesa3.asignarPedido(mesa3Pedido);

        // Crear factura de ejemplo
        const factura = this.restaurante.crearFactura(mesa3Pedido);
        factura.cambiarMetodoPago('tarjeta');

        this.guardarDataEnStorage();
        this.renderizarMesas();
        this.renderizarMenu();
        this.renderizarPedidos();
        this.actualizarReportes();
        
        alert('✅ Datos de demostración cargados correctamente');
    }

    renderizarMesas() {
        const container = document.getElementById('mesasContainer');
        container.innerHTML = '';

        const mesas = this.restaurante.mesas;

        if (mesas.length === 0) {
            container.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-warning text-center py-5">
                        <i class="fas fa-inbox" style="font-size: 2rem;"></i>
                        <p class="mt-3">No hay mesas cargadas. Haz clic en "Cargar Datos Demo"</p>
                    </div>
                </div>
            `;
            return;
        }

        mesas.forEach(mesa => {
            const info = mesa.obtenerInfo();
            const estadoClase = {
                'libre': 'success',
                'ocupada': 'danger',
                'reservada': 'warning'
            }[mesa.estado];

            const estadoTexto = {
                'libre': 'LIBRE',
                'ocupada': 'OCUPADA',
                'reservada': 'RESERVADA'
            }[mesa.estado];

            const html = `
                <div class="col-lg-3 col-md-4 col-sm-6">
                    <div class="card shadow-sm h-100 cursor-pointer mesa-card" onclick="app.seleccionarMesa(${mesa.id})">
                        <div class="card-body">
                            <div class="text-center mb-3">
                                <i class="fas fa-chair" style="font-size: 3rem; color: #6c757d;"></i>
                            </div>
                            <h5 class="card-title text-center">Mesa ${info.numero}</h5>
                            <div class="mb-3">
                                <span class="badge bg-${estadoClase} w-100">${estadoTexto}</span>
                            </div>
                            <div class="small text-muted">
                                <p class="mb-2">
                                    <i class="fas fa-users me-2"></i>
                                    Capacidad: ${info.capacidad} personas
                                </p>
                                ${info.tienePedido ? `
                                    <p class="mb-2">
                                        <i class="fas fa-receipt me-2"></i>
                                        Pedido #${mesa.pedido.id}
                                    </p>
                                ` : ''}
                                ${info.mesero !== 'Sin asignar' ? `
                                    <p class="mb-2">
                                        <i class="fas fa-user-tie me-2"></i>
                                        ${info.mesero}
                                    </p>
                                ` : ''}
                                ${info.tiempoOcupacion > 0 ? `
                                    <p class="mb-0">
                                        <i class="fas fa-hourglass-half me-2"></i>
                                        ${info.tiempoOcupacion} min
                                    </p>
                                ` : ''}
                            </div>
                        </div>
                        <div class="card-footer bg-light">
                            <div class="btn-group w-100" role="group">
                                <button class="btn btn-sm btn-outline-primary" onclick="event.stopPropagation(); app.ocuparMesa(${mesa.id})">
                                    <i class="fas fa-check"></i>
                                </button>
                                <button class="btn btn-sm btn-outline-danger" onclick="event.stopPropagation(); app.liberarMesa(${mesa.id})">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML += html;
        });
    }

    seleccionarMesa(mesaId) {
        this.mesaSeleccionada = this.restaurante.obtenerMesa(mesaId);
        alert(`Mesa ${this.mesaSeleccionada.numero} seleccionada`);
    }

    ocuparMesa(mesaId) {
        const mesa = this.restaurante.obtenerMesa(mesaId);
        if (mesa.estado !== 'libre') {
            alert('⚠️ La mesa no está disponible');
            return;
        }

        const trabajador = this.restaurante.trabajadores[0] || new Trabajador(1, 'Mesero Automático', 'mesero', 'auto@saborgourmet.com', '000-0000');
        mesa.ocupar(trabajador);
        this.guardarDataEnStorage();
        this.renderizarMesas();
        alert(`✅ Mesa ${mesa.numero} ocupada`);
    }

    liberarMesa(mesaId) {
        const mesa = this.restaurante.obtenerMesa(mesaId);
        mesa.liberar();
        this.guardarDataEnStorage();
        this.renderizarMesas();
        alert(`✅ Mesa ${mesa.numero} liberada`);
    }

    filtrarMesas() {
        const estado = document.getElementById('filterEstado').value;
        const capacidad = document.getElementById('filterCapacidad').value;

        let mesas = this.restaurante.mesas;

        if (estado) {
            mesas = mesas.filter(m => m.estado === estado);
        }

        if (capacidad) {
            mesas = mesas.filter(m => m.capacidad === parseInt(capacidad));
        }

        const container = document.getElementById('mesasContainer');
        container.innerHTML = '';

        if (mesas.length === 0) {
            container.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-info text-center">
                        No hay mesas que coincidan con los filtros
                    </div>
                </div>
            `;
            return;
        }

        mesas.forEach(mesa => {
            const info = mesa.obtenerInfo();
            const estadoClase = {
                'libre': 'success',
                'ocupada': 'danger',
                'reservada': 'warning'
            }[mesa.estado];

            const estadoTexto = {
                'libre': 'LIBRE',
                'ocupada': 'OCUPADA',
                'reservada': 'RESERVADA'
            }[mesa.estado];

            const html = `
                <div class="col-lg-3 col-md-4 col-sm-6">
                    <div class="card shadow-sm h-100">
                        <div class="card-body">
                            <div class="text-center mb-3">
                                <i class="fas fa-chair" style="font-size: 3rem; color: #6c757d;"></i>
                            </div>
                            <h5 class="card-title text-center">Mesa ${info.numero}</h5>
                            <div class="mb-3">
                                <span class="badge bg-${estadoClase} w-100">${estadoTexto}</span>
                            </div>
                            <div class="small text-muted">
                                <p class="mb-2">
                                    <i class="fas fa-users me-2"></i>
                                    Capacidad: ${info.capacidad} personas
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML += html;
        });
    }

    limpiarFiltros() {
        document.getElementById('filterEstado').value = '';
        document.getElementById('filterCapacidad').value = '';
        this.renderizarMesas();
    }

    // ======================== GESTIÓN DE PEDIDOS ========================

    nuevoMenu() {
        const modal = new bootstrap.Modal(document.getElementById('modalNuevoMenu'));
        modal.show();
    }

    agregarMenuItem() {
        const nombre = document.getElementById('menuNombre').value;
        const categoria = document.getElementById('menuCategoria').value;
        const precio = document.getElementById('menuPrecio').value;
        const descripcion = document.getElementById('menuDescripcion').value;

        if (!nombre || !precio) {
            alert('⚠️ Por favor completa todos los campos');
            return;
        }

        const nuevoItem = new MenuItem(
            this.restaurante.menu.length + 1,
            nombre,
            descripcion,
            precio,
            categoria
        );

        this.restaurante.agregarMenuItemm(nuevoItem);
        this.guardarDataEnStorage();
        this.renderizarMenu();

        // Limpiar formulario
        document.getElementById('menuNombre').value = '';
        document.getElementById('menuPrecio').value = '';
        document.getElementById('menuDescripcion').value = '';

        // Cerrar modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('modalNuevoMenu'));
        modal.hide();

        alert('✅ Artículo agregado al menú');
    }

    renderizarMenu() {
        const container = document.getElementById('menuContainer');
        container.innerHTML = '';

        const menuItems = this.restaurante.menu;

        if (menuItems.length === 0) {
            container.innerHTML = `
                <div class="alert alert-info">
                    <i class="fas fa-info-circle me-2"></i>
                    No hay items de menú. Crea uno primero.
                </div>
            `;
            return;
        }

        const categorias = [...new Set(menuItems.map(m => m.categoria))];

        categorias.forEach(categoria => {
            const items = menuItems.filter(m => m.categoria === categoria);
            const html = `
                <div class="mb-4">
                    <h6 class="text-muted text-uppercase mb-3">
                        <strong>${categoria}</strong>
                    </h6>
                    ${items.map(item => `
                        <div class="menu-item mb-3 p-3 border rounded cursor-pointer"
                             onclick="app.agregarAlPedido(${item.id})">
                            <div class="d-flex justify-content-between align-items-start">
                                <div>
                                    <h6 class="mb-1">${item.nombre}</h6>
                                    <small class="text-muted">${item.descripcion}</small>
                                </div>
                                <span class="badge bg-primary">$${item.precio.toFixed(2)}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
            container.innerHTML += html;
        });
    }

    agregarAlPedido(menuItemId) {
        if (!this.pedidoActual) {
            const mesaId = document.getElementById('pedidoMesa').value;
            if (!mesaId) {
                alert('⚠️ Selecciona una mesa primero');
                return;
            }
            const mesa = this.restaurante.obtenerMesa(parseInt(mesaId));
            this.pedidoActual = this.restaurante.crearPedido(mesa);
        }

        const menuItem = this.restaurante.menu.find(m => m.id === menuItemId);
        this.pedidoActual.agregarItem(menuItem);
        this.renderizarPedidoActual();
    }

    renderizarPedidoActual() {
        if (!this.pedidoActual) {
            document.getElementById('pedidoItemsContainer').innerHTML = '';
            document.getElementById('emptyPedidoAlert').style.display = 'block';
            document.getElementById('subtotalPedido').textContent = '$0.00';
            document.getElementById('ivaPedido').textContent = '$0.00';
            document.getElementById('totalPedido').textContent = '$0.00';
            return;
        }

        document.getElementById('emptyPedidoAlert').style.display = this.pedidoActual.items.length === 0 ? 'block' : 'none';

        const container = document.getElementById('pedidoItemsContainer');
        container.innerHTML = '';

        this.pedidoActual.items.forEach((detalle, index) => {
            const html = `
                <div class="pedido-item mb-3 p-3 bg-light border rounded">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <div>
                            <h6 class="mb-0">${detalle.menuItem.nombre}</h6>
                            <small class="text-muted">$${detalle.precioUnitario.toFixed(2)} c/u</small>
                        </div>
                        <button class="btn btn-sm btn-danger" onclick="app.removerDelPedido(${index})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                    <div class="d-flex align-items-center gap-2">
                        <button class="btn btn-sm btn-outline-secondary" onclick="app.decrementarCantidad(${index})">-</button>
                        <input type="number" class="form-control form-control-sm text-center" 
                               value="${detalle.cantidad}" 
                               onchange="app.modificarCantidadPedido(${index}, this.value)"
                               style="max-width: 60px;">
                        <button class="btn btn-sm btn-outline-secondary" onclick="app.incrementarCantidad(${index})">+</button>
                        <span class="ms-auto fw-bold">$${detalle.subtotal.toFixed(2)}</span>
                    </div>
                </div>
            `;
            container.innerHTML += html;
        });

        // Actualizar totales
        const subtotal = this.pedidoActual.total;
        const iva = subtotal * 0.19;
        const total = subtotal + iva;

        document.getElementById('subtotalPedido').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('ivaPedido').textContent = `$${iva.toFixed(2)}`;
        document.getElementById('totalPedido').textContent = `$${total.toFixed(2)}`;
    }

    agregarAlPedido(menuItemId) {
        const mesaId = document.getElementById('pedidoMesa').value;
        if (!mesaId) {
            alert('⚠️ Selecciona una mesa primero');
            return;
        }

        if (!this.pedidoActual) {
            const mesa = this.restaurante.obtenerMesa(parseInt(mesaId));
            this.pedidoActual = this.restaurante.crearPedido(mesa);
        }

        const menuItem = this.restaurante.menu.find(m => m.id === menuItemId);
        if (menuItem) {
            this.pedidoActual.agregarItem(menuItem);
            this.renderizarPedidoActual();
        }
    }

    removerDelPedido(index) {
        if (this.pedidoActual && index >= 0 && index < this.pedidoActual.items.length) {
            const detalle = this.pedidoActual.items[index];
            this.pedidoActual.removerItem(detalle);
            this.renderizarPedidoActual();
        }
    }

    incrementarCantidad(index) {
        if (this.pedidoActual && index >= 0 && index < this.pedidoActual.items.length) {
            const detalle = this.pedidoActual.items[index];
            this.pedidoActual.modificarCantidad(detalle, detalle.cantidad + 1);
            this.renderizarPedidoActual();
        }
    }

    decrementarCantidad(index) {
        if (this.pedidoActual && index >= 0 && index < this.pedidoActual.items.length) {
            const detalle = this.pedidoActual.items[index];
            if (detalle.cantidad > 1) {
                this.pedidoActual.modificarCantidad(detalle, detalle.cantidad - 1);
                this.renderizarPedidoActual();
            }
        }
    }

    modificarCantidadPedido(index, nuevaCantidad) {
        const cantidad = parseInt(nuevaCantidad);
        if (cantidad > 0) {
            this.incrementarCantidad(index);
        }
    }

    guardarPedido() {
        if (!this.pedidoActual || this.pedidoActual.items.length === 0) {
            alert('⚠️ El pedido está vacío');
            return;
        }

        this.pedidoActual.cambiarEstado('preparacion');
        this.guardarDataEnStorage();
        this.renderizarPedidos();
        this.pedidoActual = null;
        this.renderizarPedidoActual();
        alert('✅ Pedido guardado correctamente');
    }

    limpiarPedido() {
        this.pedidoActual = null;
        document.getElementById('pedidoMesa').value = '';
        this.renderizarPedidoActual();
    }

    renderizarPedidos() {
        const tbody = document.getElementById('pedidosTableBody');
        tbody.innerHTML = '';

        const pedidos = this.restaurante.pedidos.filter(p => p.estado !== 'servido');

        if (pedidos.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center text-muted py-4">
                        <i class="fas fa-inbox me-2"></i>No hay pedidos registrados
                    </td>
                </tr>
            `;
            return;
        }

        pedidos.forEach(pedido => {
            const html = `
                <tr>
                    <td>#${pedido.id}</td>
                    <td>Mesa ${pedido.mesa.numero}</td>
                    <td>${pedido.items.length} items</td>
                    <td>
                        <span class="badge bg-${pedido.estado === 'preparacion' ? 'warning' : 'info'}">
                            ${pedido.estado}
                        </span>
                    </td>
                    <td>$${pedido.total.toFixed(2)}</td>
                    <td>
                        <select class="form-select form-select-sm" 
                                onchange="app.cambiarEstadoPedido(${pedido.id}, this.value)">
                            <option value="preparacion" ${pedido.estado === 'preparacion' ? 'selected' : ''}>En Prep.</option>
                            <option value="listo" ${pedido.estado === 'listo' ? 'selected' : ''}>Listo</option>
                            <option value="servido" ${pedido.estado === 'servido' ? 'selected' : ''}>Servido</option>
                        </select>
                    </td>
                </tr>
            `;
            tbody.innerHTML += html;
        });
    }

    cambiarEstadoPedido(pedidoId, nuevoEstado) {
        const pedido = this.restaurante.pedidos.find(p => p.id === pedidoId);
        if (pedido) {
            pedido.cambiarEstado(nuevoEstado);
            this.guardarDataEnStorage();
            this.renderizarPedidos();
        }
    }

    // ======================== GESTIÓN DE FACTURACIÓN ========================

    renderizarFacturacion() {
        const tbody = document.getElementById('pedidosFacturacionTable');
        tbody.innerHTML = '';

        const pedidosParaFacturar = this.restaurante.pedidos.filter(p => p.estado === 'listo' || p.estado === 'servido');

        if (pedidosParaFacturar.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center text-muted py-4">
                        No hay pedidos listos para facturar
                    </td>
                </tr>
            `;
            return;
        }

        pedidosParaFacturar.forEach(pedido => {
            const subtotal = pedido.total;
            const iva = subtotal * 0.19;
            const total = subtotal + iva;

            const html = `
                <tr>
                    <td>#${pedido.id}</td>
                    <td>Mesa ${pedido.mesa.numero}</td>
                    <td>$${subtotal.toFixed(2)}</td>
                    <td>$${iva.toFixed(2)}</td>
                    <td>$${total.toFixed(2)}</td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="app.generarFactura(${pedido.id})">
                            <i class="fas fa-file-pdf me-1"></i>Generar
                        </button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += html;
        });
    }

    generarFactura(pedidoId) {
        const pedido = this.restaurante.pedidos.find(p => p.id === pedidoId);
        if (!pedido) return;

        const factura = this.restaurante.crearFactura(pedido);
        pedido.cambiarEstado('servido');

        this.guardarDataEnStorage();
        this.mostrarPreviewFactura(factura);
        this.renderizarFacturacion();
        this.actualizarReportes();
    }

    mostrarPreviewFactura(factura) {
        const detalles = factura.generarFactura();
        const itemsHtml = detalles.items.map(item => `
            <tr>
                <td>${item.item}</td>
                <td class="text-center">${item.cantidad}</td>
                <td class="text-end">$${item.precioUnitario.toFixed(2)}</td>
                <td class="text-end">$${item.subtotal.toFixed(2)}</td>
            </tr>
        `).join('');

        const html = `
            <div class="factura-container">
                <div class="text-center mb-3">
                    <h4 class="mb-0">FACTURA</h4>
                    <p class="text-muted mb-2">Nº ${detalles.numeroFactura}</p>
                </div>
                <hr>
                <div class="mb-3">
                    <p class="mb-1"><strong>Restaurante:</strong> Sabor Gourmet</p>
                    <p class="mb-1"><strong>Fecha:</strong> ${detalles.fecha}</p>
                    <p class="mb-0"><strong>Mesa:</strong> ${detalles.mesa}</p>
                </div>
                <hr>
                <div class="mb-3">
                    <table class="table table-sm">
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th class="text-center">Cant.</th>
                                <th class="text-end">Precio</th>
                                <th class="text-end">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemsHtml}
                        </tbody>
                    </table>
                </div>
                <hr>
                <div class="mb-3">
                    <div class="row mb-2">
                        <div class="col-6">Subtotal:</div>
                        <div class="col-6 text-end">$${detalles.subtotal.toFixed(2)}</div>
                    </div>
                    <div class="row mb-2">
                        <div class="col-6">IVA (19%):</div>
                        <div class="col-6 text-end">$${detalles.iva.toFixed(2)}</div>
                    </div>
                    <div class="row fw-bold">
                        <div class="col-6">TOTAL:</div>
                        <div class="col-6 text-end">$${detalles.total.toFixed(2)}</div>
                    </div>
                </div>
                <hr>
                <p class="text-center text-muted small">Método de pago: ${detalles.metodoPago}</p>
                <p class="text-center text-muted small">¡Gracias por su compra!</p>
            </div>
        `;

        document.getElementById('facturaPreview').innerHTML = html;
    }

    // ======================== REPORTES ========================

    actualizarReportes() {
        const stats = this.restaurante.obtenerEstadisticas();
        const reporte = this.restaurante.generarReporte();

        // Actualizar cards
        document.getElementById('totalVentas').textContent = `$${stats.totalVentas.toFixed(2)}`;
        document.getElementById('totalPedidos').textContent = stats.totalPedidos;
        document.getElementById('mesasOcupadas').textContent = stats.mesasOcupadas;
        document.getElementById('platosVendidos').textContent = reporte.platosVendidos();

        // Platos populares
        const populares = reporte.platosPopulares();
        const popularesContainer = document.getElementById('platosPopularesContainer');
        if (populares.length > 0) {
            const html = populares.map((plato, index) => `
                <div class="mb-2">
                    <div class="d-flex justify-content-between align-items-center">
                        <span>${index + 1}. ${plato.nombre}</span>
                        <span class="badge bg-info">${plato.cantidad}</span>
                    </div>
                </div>
            `).join('');
            popularesContainer.innerHTML = html;
        }

        // Horas pico
        const horasPico = reporte.ventasPorHora();
        const horasContainer = document.getElementById('horasPicoContainer');
        if (horasPico.size > 0) {
            const html = Array.from(horasPico.entries())
                .sort((a, b) => b[1] - a[1])
                .map(([hora, cantidad]) => `
                    <div class="mb-2">
                        <div class="d-flex justify-content-between align-items-center">
                            <span>${hora}</span>
                            <span class="badge bg-warning">${cantidad} pedidos</span>
                        </div>
                    </div>
                `).join('');
            horasContainer.innerHTML = html;
        }
    }

    // ======================== GESTIÓN DE MÓDULOS ========================

    showModule(modulo) {
        // Ocultar todos los módulos
        document.querySelectorAll('[id^="modulo-"]').forEach(el => {
            el.classList.remove('modulo-active');
            el.classList.add('modulo-hidden');
        });

        // Mostrar módulo seleccionado
        const moduloElement = document.getElementById(`modulo-${modulo}`);
        if (moduloElement) {
            moduloElement.classList.remove('modulo-hidden');
            moduloElement.classList.add('modulo-active');
        }

        // Actualizar nav activo
        document.querySelectorAll('.btn-link-nav').forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');

        this.moduloActual = modulo;

        // Actualizar datos según el módulo
        if (modulo === 'facturacion') {
            this.renderizarFacturacion();
        } else if (modulo === 'reportes') {
            this.actualizarReportes();
        }
    }

    // ======================== ALMACENAMIENTO LOCAL ========================

    guardarDataEnStorage() {
        const data = {
            mesas: this.restaurante.mesas.map(m => ({
                id: m.id,
                numero: m.numero,
                capacidad: m.capacidad,
                estado: m.estado
            })),
            menu: this.restaurante.menu.map(m => ({
                id: m.id,
                nombre: m.nombre,
                descripcion: m.descripcion,
                precio: m.precio,
                categoria: m.categoria,
                disponible: m.disponible,
                preparacion: m.preparacion
            })),
            pedidos: this.restaurante.pedidos.map(p => ({
                id: p.id,
                mesaId: p.mesa.id,
                items: p.items.map(d => ({
                    menuItemId: d.menuItem.id,
                    cantidad: d.cantidad
                })),
                estado: p.estado,
                total: p.total
            })),
            facturas: this.restaurante.facturas.map(f => ({
                id: f.id,
                pedidoId: f.pedido.id,
                total: f.total,
                metodoPago: f.metodoPago
            }))
        };

        localStorage.setItem('saborgourmet_data', JSON.stringify(data));
    }

    cargarDataDelStorage() {
        const data = localStorage.getItem('saborgourmet_data');
        if (!data) return;

        try {
            const parsed = JSON.parse(data);

            // Cargar mesas
            parsed.mesas.forEach(m => {
                const mesa = new Mesa(m.id, m.numero, m.capacidad);
                mesa.estado = m.estado;
                this.restaurante.agregarMesa(mesa);
            });

            // Cargar menú
            parsed.menu.forEach(m => {
                const item = new MenuItem(m.id, m.nombre, m.descripcion, m.precio, m.categoria, m.preparacion);
                item.disponible = m.disponible;
                this.restaurante.agregarMenuItemm(item);
            });

            // Cargar pedidos
            parsed.pedidos.forEach(p => {
                const mesa = this.restaurante.obtenerMesa(p.mesaId);
                if (mesa) {
                    const pedido = new Pedido(mesa);
                    pedido.id = p.id;
                    p.items.forEach(item => {
                        const menuItem = this.restaurante.menu.find(m => m.id === item.menuItemId);
                        if (menuItem) {
                            pedido.agregarItem(menuItem, item.cantidad);
                        }
                    });
                    pedido.estado = p.estado;
                    this.restaurante.pedidos.push(pedido);
                }
            });

        } catch (e) {
            console.error('Error cargando datos del localStorage:', e);
        }
    }
}

// Instancia global de la aplicación
const app = new App();

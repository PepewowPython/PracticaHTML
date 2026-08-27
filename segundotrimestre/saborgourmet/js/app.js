/**
 * APP.JS - Lógica Principal de la Aplicación
 * Coordina la interacción entre las clases POO y la interfaz de usuario
 */

class App {
    constructor() {
        this.restaurante = Restaurante.getInstance();
        this.mesaSeleccionada = null;
        this.pedidoActual = null;
        this.moduloActual = 'dashboard';
        this.recordarSesion = false;
        
        this.init();
    }

    init() {
        this.cargarDataDelStorage();
        if (this.restaurante.usuarios.length === 0) {
            this.cargarDatosDemostracionCompletos(false);
        }

        this.verificarSesion();
        this.renderizarTodo();
    }

    renderizarTodo() {
        this.aplicarPermisosRol();
        this.renderizarDashboard();
        this.renderizarMesas();
        this.renderizarMenu();
        this.renderizarMesasDropdown();
        this.renderizarClientesDropdown();
        this.renderizarPedidos();
        this.renderizarCocina();
        this.renderizarFacturacion();
        this.renderizarClientes();
        this.renderizarUsuarios();
        this.actualizarReportes();
        this.renderizarHistorial();
    }

    // ======================== SISTEMA DE ALMACENAMIENTO Y DEMO ========================

    guardarDataEnStorage() {
        try {
            const data = {
                mesas: this.restaurante.mesas.map(m => m.obtenerInfo()),
                menu: this.restaurante.menu,
                usuarios: this.restaurante.usuarios,
                clientes: this.restaurante.clientes.map(c => c.obtenerInfo()),
                pedidos: this.restaurante.pedidos.map(p => p.obtenerDetalles()),
                facturas: this.restaurante.facturas.map(f => f.obtenerDetalles()),
                auditoria: this.restaurante.auditoria.map(a => a.obtenerDetalles()),
                usuarioActual: this.recordarSesion && this.restaurante.usuarioActual ? this.restaurante.usuarioActual.username : null
            };
            localStorage.setItem('saborGourmetData', JSON.stringify(data));
        } catch (e) {
            console.error('Error al guardar datos:', e);
        }
    }

    cargarDataDelStorage() {
        const raw = localStorage.getItem('saborGourmetData');
        if (!raw) return;
        try {
            const data = JSON.parse(raw);
            this.restaurante.limpiarDatos();

            // Reconstruir usuarios
            if (data.usuarios && data.usuarios.length > 0) {
                data.usuarios.forEach(u => {
                    const userObj = new Usuario(u.id, u.nombre, u.username, u.email, u.password, u.rol);
                    userObj.activo = u.activo;
                    this.restaurante.usuarios.push(userObj);
                });
            }

            // Reconstruir clientes
            if (data.clientes && data.clientes.length > 0) {
                data.clientes.forEach(c => {
                    const cliObj = new Cliente(c.id, c.nombre, c.documento, c.email, c.telefono, c.direccion);
                    cliObj.visitas = c.visitas || 1;
                    this.restaurante.clientes.push(cliObj);
                });
            }

            // Reconstruir menú
            if (data.menu && data.menu.length > 0) {
                data.menu.forEach(m => {
                    const item = new MenuItem(m.id, m.nombre, m.descripcion, m.precio, m.categoria, m.preparacion);
                    item.disponible = m.disponible;
                    this.restaurante.menu.push(item);
                });
            }

            // Reconstruir mesas
            if (data.mesas && data.mesas.length > 0) {
                data.mesas.forEach(m => {
                    const mesa = new Mesa(m.id, m.numero, m.capacidad);
                    mesa.estado = m.estado;
                    this.restaurante.mesas.push(mesa);
                });
            }
        } catch (e) {
            console.error('Error al recuperar datos:', e);
        }
    }

    cargarDatosDemostracionCompletos(notificar = true) {
        this.restaurante.limpiarDatos();

        // 1. Usuarios demo
        const usuariosDemo = [
            new Usuario(1, 'Administrador Principal', 'admin', 'admin@saborgourmet.com', 'admin123', 'admin'),
            new Usuario(2, 'Juan Pérez (Mesero)', 'mesero', 'mesero@saborgourmet.com', 'mesero123', 'mesero'),
            new Usuario(3, 'Carlos Rodríguez (Chef)', 'chef', 'chef@saborgourmet.com', 'chef123', 'chef'),
            new Usuario(4, 'María López (Cajera)', 'cajero', 'cajero@saborgourmet.com', 'cajero123', 'cajero')
        ];
        usuariosDemo.forEach(u => this.restaurante.usuarios.push(u));

        // 2. Clientes demo
        const clientesDemo = [
            new Cliente(1, 'Ana Martínez', '1098765432', 'ana@email.com', '300-1112233'),
            new Cliente(2, 'Roberto Gómez', '80123456', 'roberto@email.com', '315-4445566'),
            new Cliente(3, 'Laura Sánchez', '52987123', 'laura@email.com', '310-7778899')
        ];
        clientesDemo.forEach(c => this.restaurante.clientes.push(c));

        // 3. Menú demo
        const menuItems = [
            new MenuItem(1, 'Ceviche de Camarones', 'Camarones frescos marinados con lima y cilantro', 18.50, 'Entrada', 10),
            new MenuItem(2, 'Empanadas de Carne', 'Trío de empanadas crujientes de res', 12.00, 'Entrada', 8),
            new MenuItem(3, 'Filete Gourmet Mignon', 'Corte premium 300g con reducción de vino tinto', 36.00, 'Plato Principal', 25),
            new MenuItem(4, 'Salmón a la Mantequilla', 'Salmón noruego con vegetales salteados', 32.50, 'Plato Principal', 20),
            new MenuItem(5, 'Pasta Carbonara Italiana', 'Pasta fresca con panceta y queso parmesano', 26.00, 'Plato Principal', 15),
            new MenuItem(6, 'Tiramisú Artesanal', 'Postre clásico con café espresso y mascarpone', 11.00, 'Postre', 5),
            new MenuItem(7, 'Volcán de Chocolate', 'Bizcocho tibio con centro derretido y helado', 12.50, 'Postre', 10),
            new MenuItem(8, 'Vino Tinto Reserva', 'Copa de vino de la casa 150ml', 14.00, 'Bebida', 2),
            new MenuItem(9, 'Limonada de Coco', 'Bebida refrescante natural', 6.50, 'Bebida', 5)
        ];
        menuItems.forEach(item => this.restaurante.agregarMenuItemm(item));

        // 4. Mesas demo
        for (let i = 1; i <= 8; i++) {
            const cap = i <= 2 ? 2 : (i <= 5 ? 4 : (i <= 7 ? 6 : 8));
            this.restaurante.agregarMesa(new Mesa(i, i, cap));
        }

        // 5. Simular Pedidos iniciales
        const mesa1 = this.restaurante.obtenerMesa(1);
        mesa1.ocupar(usuariosDemo[1], clientesDemo[0]);
        const p1 = this.restaurante.crearPedido(mesa1, usuariosDemo[1], clientesDemo[0]);
        p1.agregarItem(menuItems[0], 1); // Ceviche
        p1.agregarItem(menuItems[3], 1); // Salmón
        p1.agregarItem(menuItems[8], 2); // Limonadas
        p1.cambiarEstado('preparacion');
        mesa1.asignarPedido(p1);

        const mesa3 = this.restaurante.obtenerMesa(3);
        mesa3.ocupar(usuariosDemo[1], clientesDemo[1]);
        const p2 = this.restaurante.crearPedido(mesa3, usuariosDemo[1], clientesDemo[1]);
        p2.agregarItem(menuItems[2], 2); // Filetes
        p2.agregarItem(menuItems[7], 2); // Vinos
        p2.cambiarEstado('listo');
        mesa3.asignarPedido(p2);

        this.restaurante.registrarLog('Sistema', 'Datos de demostración inicializados correctamente');
        this.guardarDataEnStorage();

        if (notificar) {
            alert('✅ Datos de demostración cargados exitosamente.');
        }

        this.renderizarTodo();
    }

    // ======================== AUTENTICACIÓN Y SESIÓN ========================

    cargarCredencialesDemo(username, password) {
        document.getElementById('loginUsuario').value = username;
        document.getElementById('loginPassword').value = password;
        this.ejecutarLogin();
    }

    ejecutarLogin() {
        const cred = document.getElementById('loginUsuario').value.trim();
        const pass = document.getElementById('loginPassword').value.trim();
        const errAlert = document.getElementById('loginErrorAlert');
        this.recordarSesion = document.getElementById('rememberMe').checked;

        const res = this.restaurante.autenticar(cred, pass);
        if (res.exito) {
            errAlert.classList.add('d-none');
            document.getElementById('loginOverlay').style.display = 'none';
            this.guardarDataEnStorage();
            this.verificarSesion();
            this.renderizarTodo();
            this.showModule(res.usuario.obtenerPermisos()[0] || 'dashboard');
        } else {
            errAlert.classList.remove('d-none');
            document.getElementById('loginErrorText').textContent = res.mensaje;
        }
    }

    ejecutarLogout() {
        if (confirm('¿Deseas cerrar sesión en el sistema Sabor Gourmet?')) {
            this.restaurante.cerrarSesion();
            this.recordarSesion = false;
            this.guardarDataEnStorage();
            this.verificarSesion();
        }
    }

    verificarSesion() {
        const overlay = document.getElementById('loginOverlay');
        if (!this.restaurante.usuarioActual) {
            // Intentar recuperar el último usuario
            const raw = localStorage.getItem('saborGourmetData');
            if (raw) {
                const data = JSON.parse(raw);
                if (data.usuarioActual) {
                    const u = this.restaurante.usuarios.find(user => user.username === data.usuarioActual);
                    if (u) this.restaurante.usuarioActual = u;
                }
            }
        }

        if (this.restaurante.usuarioActual) {
            overlay.style.display = 'none';
            document.getElementById('userDisplayName').textContent = this.restaurante.usuarioActual.nombre;
            document.getElementById('userDisplayRole').textContent = this.restaurante.usuarioActual.rol.toUpperCase();
        } else {
            overlay.style.display = 'flex';
        }
    }

    abrirModalRecuperar() {
        const modal = new bootstrap.Modal(document.getElementById('modalRecuperar'));
        modal.show();
    }

    ejecutarRecuperarPassword() {
        const correo = document.getElementById('recuperarCorreo').value.trim();
        if (!correo) {
            alert('⚠️ Ingresa tu correo electrónico');
            return;
        }
        const res = this.restaurante.recuperarPassword(correo);
        alert(res.mensaje);
        if (res.exito) {
            const modalEl = document.getElementById('modalRecuperar');
            const modal = bootstrap.Modal.getInstance(modalEl);
            if (modal) modal.hide();
        }
    }

    aplicarPermisosRol() {
        if (!this.restaurante.usuarioActual) return;
        const permisos = this.restaurante.usuarioActual.obtenerPermisos();

        const modItems = document.querySelectorAll('#navModulesList .nav-mod');
        modItems.forEach(item => {
            const mod = item.getAttribute('data-modulo');
            if (permisos.includes(mod)) {
                item.classList.remove('d-none');
            } else {
                item.classList.add('d-none');
            }
        });
    }

    // ======================== NAVEGACIÓN DE MÓDULOS ========================

    showModule(nombreModulo) {
        if (this.restaurante.usuarioActual && !this.restaurante.usuarioActual.tienePermiso(nombreModulo)) {
            alert(`⚠️ Tu rol (${this.restaurante.usuarioActual.rol}) no posee permisos para acceder al módulo: ${nombreModulo}`);
            return;
        }

        this.moduloActual = nombreModulo;

        // Ocultar todos los módulos
        const modulos = document.querySelectorAll('[id^="modulo-"]');
        modulos.forEach(m => {
            m.classList.remove('modulo-active');
            m.classList.add('modulo-hidden');
        });

        // Mostrar módulo seleccionado
        const target = document.getElementById(`modulo-${nombreModulo}`);
        if (target) {
            target.classList.remove('modulo-hidden');
            target.classList.add('modulo-active');
        }

        // Actualizar nav links
        const navBtns = document.querySelectorAll('.btn-link-nav');
        navBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(nombreModulo)) {
                btn.classList.add('active');
            }
        });

        // Re-renderizar si es necesario
        if (nombreModulo === 'dashboard') this.renderizarDashboard();
        if (nombreModulo === 'cocina') this.renderizarCocina();
        if (nombreModulo === 'historial') this.renderizarHistorial();
        if (nombreModulo === 'usuarios') this.renderizarUsuarios();
        if (nombreModulo === 'clientes') this.renderizarClientes();
    }

    // ======================== MÓDULO: DASHBOARD ========================

    renderizarDashboard() {
        const stats = this.restaurante.obtenerEstadisticas();
        document.getElementById('dashTotalVentas').textContent = `$${stats.totalVentas.toFixed(2)}`;
        document.getElementById('dashMesasOcupadas').textContent = `${stats.mesasOcupadas} / ${stats.totalMesas}`;
        document.getElementById('dashPedidosActivos').textContent = this.restaurante.pedidos.filter(p => p.estado !== 'servido').length;
        document.getElementById('dashTotalClientes').textContent = this.restaurante.clientes.length;

        // Tabla de pedidos recientes
        const tbody = document.getElementById('dashPedidosTable');
        tbody.innerHTML = '';

        const pedidosRecientes = [...this.restaurante.pedidos].reverse().slice(0, 5);
        if (pedidosRecientes.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-3">No hay pedidos registrados</td></tr>`;
            return;
        }

        pedidosRecientes.forEach(p => {
            const badgeClass = {
                'pendiente': 'bg-warning text-dark',
                'preparacion': 'bg-info text-white',
                'listo': 'bg-success text-white',
                'servido': 'bg-secondary text-white'
            }[p.estado] || 'bg-light text-dark';

            tbody.innerHTML += `
                <tr>
                    <td><strong>#${p.id}</strong></td>
                    <td>Mesa ${p.mesa ? p.mesa.numero : 'N/A'}</td>
                    <td>${p.cliente ? p.cliente.nombre : 'Consumidor Final'}</td>
                    <td><span class="badge ${badgeClass}">${p.estado.toUpperCase()}</span></td>
                    <td class="fw-bold">$${(p.total * 1.19).toFixed(2)}</td>
                    <td>
                        <button class="btn btn-xs btn-outline-primary" onclick="app.showModule('pedidos')">Ver Detalle</button>
                    </td>
                </tr>
            `;
        });
    }

    // ======================== MÓDULO: MESAS ========================

    renderizarMesas() {
        const container = document.getElementById('mesasContainer');
        container.innerHTML = '';

        const mesas = this.restaurante.mesas;
        if (mesas.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center py-5 text-muted">
                    <i class="fas fa-inbox fa-3x mb-3"></i>
                    <p>No hay mesas registradas. Haz clic en "Cargar Datos Demo".</p>
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

            container.innerHTML += `
                <div class="col-lg-3 col-md-4 col-sm-6">
                    <div class="card shadow-sm h-100 mesa-card" onclick="app.seleccionarMesa(${mesa.id})">
                        <div class="card-body text-center">
                            <div class="mb-2">
                                <i class="fas fa-chair fa-3x ${mesa.estado === 'ocupada' ? 'text-danger' : 'text-success'}"></i>
                            </div>
                            <h5 class="card-title fw-bold">Mesa ${info.numero}</h5>
                            <span class="badge bg-${estadoClase} w-100 mb-3 py-2">${info.estado.toUpperCase()}</span>
                            <div class="text-start small text-muted">
                                <p class="mb-1"><i class="fas fa-users me-2"></i>Capacidad: ${info.capacidad} personas</p>
                                <p class="mb-1"><i class="fas fa-user-tie me-2"></i>Mesero: ${info.mesero}</p>
                                ${info.tienePedido ? `<p class="mb-1 text-primary fw-semibold"><i class="fas fa-receipt me-2"></i>Pedido #${mesa.pedido.id}</p>` : ''}
                            </div>
                        </div>
                        <div class="card-footer bg-white border-top-0 d-flex gap-2">
                            <button class="btn btn-sm btn-outline-success w-100" onclick="event.stopPropagation(); app.ocuparMesa(${mesa.id})">
                                <i class="fas fa-sign-in-alt me-1"></i>Ocupar
                            </button>
                            <button class="btn btn-sm btn-outline-danger w-100" onclick="event.stopPropagation(); app.liberarMesa(${mesa.id})">
                                <i class="fas fa-sign-out-alt me-1"></i>Liberar
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
    }

    seleccionarMesa(mesaId) {
        this.mesaSeleccionada = this.restaurante.obtenerMesa(mesaId);
        this.showModule('pedidos');
        setTimeout(() => {
            const drop = document.getElementById('pedidoMesa');
            if (drop) drop.value = mesaId;
        }, 150);
    }

    ocuparMesa(mesaId) {
        const mesa = this.restaurante.obtenerMesa(mesaId);
        if (mesa.estado !== 'libre') {
            alert('⚠️ La mesa seleccionada ya está ocupada o reservada.');
            return;
        }
        mesa.ocupar(this.restaurante.usuarioActual || 'Mesero General');
        this.restaurante.registrarLog('Mesa Ocupada', `Mesa ${mesa.numero} ha sido ocupada`);
        this.guardarDataEnStorage();
        this.renderizarMesas();
        this.renderizarMesasDropdown();
    }

    liberarMesa(mesaId) {
        const mesa = this.restaurante.obtenerMesa(mesaId);
        mesa.liberar();
        this.restaurante.registrarLog('Mesa Liberada', `Mesa ${mesa.numero} ha sido liberada`);
        this.guardarDataEnStorage();
        this.renderizarMesas();
        this.renderizarMesasDropdown();
    }

    filtrarMesas() {
        const est = document.getElementById('filterEstado').value;
        const cap = document.getElementById('filterCapacidad').value;

        let mesas = this.restaurante.mesas;
        if (est) mesas = mesas.filter(m => m.estado === est);
        if (cap) mesas = mesas.filter(m => m.capacidad === parseInt(cap));

        const container = document.getElementById('mesasContainer');
        container.innerHTML = '';

        if (mesas.length === 0) {
            container.innerHTML = `<div class="col-12 text-center text-muted py-4">No hay mesas con ese criterio.</div>`;
            return;
        }

        mesas.forEach(mesa => {
            const info = mesa.obtenerInfo();
            container.innerHTML += `
                <div class="col-lg-3 col-md-4 col-sm-6">
                    <div class="card shadow-sm h-100 mesa-card" onclick="app.seleccionarMesa(${mesa.id})">
                        <div class="card-body text-center">
                            <i class="fas fa-chair fa-3x text-secondary mb-2"></i>
                            <h5>Mesa ${info.numero}</h5>
                            <span class="badge bg-secondary mb-2">${info.estado.toUpperCase()}</span>
                            <p class="small text-muted mb-0">Capacidad: ${info.capacidad}</p>
                        </div>
                    </div>
                </div>
            `;
        });
    }

    limpiarFiltros() {
        document.getElementById('filterEstado').value = '';
        document.getElementById('filterCapacidad').value = '';
        this.renderizarMesas();
    }

    // ======================== MÓDULO: PEDIDOS Y MENÚ ========================

    renderizarMenu() {
        const container = document.getElementById('menuContainer');
        container.innerHTML = '';

        const items = this.restaurante.menu;
        if (items.length === 0) {
            container.innerHTML = `<div class="text-muted text-center py-3">No hay productos en el menú.</div>`;
            return;
        }

        const categorias = [...new Set(items.map(i => i.categoria))];
        categorias.forEach(cat => {
            const prods = items.filter(i => i.categoria === cat);
            container.innerHTML += `
                <div class="mb-3">
                    <h6 class="fw-bold text-uppercase text-secondary border-bottom pb-1">${cat}</h6>
                    ${prods.map(p => `
                        <div class="menu-item p-2 mb-2 border rounded cursor-pointer d-flex justify-content-between align-items-center" onclick="app.agregarAlPedido(${p.id})">
                            <div>
                                <div class="fw-semibold">${p.nombre}</div>
                                <small class="text-muted">${p.descripcion}</small>
                            </div>
                            <span class="badge bg-primary fs-6">$${p.precio.toFixed(2)}</span>
                        </div>
                    `).join('')}
                </div>
            `;
        });
    }

    renderizarMesasDropdown() {
        const drop = document.getElementById('pedidoMesa');
        if (!drop) return;
        drop.innerHTML = `<option value="">Selecciona una mesa</option>`;
        this.restaurante.mesas.forEach(m => {
            drop.innerHTML += `<option value="${m.id}">Mesa ${m.numero} (${m.capacidad}p - ${m.estado.toUpperCase()})</option>`;
        });
    }

    renderizarClientesDropdown() {
        const drop = document.getElementById('pedidoCliente');
        if (!drop) return;
        drop.innerHTML = `<option value="">Consumidor Final</option>`;
        this.restaurante.clientes.forEach(c => {
            drop.innerHTML += `<option value="${c.id}">${c.nombre} (${c.documento})</option>`;
        });
    }

    agregarAlPedido(menuItemId) {
        const mesaId = document.getElementById('pedidoMesa').value;
        if (!mesaId) {
            alert('⚠️ Por favor selecciona primero la mesa en el formulario del pedido.');
            return;
        }

        if (!this.pedidoActual) {
            const mesa = this.restaurante.obtenerMesa(parseInt(mesaId));
            const cliId = document.getElementById('pedidoCliente').value;
            const cliente = cliId ? this.restaurante.clientes.find(c => c.id === parseInt(cliId)) : null;
            this.pedidoActual = this.restaurante.crearPedido(mesa, this.restaurante.usuarioActual, cliente);
        }

        const menuItem = this.restaurante.menu.find(m => m.id === menuItemId);
        if (menuItem) {
            this.pedidoActual.agregarItem(menuItem, 1);
            this.renderizarPedidoActual();
        }
    }

    removerDelPedido(index) {
        if (this.pedidoActual && this.pedidoActual.items[index]) {
            this.pedidoActual.removerItem(this.pedidoActual.items[index]);
            this.renderizarPedidoActual();
        }
    }

    renderizarPedidoActual() {
        const container = document.getElementById('pedidoItemsContainer');
        const alertEmpty = document.getElementById('emptyPedidoAlert');

        if (!this.pedidoActual || this.pedidoActual.items.length === 0) {
            container.innerHTML = '';
            alertEmpty.style.display = 'block';
            document.getElementById('subtotalPedido').textContent = '$0.00';
            document.getElementById('ivaPedido').textContent = '$0.00';
            document.getElementById('totalPedido').textContent = '$0.00';
            return;
        }

        alertEmpty.style.display = 'none';
        container.innerHTML = '';

        this.pedidoActual.items.forEach((det, idx) => {
            container.innerHTML += `
                <div class="d-flex justify-content-between align-items-center bg-light p-2 mb-2 rounded border">
                    <div>
                        <div class="fw-semibold">${det.menuItem.nombre}</div>
                        <small class="text-muted">$${det.precioUnitario.toFixed(2)} x ${det.cantidad}</small>
                    </div>
                    <div class="d-flex align-items-center gap-2">
                        <span class="fw-bold me-2">$${det.subtotal.toFixed(2)}</span>
                        <button class="btn btn-xs btn-outline-danger" onclick="app.removerDelPedido(${idx})"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            `;
        });

        const sub = this.pedidoActual.total;
        const iva = sub * 0.19;
        const tot = sub + iva;

        document.getElementById('subtotalPedido').textContent = `$${sub.toFixed(2)}`;
        document.getElementById('ivaPedido').textContent = `$${iva.toFixed(2)}`;
        document.getElementById('totalPedido').textContent = `$${tot.toFixed(2)}`;
    }

    guardarPedido() {
        if (!this.pedidoActual || this.pedidoActual.items.length === 0) {
            alert('⚠️ Agrega platillos al pedido antes de guardarlo.');
            return;
        }

        const mesa = this.pedidoActual.mesa;
        if (mesa) {
            mesa.ocupar(this.restaurante.usuarioActual, this.pedidoActual.cliente);
            mesa.asignarPedido(this.pedidoActual);
        }

        this.pedidoActual.cambiarEstado('preparacion');
        this.guardarDataEnStorage();

        alert(`✅ Pedido #${this.pedidoActual.id} enviado a cocina correctamente.`);
        this.pedidoActual = null;
        this.renderizarPedidoActual();
        this.renderizarMesas();
        this.renderizarPedidos();
        this.renderizarCocina();
    }

    limpiarPedido() {
        this.pedidoActual = null;
        this.renderizarPedidoActual();
    }

    renderizarPedidos() {
        const tbody = document.getElementById('pedidosTableBody');
        tbody.innerHTML = '';

        const pedidos = this.restaurante.pedidos;
        if (pedidos.length === 0) {
            tbody.innerHTML = `<tr><td colspan="8" class="text-center text-muted py-3">No hay pedidos en sistema</td></tr>`;
            return;
        }

        pedidos.forEach(p => {
            tbody.innerHTML += `
                <tr>
                    <td><strong>#${p.id}</strong></td>
                    <td>Mesa ${p.mesa ? p.mesa.numero : 'N/A'}</td>
                    <td>${p.mesero ? (p.mesero.nombre || p.mesero) : 'Sin Asignar'}</td>
                    <td>${p.cliente ? p.cliente.nombre : 'Consumidor Final'}</td>
                    <td>${p.items.length} ítems</td>
                    <td>
                        <span class="badge bg-${p.estado === 'preparacion' ? 'info' : (p.estado === 'listo' ? 'success' : 'secondary')}">
                            ${p.estado.toUpperCase()}
                        </span>
                    </td>
                    <td class="fw-bold">$${(p.total * 1.19).toFixed(2)}</td>
                    <td>
                        <select class="form-select form-select-sm" onchange="app.cambiarEstadoPedido(${p.id}, this.value)">
                            <option value="pendiente" ${p.estado === 'pendiente' ? 'selected' : ''}>Pendiente</option>
                            <option value="preparacion" ${p.estado === 'preparacion' ? 'selected' : ''}>En Preparación</option>
                            <option value="listo" ${p.estado === 'listo' ? 'selected' : ''}>Listo</option>
                            <option value="servido" ${p.estado === 'servido' ? 'selected' : ''}>Servido / Cobrado</option>
                        </select>
                    </td>
                </tr>
            `;
        });
    }

    cambiarEstadoPedido(pedidoId, nuevoEstado) {
        const p = this.restaurante.pedidos.find(item => item.id === pedidoId);
        if (p) {
            p.cambiarEstado(nuevoEstado);
            this.restaurante.registrarLog('Estado Pedido', `Pedido #${p.id} cambió a ${nuevoEstado}`);
            this.guardarDataEnStorage();
            this.renderizarPedidos();
            this.renderizarCocina();
            this.renderizarFacturacion();
        }
    }

    // ======================== MÓDULO: COCINA (KDS) ========================

    renderizarCocina() {
        const cPendientes = document.getElementById('cocinaPendientesContainer');
        const cPreparacion = document.getElementById('cocinaPreparacionContainer');
        const cListos = document.getElementById('cocinaListosContainer');

        cPendientes.innerHTML = '';
        cPreparacion.innerHTML = '';
        cListos.innerHTML = '';

        const pendientes = this.restaurante.pedidos.filter(p => p.estado === 'pendiente');
        const preparacion = this.restaurante.pedidos.filter(p => p.estado === 'preparacion');
        const listos = this.restaurante.pedidos.filter(p => p.estado === 'listo');

        document.getElementById('countCocinaPendientes').textContent = pendientes.length;
        document.getElementById('countCocinaPreparacion').textContent = preparacion.length;
        document.getElementById('countCocinaListos').textContent = listos.length;

        const crearComandaCard = (p, btnTexto, btnClass, siguienteEstado) => `
            <div class="card mb-3 shadow-sm cocina-card estado-${p.estado}">
                <div class="card-body p-3">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <strong class="h6 mb-0">Comanda #${p.id}</strong>
                        <span class="badge bg-dark">Mesa ${p.mesa ? p.mesa.numero : 'N/A'}</span>
                    </div>
                    <div class="small text-muted mb-2"><i class="fas fa-clock me-1"></i>${new Date(p.fecha).toLocaleTimeString('es-ES', {hour: '2-digit', minute:'2-digit'})}</div>
                    <ul class="list-group list-group-flush mb-3 small">
                        ${p.items.map(item => `<li class="list-group-item px-0 py-1 d-flex justify-content-between"><span>${item.menuItem.nombre}</span><strong>x${item.cantidad}</strong></li>`).join('')}
                    </ul>
                    ${siguienteEstado ? `
                        <button class="btn btn-sm ${btnClass} w-100 fw-semibold" onclick="app.cambiarEstadoCocina(${p.id}, '${siguienteEstado}')">
                            ${btnTexto}
                        </button>
                    ` : '<span class="badge bg-success w-100 py-2"><i class="fas fa-check me-1"></i>Listo para Mesero</span>'}
                </div>
            </div>
        `;

        pendientes.forEach(p => cPendientes.innerHTML += crearComandaCard(p, 'Comenzar Preparación', 'btn-warning text-dark', 'preparacion'));
        preparacion.forEach(p => cPreparacion.innerHTML += crearComandaCard(p, 'Marcar Platillos Listos', 'btn-success', 'listo'));
        listos.forEach(p => cListos.innerHTML += crearComandaCard(p, '', '', null));
    }

    cambiarEstadoCocina(pedidoId, estado) {
        this.cambiarEstadoPedido(pedidoId, estado);
    }

    // ======================== MÓDULO: FACTURACIÓN ========================

    renderizarFacturacion() {
        const tbody = document.getElementById('pedidosFacturacionTable');
        tbody.innerHTML = '';

        const cobrar = this.restaurante.pedidos.filter(p => p.estado === 'listo' || p.estado === 'servido');
        if (cobrar.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted py-4">No hay pedidos listos para facturar</td></tr>`;
            return;
        }

        cobrar.forEach(p => {
            const total = (p.total * 1.19).toFixed(2);
            tbody.innerHTML += `
                <tr>
                    <td><strong>#${p.id}</strong></td>
                    <td>Mesa ${p.mesa ? p.mesa.numero : 'N/A'}</td>
                    <td>${p.cliente ? p.cliente.nombre : 'Consumidor Final'}</td>
                    <td class="fw-bold text-success">$${total}</td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="app.abrirModalPago(${p.id})">
                            <i class="fas fa-cash-register me-1"></i>Cobrar y Facturar
                        </button>
                    </td>
                </tr>
            `;
        });
    }

    abrirModalPago(pedidoId) {
        document.getElementById('pagoPedidoId').value = pedidoId;
        const modal = new bootstrap.Modal(document.getElementById('modalProcesarPago'));
        modal.show();
    }

    confirmarCobroFactura() {
        const pId = parseInt(document.getElementById('pagoPedidoId').value);
        const metodo = document.getElementById('pagoMetodo').value;
        const propina = parseFloat(document.getElementById('pagoPropina').value) || 0;
        const descuento = parseFloat(document.getElementById('pagoDescuento').value) || 0;

        const pedido = this.restaurante.pedidos.find(p => p.id === pId);
        if (!pedido) return;

        const factura = this.restaurante.crearFactura(pedido, pedido.cliente, propina, descuento, metodo);
        pedido.cambiarEstado('servido');

        this.guardarDataEnStorage();
        this.mostrarPreviewFactura(factura);

        const modalEl = document.getElementById('modalProcesarPago');
        const modal = bootstrap.Modal.getInstance(modalEl);
        if (modal) modal.hide();

        alert(`✅ Factura #${factura.id} generada con éxito. Mesa liberada.`);
        this.renderizarFacturacion();
        this.renderizarMesas();
        this.renderizarDashboard();
    }

    mostrarPreviewFactura(factura) {
        const det = factura.generarFactura();
        document.getElementById('facturaPreview').innerHTML = `
            <div class="factura-container shadow-sm">
                <div class="text-center mb-2">
                    <h5 class="fw-bold mb-0">SABOR GOURMET</h5>
                    <small class="text-muted">NIT: 900.123.456-7</small><br>
                    <small class="text-muted">Factura de Venta Nº ${det.numeroFactura}</small>
                </div>
                <hr class="my-2">
                <div class="small">
                    <strong>Fecha:</strong> ${det.fecha}<br>
                    <strong>Mesa:</strong> ${det.mesa} | <strong>Cajero:</strong> ${det.cajero}<br>
                    <strong>Cliente:</strong> ${det.cliente} (${det.documentoCliente})
                </div>
                <hr class="my-2">
                <table class="w-100 small">
                    <thead>
                        <tr class="border-bottom"><th>Item</th><th class="text-center">Cant</th><th class="text-end">Total</th></tr>
                    </thead>
                    <tbody>
                        ${det.items.map(i => `<tr><td>${i.item}</td><td class="text-center">${i.cantidad}</td><td class="text-end">$${i.subtotal.toFixed(2)}</td></tr>`).join('')}
                    </tbody>
                </table>
                <hr class="my-2">
                <div class="small">
                    <div class="d-flex justify-content-between"><span>Subtotal:</span><span>$${det.subtotal.toFixed(2)}</span></div>
                    <div class="d-flex justify-content-between"><span>Descuento:</span><span>-$${det.descuento.toFixed(2)}</span></div>
                    <div class="d-flex justify-content-between"><span>IVA (19%):</span><span>$${det.iva.toFixed(2)}</span></div>
                    <div class="d-flex justify-content-between"><span>Propina:</span><span>$${det.propina.toFixed(2)}</span></div>
                    <div class="d-flex justify-content-between fw-bold h6 mt-1 border-top pt-1"><span>TOTAL PAID:</span><span>$${det.total.toFixed(2)}</span></div>
                </div>
                <hr class="my-2">
                <div class="text-center small text-muted">
                    Método de Pago: <strong>${det.metodoPago.toUpperCase()}</strong><br>
                    ¡Gracias por preferirnos!
                </div>
            </div>
        `;
    }

    // ======================== MÓDULO: CLIENTES ========================

    renderizarClientes() {
        const tbody = document.getElementById('clientesTableBody');
        tbody.innerHTML = '';

        if (this.restaurante.clientes.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted py-3">No hay clientes registrados</td></tr>`;
            return;
        }

        this.restaurante.clientes.forEach(c => {
            tbody.innerHTML += `
                <tr>
                    <td><strong>#${c.id}</strong></td>
                    <td>${c.nombre}</td>
                    <td>${c.documento}</td>
                    <td>${c.email}</td>
                    <td>${c.telefono}</td>
                    <td><span class="badge bg-info text-dark">${c.visitas} Visita(s)</span></td>
                    <td>
                        <button class="btn btn-xs btn-outline-primary" onclick="alert('Cliente ${c.nombre} activo')"><i class="fas fa-edit"></i></button>
                    </td>
                </tr>
            `;
        });
    }

    abrirModalNuevoCliente() {
        const modal = new bootstrap.Modal(document.getElementById('modalNuevoCliente'));
        modal.show();
    }

    guardarNuevoCliente() {
        const nombre = document.getElementById('cliNombre').value.trim();
        const doc = document.getElementById('cliDoc').value.trim();
        const email = document.getElementById('cliEmail').value.trim();
        const tel = document.getElementById('cliTelefono').value.trim();

        if (!nombre || !doc) {
            alert('⚠️ Completa los campos obligatorios del cliente.');
            return;
        }

        const cli = new Cliente(this.restaurante.clientes.length + 1, nombre, doc, email, tel);
        this.restaurante.agregarCliente(cli);
        this.guardarDataEnStorage();
        this.renderizarClientes();
        this.renderizarClientesDropdown();

        const modalEl = document.getElementById('modalNuevoCliente');
        const modal = bootstrap.Modal.getInstance(modalEl);
        if (modal) modal.hide();

        alert(`✅ Cliente ${nombre} registrado exitosamente.`);
    }

    // ======================== MÓDULO: USUARIOS Y ROLES ========================

    renderizarUsuarios() {
        const tbody = document.getElementById('usuariosTableBody');
        tbody.innerHTML = '';

        this.restaurante.usuarios.forEach(u => {
            tbody.innerHTML += `
                <tr>
                    <td><strong>#${u.id}</strong></td>
                    <td>${u.nombre}</td>
                    <td><code>${u.username}</code></td>
                    <td>${u.email}</td>
                    <td><span class="badge bg-warning text-dark badge-role">${u.rol.toUpperCase()}</span></td>
                    <td><span class="badge bg-${u.activo ? 'success' : 'danger'}">${u.activo ? 'ACTIVO' : 'INACTIVO'}</span></td>
                    <td>
                        <button class="btn btn-xs btn-outline-warning" onclick="app.toggleEstadoUsuario(${u.id})">
                            <i class="fas fa-power-off"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
    }

    abrirModalNuevoUsuario() {
        const modal = new bootstrap.Modal(document.getElementById('modalNuevoUsuario'));
        modal.show();
    }

    guardarNuevoUsuario() {
        const nom = document.getElementById('usrNombre').value.trim();
        const user = document.getElementById('usrUsername').value.trim();
        const email = document.getElementById('usrEmail').value.trim();
        const pass = document.getElementById('usrPassword').value.trim();
        const rol = document.getElementById('usrRol').value;

        if (!nom || !user || !pass) {
            alert('⚠️ Por favor completa los campos del usuario.');
            return;
        }

        const u = new Usuario(this.restaurante.usuarios.length + 1, nom, user, email, pass, rol);
        this.restaurante.agregarUsuario(u);
        this.guardarDataEnStorage();
        this.renderizarUsuarios();

        const modalEl = document.getElementById('modalNuevoUsuario');
        const modal = bootstrap.Modal.getInstance(modalEl);
        if (modal) modal.hide();

        alert(`✅ Usuario ${user} (${rol}) registrado correctamente.`);
    }

    toggleEstadoUsuario(id) {
        const u = this.restaurante.usuarios.find(user => user.id === id);
        if (u) {
            u.activo = !u.activo;
            this.guardarDataEnStorage();
            this.renderizarUsuarios();
        }
    }

    // ======================== MÓDULO: REPORTES Y EXPORTACIÓN ========================

    actualizarReportes() {
        const stats = this.restaurante.obtenerEstadisticas();
        const rep = this.restaurante.generarReporte();

        document.getElementById('totalVentas').textContent = `$${stats.totalVentas.toFixed(2)}`;
        document.getElementById('totalPedidos').textContent = stats.totalPedidos;
        document.getElementById('mesasOcupadas').textContent = stats.mesasOcupadas;
        document.getElementById('platosVendidos').textContent = rep.platosVendidos();

        const pop = rep.platosPopulares();
        const popContainer = document.getElementById('platosPopularesContainer');

        if (pop.length === 0) {
            popContainer.innerHTML = `<p class="text-muted">No hay estadísticas de platos aún.</p>`;
        } else {
            popContainer.innerHTML = pop.map((item, idx) => `
                <div class="d-flex justify-content-between align-items-center border-bottom py-2">
                    <span><strong>${idx + 1}.</strong> ${item.nombre}</span>
                    <span class="badge bg-danger rounded-pill">${item.cantidad} pedidos</span>
                </div>
            `).join('');
        }
    }

    exportarCSVReporte() {
        const rep = this.restaurante.generarReporte();
        const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(rep.exportarCSV());
        const link = document.createElement("a");
        link.setAttribute("href", csvContent);
        link.setAttribute("download", `Reporte_Ventas_${new Date().toISOString().slice(0,10)}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    }

    // ======================== MÓDULO: BITÁCORA / HISTORIAL ========================

    renderizarHistorial() {
        const tbody = document.getElementById('auditTableBody');
        tbody.innerHTML = '';

        if (this.restaurante.auditoria.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-3">No hay registros de auditoría</td></tr>`;
            return;
        }

        this.restaurante.auditoria.forEach(a => {
            const details = a.obtenerDetalles();
            tbody.innerHTML += `
                <tr>
                    <td><strong>#${details.id}</strong></td>
                    <td class="small">${details.fecha}</td>
                    <td>${details.usuario}</td>
                    <td><span class="badge bg-secondary badge-role">${details.rol.toUpperCase()}</span></td>
                    <td class="fw-semibold">${details.accion}</td>
                    <td class="small text-muted">${details.detalle}</td>
                </tr>
            `;
        });
    }

    // ======================== MODAL DE NUEVO MENÚ ========================

    nuevoMenu() {
        const modal = new bootstrap.Modal(document.getElementById('modalNuevoMenu'));
        modal.show();
    }

    agregarMenuItem() {
        const nom = document.getElementById('menuNombre').value.trim();
        const cat = document.getElementById('menuCategoria').value;
        const prec = parseFloat(document.getElementById('menuPrecio').value);
        const desc = document.getElementById('menuDescripcion').value.trim();

        if (!nom || isNaN(prec)) {
            alert('⚠️ Ingresa al menos el nombre y precio del platillo.');
            return;
        }

        const item = new MenuItem(this.restaurante.menu.length + 1, nom, desc, prec, cat);
        this.restaurante.agregarMenuItemm(item);
        this.guardarDataEnStorage();
        this.renderizarMenu();

        const modalEl = document.getElementById('modalNuevoMenu');
        const modal = bootstrap.Modal.getInstance(modalEl);
        if (modal) modal.hide();

        alert(`✅ '${nom}' agregado al menú.`);
    }
}

// Inicializar la aplicación globalmente
window.app = new App();

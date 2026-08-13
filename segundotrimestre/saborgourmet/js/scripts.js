/*!
 * Sabor Gourmet - Sistema de Gestión de Restaurante
 * Frontend Scripts & Helpers
 */

window.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Aplicación cargada');
    console.log('Sistema de Gestión Sabor Gourmet inicializado');

    // Agregar estilos dinámicos
    addDynamicStyles();

    // Event listeners para navegación
    setupNavigation();
});

function addDynamicStyles() {
    const style = document.createElement('style');
    style.id = 'dynamic-app-styles';
    style.textContent = `
        .modulo-active {
            display: block !important;
            animation: fadeIn 0.3s ease-in-out;
        }
        
        .modulo-hidden {
            display: none !important;
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(8px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .btn-link-nav {
            color: rgba(255, 255, 255, 0.85);
            background: none;
            border: none;
            cursor: pointer;
            padding: 0.5rem 0.9rem;
            border-radius: 0.375rem;
            font-size: 0.95rem;
            transition: all 0.2s ease;
            display: inline-flex;
            align-items: center;
        }
        
        .btn-link-nav:hover {
            background-color: rgba(255, 255, 255, 0.15);
            color: #ffffff;
        }
        
        .btn-link-nav.active {
            background-color: #0d6efd;
            color: #ffffff;
            font-weight: 600;
            box-shadow: 0 2px 4px rgba(13, 110, 253, 0.3);
        }

        .login-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(15, 23, 42, 0.85);
            backdrop-filter: blur(8px);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .mesa-card {
            transition: transform 0.25s ease, box-shadow 0.25s ease;
            cursor: pointer;
            border: 1px solid rgba(0,0,0,0.08);
        }
        
        .mesa-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 0.5rem 1.25rem rgba(0, 0, 0, 0.12) !important;
        }

        .cocina-card {
            border-left: 4px solid #0d6efd;
            transition: all 0.2s ease;
        }

        .cocina-card.estado-pendiente {
            border-left-color: #ffc107;
        }

        .cocina-card.estado-preparacion {
            border-left-color: #0dcaf0;
        }

        .cocina-card.estado-listo {
            border-left-color: #198754;
        }
        
        .menu-item {
            transition: all 0.2s ease;
        }
        
        .menu-item:hover {
            background-color: #f8f9fa;
            border-color: #0d6efd !important;
            box-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, 0.08);
        }
        
        .factura-container {
            font-family: 'Courier New', Courier, monospace;
            font-size: 0.88rem;
            max-width: 380px;
            margin: 0 auto;
            padding: 1.25rem;
            background-color: #ffffff;
            border: 1px dashed #cbd5e1;
            border-radius: 0.5rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .badge-role {
            text-transform: uppercase;
            font-size: 0.7rem;
            letter-spacing: 0.5px;
            padding: 0.35em 0.65em;
        }
    `;
    document.head.appendChild(style);
}

function setupNavigation() {
    console.log('Navegación inicializada correctamente');
}

// Utilidad para notificaciones toast sencillas
function mostrarNotificacion(mensaje, tipo = 'info') {
    const alertBox = document.createElement('div');
    alertBox.className = `alert alert-${tipo} alert-dismissible fade show position-fixed top-0 end-0 m-3 shadow-lg`;
    alertBox.style.zIndex = '10000';
    alertBox.style.minWidth = '280px';
    alertBox.innerHTML = `
        <i class="fas fa-info-circle me-2"></i> ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(alertBox);
    setTimeout(() => {
        if (alertBox.parentNode) {
            alertBox.classList.remove('show');
            setTimeout(() => alertBox.remove(), 300);
        }
    }, 4000);
}

console.log('🍽️ Sabor Gourmet - Scripts cargados sin errores.');

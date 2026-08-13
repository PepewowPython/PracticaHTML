/*!
* Sabor Gourmet - Sistema de Gestión de Restaurante
* Frontend Scripts
*/

window.addEventListener('DOMContentLoaded', event => {
    console.log('✅ Aplicación cargada');
    console.log('Sistema de Gestión Sabor Gourmet inicializado');

    // Agregar estilos dinámicos
    addDynamicStyles();

    // Event listeners para navegación
    setupNavigation();
});

function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .modulo-active {
            display: block;
            animation: fadeIn 0.3s ease-in;
        }
        
        .modulo-hidden {
            display: none;
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .btn-link-nav {
            color: #fff;
            background: none;
            border: none;
            cursor: pointer;
            padding: 0.5rem 1rem;
            border-radius: 0.25rem;
            transition: all 0.3s ease;
        }
        
        .btn-link-nav:hover {
            background-color: rgba(255, 255, 255, 0.1);
            color: #fff;
        }
        
        .btn-link-nav.active {
            background-color: #0d6efd;
            color: #fff;
            font-weight: 600;
        }
        
        .mesa-card {
            transition: all 0.3s ease;
            cursor: pointer;
        }
        
        .mesa-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.15) !important;
        }
        
        .menu-item {
            transition: all 0.2s ease;
        }
        
        .menu-item:hover {
            background-color: #f0f0f0;
            cursor: pointer;
            box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
        }
        
        .pedido-item {
            transition: all 0.2s ease;
        }
        
        .factura-container {
            font-family: 'Courier New', monospace;
            font-size: 0.9rem;
            max-width: 400px;
            margin: 0 auto;
            padding: 1rem;
            background-color: #fff;
            border: 1px solid #ddd;
            border-radius: 0.25rem;
        }
    `;
    document.head.appendChild(style);
}

function setupNavigation() {
    // Los botones ya tienen onclick inline en el HTML
    // Esto es solo para inicializar si es necesario
    console.log('Navegación configurada');
}

// Función para hacer scroll suave a secciones
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Utilidades
console.log('🍽️ Sabor Gourmet - Sistema listo para usar');
            if (scrollToTopVisible) {
                fadeOut(scrollToTop);
                scrollToTopVisible = false;
            }
        }
    })
})

function fadeOut(el) {
    el.style.opacity = 1;
    (function fade() {
        if ((el.style.opacity -= .1) < 0) {
            el.style.display = "none";
        } else {
            requestAnimationFrame(fade);
        }
    })();
};

function fadeIn(el, display) {
    el.style.opacity = 0;
    el.style.display = display || "block";
    (function fade() {
        var val = parseFloat(el.style.opacity);
        if (!((val += .1) > 1)) {
            el.style.opacity = val;
            requestAnimationFrame(fade);
        }
    })();
};

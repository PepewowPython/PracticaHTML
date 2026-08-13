// 6. Reloj digital en tiempo real
function updateClock() {
    const clockElement = document.getElementById('digital-clock');
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    clockElement.textContent = `${hours}:${minutes}:${seconds}`;
}
setInterval(updateClock, 1000);
updateClock();

// 8. Sistema de pestañas (tabs)
const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanes = document.querySelectorAll('.tab-pane');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remover active de todos
        tabBtns.forEach(b => b.classList.remove('active'));
        tabPanes.forEach(p => p.classList.remove('active'));
        
        // Añadir active al clickeado
        btn.classList.add('active');
        const targetId = btn.getAttribute('data-tab');
        document.getElementById(targetId).classList.add('active');
    });
});

// 4. Lightbox (Caja de luz)
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeLightbox = document.getElementById('close-lightbox');
const lightboxTriggers = document.querySelectorAll('.lightbox-trigger');

lightboxTriggers.forEach(img => {
    img.addEventListener('click', () => {
        // Remove width query param from url to get full image if unsplash
        const highResUrl = img.src.replace('&w=500', '&w=1200');
        lightboxImg.src = highResUrl;
        lightbox.classList.add('active');
    });
});

closeLightbox.addEventListener('click', () => {
    lightbox.classList.remove('active');
});

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        lightbox.classList.remove('active');
    }
});

// 7. Login Page - Modal y Validación
const loginBtn = document.getElementById('login-btn');
const loginModal = document.getElementById('login-modal');
const closeLogin = document.getElementById('close-login');
const loginForm = document.getElementById('login-form');
const loginUser = document.getElementById('login-user');
const loginPass = document.getElementById('login-pass');
const loginFeedback = document.getElementById('login-feedback');

loginBtn.addEventListener('click', () => loginModal.classList.add('active'));
closeLogin.addEventListener('click', () => loginModal.classList.remove('active'));

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = loginUser.value;
    const pass = loginPass.value;
    
    // Reset classes
    loginUser.classList.remove('input-error', 'input-success');
    loginPass.classList.remove('input-error', 'input-success');
    loginFeedback.className = 'feedback-msg';

    // Validación hardcodeada (admin / 1234)
    if (user === 'admin' && pass === '1234') {
        loginUser.classList.add('input-success');
        loginPass.classList.add('input-success');
        loginFeedback.textContent = 'Login exitoso! Redirigiendo...';
        loginFeedback.classList.add('msg-success');
        setTimeout(() => {
            loginModal.classList.remove('active');
            loginBtn.textContent = 'Mi Cuenta';
            // Reset fields
            loginUser.value = '';
            loginPass.value = '';
            loginUser.classList.remove('input-success');
            loginPass.classList.remove('input-success');
            loginFeedback.textContent = '';
        }, 1500);
    } else {
        loginUser.classList.add('input-error');
        loginPass.classList.add('input-error');
        loginFeedback.textContent = 'Usuario o contraseña incorrectos.';
        loginFeedback.classList.add('msg-error');
    }
});

// 5. Carrito de Compras
const cartBtn = document.getElementById('cart-btn');
const cartSidebar = document.getElementById('cart-sidebar');
const closeCart = document.getElementById('close-cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotalPrice = document.getElementById('cart-total-price');
const addButtons = document.querySelectorAll('.add-to-cart');

let cart = [];

cartBtn.addEventListener('click', () => cartSidebar.classList.add('active'));
closeCart.addEventListener('click', () => cartSidebar.classList.remove('active'));

addButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const product = {
            id: btn.getAttribute('data-id'),
            name: btn.getAttribute('data-name'),
            price: parseFloat(btn.getAttribute('data-price')),
            img: btn.getAttribute('data-img')
        };
        cart.push(product);
        updateCartUI();
        
        // Pequeño feedback visual en el botón
        const originalText = btn.textContent;
        btn.textContent = '¡Añadido!';
        btn.classList.replace('btn-primary', 'btn-outline');
        setTimeout(() => {
            btn.textContent = originalText;
            btn.classList.replace('btn-outline', 'btn-primary');
        }, 1000);
    });
});

function updateCartUI() {
    cartCount.textContent = cart.length;
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">El carrito está vacío</p>';
        cartTotalPrice.textContent = '0';
        return;
    }

    let total = 0;
    cart.forEach((item, index) => {
        total += item.price;
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <img src="${item.img}" alt="${item.name}">
            <div class="cart-item-info">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">$${item.price}</div>
            </div>
            <button class="remove-item" onclick="removeFromCart(${index})">&times;</button>
        `;
        cartItemsContainer.appendChild(div);
    });
    
    cartTotalPrice.textContent = total.toFixed(2);
}

// Global function para el onclick del HTML generado
window.removeFromCart = function(index) {
    cart.splice(index, 1);
    updateCartUI();
};

// 2. Formulario con validación (nombre, correo y teléfono)
const contactForm = document.getElementById('contact-form');
const contactName = document.getElementById('contact-name');
const contactEmail = document.getElementById('contact-email');
const contactPhone = document.getElementById('contact-phone');
const contactSuccess = document.getElementById('contact-success');

function validateInput(input, regex) {
    const errorMsg = input.nextElementSibling;
    if (regex.test(input.value.trim())) {
        input.classList.remove('input-error');
        input.classList.add('input-success');
        errorMsg.classList.remove('active');
        return true;
    } else {
        input.classList.remove('input-success');
        input.classList.add('input-error');
        errorMsg.classList.add('active');
        return false;
    }
}

contactName.addEventListener('input', () => {
    // Solo letras y espacios, mínimo 3 caracteres
    validateInput(contactName, /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,}$/);
});

contactEmail.addEventListener('input', () => {
    // Regex simple para email
    validateInput(contactEmail, /^[^\s@]+@[^\s@]+\.[^\s@]+$/);
});

contactPhone.addEventListener('input', () => {
    // Solo números, entre 7 y 15 dígitos
    validateInput(contactPhone, /^[0-9]{7,15}$/);
});

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const isNameValid = validateInput(contactName, /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,}$/);
    const isEmailValid = validateInput(contactEmail, /^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    const isPhoneValid = validateInput(contactPhone, /^[0-9]{7,15}$/);
    
    if (isNameValid && isEmailValid && isPhoneValid) {
        contactSuccess.style.display = 'block';
        contactForm.reset();
        [contactName, contactEmail, contactPhone].forEach(input => {
            input.classList.remove('input-success', 'input-error');
        });
        setTimeout(() => {
            contactSuccess.style.display = 'none';
        }, 3000);
    }
});

// 10. Scroll infinito
const newsContainer = document.getElementById('news-container');
const loadingSpinner = document.getElementById('loading-spinner');

// Fake data generator
let newsCount = 0;
const generateNewsItems = () => {
    const items = [];
    for (let i = 0; i < 3; i++) {
        newsCount++;
        items.push(`
            <div class="news-card glass-panel" style="animation: fadeIn 0.5s ease">
                <h3>Noticia Tecnológica #${newsCount}</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Actualización sobre las últimas tendencias de la industria.</p>
            </div>
        `);
    }
    return items.join('');
};

const observer = new IntersectionObserver((entries) => {
    // Si el spinner es visible en pantalla
    if (entries[0].isIntersecting) {
        // Simulamos una carga de API con setTimeout
        loadingSpinner.textContent = "Cargando...";
        setTimeout(() => {
            newsContainer.insertAdjacentHTML('beforeend', generateNewsItems());
            loadingSpinner.textContent = "Cargando más contenido...";
            
            // Límite de seguridad para no hacer scroll infinito infinito y consumir memoria
            if (newsCount > 15) {
                observer.unobserve(loadingSpinner);
                loadingSpinner.textContent = "No hay más noticias.";
            }
        }, 1000);
    }
}, { threshold: 1.0 });

observer.observe(loadingSpinner);

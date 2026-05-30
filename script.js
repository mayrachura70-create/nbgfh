// ===================== Productos Database =====================
const productos = [
    {
        id: 1,
        nombre: "Rosa Rojo Pasión",
        categoria: "rojo",
        precio: 35000,
        descripcion: "Ramo de 7 rosas rojas elaboradas a mano con cintas de seda de la más alta calidad. Perfecto para declaraciones de amor.",
        emoji: "🔴"
    },
    {
        id: 2,
        nombre: "Rosa Rosa Romántica",
        categoria: "rosa",
        precio: 30000,
        descripcion: "Elegantes rosas en tonos rosa pastel. Combinación perfecta entre delicadeza y belleza duradera.",
        emoji: "🌸"
    },
    {
        id: 3,
        nombre: "Ramo Arcoíris",
        categoria: "arcoiris",
        precio: 50000,
        descripcion: "7 rosas en diferentes colores del arcoíris. Un explosión de colores que durará para siempre.",
        emoji: "🌈"
    },
    {
        id: 4,
        nombre: "Ramo de Lujo Premium",
        categoria: "lujo",
        precio: 80000,
        descripcion: "24 rosas elaboradas con detalles en oro y plateado. La opción más lujosa y sofisticada.",
        emoji: "✨"
    },
    {
        id: 5,
        nombre: "Rosa Blanca Pureza",
        categoria: "todos",
        precio: 28000,
        descripcion: "Símbolo de pureza y paz. Rosas blancas elegantes perfectas para bodas y ceremonias especiales.",
        emoji: "🤍"
    },
    {
        id: 6,
        nombre: "Ramo Mixto Seducción",
        categoria: "rojo",
        precio: 45000,
        descripcion: "Combinación de rosas rojas y negras. Elegancia y misterio en un solo ramo.",
        emoji: "🖤"
    },
    {
        id: 7,
        nombre: "Rosa Amarilla Amistad",
        categoria: "rosa",
        precio: 25000,
        descripcion: "Expresa gratitud y amistad con estas hermosas rosas amarillas. Ideales para sorprender a tus amigos.",
        emoji: "💛"
    },
    {
        id: 8,
        nombre: "Colección Arcoíris Deluxe",
        categoria: "arcoiris",
        precio: 65000,
        descripcion: "12 rosas con todos los colores del arcoíris. Diseño exclusivo y personalizado.",
        emoji: "🌺"
    },
    {
        id: 9,
        nombre: "Rosa Diamante",
        categoria: "lujo",
        precio: 100000,
        descripcion: "La opción más premium. Rosas con detalles de cristales Swarovski. Pura elegancia.",
        emoji: "💎"
    }
];

// ===================== Variables Globales =====================
let carrito = [];
let productoSeleccionado = null;

// ===================== Inicialización =====================
document.addEventListener('DOMContentLoaded', function() {
    cargarProductos();
    configurarEventos();
    cargarCarritoDesdeLocalStorage();
});

// ===================== Funciones de Productos =====================
function cargarProductos(filtro = 'todos') {
    const gridProductos = document.getElementById('grid-productos');
    gridProductos.innerHTML = '';

    let productosFiltrados = productos;
    if (filtro !== 'todos') {
        productosFiltrados = productos.filter(p => p.categoria === filtro);
    }

    productosFiltrados.forEach(producto => {
        const card = crearProductoCard(producto);
        gridProductos.appendChild(card);
    });

    // Animación de entrada
    const cards = gridProductos.querySelectorAll('.producto-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
        }, index * 50);
    });
}

function crearProductoCard(producto) {
    const card = document.createElement('div');
    card.className = 'producto-card';
    card.innerHTML = `
        <div class="producto-imagen">${producto.emoji}</div>
        <div class="producto-info">
            <h3>${producto.nombre}</h3>
            <p>${producto.descripcion}</p>
            <p class="producto-precio">$${producto.precio.toLocaleString('es-CO')}</p>
            <button class="btn btn-primary" onclick="abrirProductoModal(${producto.id})">Ver Detalles</button>
        </div>
    `;
    
    return card;
}

function abrirProductoModal(id) {
    productoSeleccionado = productos.find(p => p.id === id);
    
    document.getElementById('nombre-producto').textContent = productoSeleccionado.nombre;
    document.getElementById('descripcion-producto').textContent = productoSeleccionado.descripcion;
    document.getElementById('precio-producto').textContent = productoSeleccionado.precio.toLocaleString('es-CO');
    document.getElementById('imagen-grande').textContent = productoSeleccionado.emoji;
    document.getElementById('cantidad').value = 1;
    
    document.getElementById('producto-modal').classList.add('show');
}

function incrementarCantidad() {
    const cantidad = document.getElementById('cantidad');
    cantidad.value = parseInt(cantidad.value) + 1;
}

function decrementarCantidad() {
    const cantidad = document.getElementById('cantidad');
    if (parseInt(cantidad.value) > 1) {
        cantidad.value = parseInt(cantidad.value) - 1;
    }
}

function agregarAlCarrito() {
    const cantidad = parseInt(document.getElementById('cantidad').value);
    
    const itemCarrito = carrito.find(item => item.id === productoSeleccionado.id);
    
    if (itemCarrito) {
        itemCarrito.cantidad += cantidad;
    } else {
        carrito.push({
            id: productoSeleccionado.id,
            nombre: productoSeleccionado.nombre,
            precio: productoSeleccionado.precio,
            cantidad: cantidad,
            emoji: productoSeleccionado.emoji
        });
    }
    
    guardarCarritoEnLocalStorage();
    actualizarCarrito();
    cerrarModal('producto-modal');
    
    // Notificación visual
    mostrarNotificacion('¡Producto agregado al carrito!');
}

// ===================== Funciones del Carrito =====================
function actualizarCarrito() {
    const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    document.getElementById('carrito-count').textContent = carrito.length;
    document.getElementById('total-precio').textContent = total.toLocaleString('es-CO');
    
    const carritoItems = document.getElementById('carrito-items');
    carritoItems.innerHTML = '';
    
    if (carrito.length === 0) {
        carritoItems.innerHTML = '<p style="text-align: center; padding: 2rem;">Tu carrito está vacío 🛍️</p>';
        return;
    }
    
    carrito.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'carrito-item';
        itemElement.innerHTML = `
            <div class="carrito-item-info">
                <h4>${item.emoji} ${item.nombre}</h4>
                <p>Cantidad: ${item.cantidad} × $${item.precio.toLocaleString('es-CO')}</p>
                <p class="carrito-item-precio">Subtotal: $${(item.precio * item.cantidad).toLocaleString('es-CO')}</p>
            </div>
            <button class="carrito-item-eliminar" onclick="eliminarDelCarrito(${item.id})" title="Eliminar">
                <i class="fas fa-trash"></i>
            </button>
        `;
        carritoItems.appendChild(itemElement);
    });
}

function eliminarDelCarrito(id) {
    carrito = carrito.filter(item => item.id !== id);
    guardarCarritoEnLocalStorage();
    actualizarCarrito();
    mostrarNotificacion('Producto eliminado del carrito');
}

function guardarCarritoEnLocalStorage() {
    localStorage.setItem('winaytika-carrito', JSON.stringify(carrito));
}

function cargarCarritoDesdeLocalStorage() {
    const carritoGuardado = localStorage.getItem('winaytika-carrito');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
        actualizarCarrito();
    }
}

function finalizarCompra() {
    if (carrito.length === 0) {
        mostrarNotificacion('Debes agregar productos al carrito primero');
        return;
    }
    
    const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    const mensaje = `Hola, quisiera comprar: ${carrito.map(item => `${item.cantidad}x ${item.nombre}`).join(', ')}. Total: $${total.toLocaleString('es-CO')}`;
    
    const enlaceWhatsApp = `https://wa.me/573214567890?text=${encodeURIComponent(mensaje)}`;
    window.open(enlaceWhatsApp, '_blank');
    
    carrito = [];
    guardarCarritoEnLocalStorage();
    actualizarCarrito();
    cerrarCarrito();
    mostrarNotificacion('¡Gracias por tu compra! 🎉');
}

function cerrarCarrito() {
    document.getElementById('carrito-modal').classList.remove('show');
}

// ===================== Funciones de Modal =====================
function cerrarModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

// ===================== Eventos =====================
function configurarEventos() {
    // Filtros de productos
    const filtroButtons = document.querySelectorAll('.filtro-btn');
    filtroButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            filtroButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            cargarProductos(this.dataset.filtro);
        });
    });
    
    // Carrito modal
    document.querySelector('.carrito-btn').addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('carrito-modal').classList.add('show');
    });
    
    // Cerrar modales con X
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            this.closest('.modal').classList.remove('show');
        });
    });
    
    // Cerrar modal al hacer click fuera
    window.addEventListener('click', function(event) {
        const productoModal = document.getElementById('producto-modal');
        const carritoModal = document.getElementById('carrito-modal');
        
        if (event.target === productoModal) {
            productoModal.classList.remove('show');
        }
        if (event.target === carritoModal) {
            carritoModal.classList.remove('show');
        }
    });
}

// ===================== Formulario de Contacto =====================
function enviarContacto(event) {
    event.preventDefault();
    
    const form = event.target;
    const nombre = form.querySelector('input[type="text"]').value;
    const email = form.querySelector('input[type="email"]').value;
    const asunto = form.querySelector('input:nth-of-type(3)').value;
    const mensaje = form.querySelector('textarea').value;
    
    const mensajeCompleto = `Nombre: ${nombre}\nEmail: ${email}\nAsunto: ${asunto}\n\nMensaje:\n${mensaje}`;
    const enlaceWhatsApp = `https://wa.me/573214567890?text=${encodeURIComponent(mensajeCompleto)}`;
    
    window.open(enlaceWhatsApp, '_blank');
    
    form.reset();
    mostrarNotificacion('¡Mensaje enviado! Nos pondremos en contacto pronto 📱');
}

// ===================== Notificaciones =====================
function mostrarNotificacion(mensaje) {
    const notificacion = document.createElement('div');
    notificacion.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        z-index: 300;
        animation: slideInRight 0.3s ease;
        font-weight: 600;
    `;
    notificacion.textContent = mensaje;
    
    document.body.appendChild(notificacion);
    
    setTimeout(() => {
        notificacion.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notificacion.remove(), 300);
    }, 3000);
}

// ===================== Animaciones CSS para Notificaciones =====================
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;
document.head.appendChild(style);

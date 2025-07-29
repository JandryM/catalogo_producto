const products = [
  {
    name: "Camiseta Roja",
    price: 19.99,
    image: "https://media.istockphoto.com/id/685779142/es/foto/camiseta-roja-ropa.jpg?s=612x612&w=0&k=20&c=39z_71KvuAxJfvEex0kBrH8IThjbRCISvMUP34Qql-0="
  },
  {
    name: "Zapatos Negros",
    price: 49.99,
    image: "https://img.kwcdn.com/product/Fancyalgo/VirtualModelMatting/6aa99069ec135f551f9a9eea22f6afc4.jpg?imageMogr2/auto-orient%7CimageView2/2/w/800/q/70/format/webp"
  },
  {
    name: "Gorra Azul",
    price: 14.99,
    image: "https://assets.adidas.com/images/w_383,h_383,f_auto,q_auto,fl_lossy,c_fill,g_auto/08761cb74ed94f4b9b955ff21d2d16bf_9366/gorra-trifolio-baseball-unisex.jpg"
  }
];

const container = document.getElementById('product-list');
const cartList = document.getElementById('cart');
const cart = [];
let ppButton = null;

function updateCart() {
  cartList.innerHTML = "";
  let total = 0;
  
  cart.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `${item.name} - $${item.price.toFixed(2)}`;
    cartList.appendChild(li);
    total += item.price;
  });
  
  // Actualizar el total mostrado
  const cartTotal = document.getElementById('cart-total');
  if (cartTotal) {
    cartTotal.textContent = total.toFixed(2);
  }
  
  // Inicializar la cajita de pago si hay productos en el carrito
  if (cart.length > 0) {
    initPaymentBox(total);
  } else {
    // Si no hay productos, limpiamos el área de pago
    const ppButtonContainer = document.getElementById('pp-button');
    if (ppButtonContainer) {
      ppButtonContainer.innerHTML = '';
    }
  }
}

// Mostrar productos en la página
products.forEach(product => {
  const card = document.createElement('div');
  card.className = 'card';

  card.innerHTML = `
    <img src="${product.image}" alt="${product.name}">
    <h2>${product.name}</h2>
    <p>Precio: $${product.price.toFixed(2)}</p>
    <button>Añadir al carrito</button>
  `;

  const button = card.querySelector('button');
  button.addEventListener('click', () => {
    cart.push(product);
    updateCart();
  });

  container.appendChild(card);
});

// Función para inicializar la cajita de pago de PayPhone
function initPaymentBox(total) {
  // Convertir el total a centavos (PayPhone trabaja con centavos)
  const amountInCents = Math.round(total * 100);
  
  // Guardar el total en localStorage para recuperarlo en la página de confirmación
  localStorage.setItem('lastTransactionAmount', total.toFixed(2));
  
  // ID único para cada transacción
  const transactionId = `TRX_${Date.now()}`;
  
  // Guardar también el ID de transacción para referencia
  localStorage.setItem('lastTransactionId', transactionId);
  
  // Limpiar el contenedor antes de crear un nuevo botón
  document.getElementById('pp-button').innerHTML = '';
  
  // Verificar si la librería se ha cargado correctamente
  if (window.PPaymentButtonBox) {
    ppButton = new window.PPaymentButtonBox({
      token: 'uLRHHsnKOpa8M5Zd6Nh8372hvNDX_kgHjvS3C2y5b2o1qtu1C0x3oCgvVXL5gH_d9B0qL9_TnkpAI4xEzyKdseq8vGGXK8o1TgBTkeugcuz99ssPK0mNBR1FMIzaqSFEMCo6ucEGutfdlEwB2CUObvnmgWFeQmXTIKnjOjY98UXsB0uTAs6xbbmTCLjk0mWmHEigyxZR32Uw7IfK7t_GgkB7SMpRx2clYSE9GS8pufXS4VsVgw9Wdu7EAAH9oOlgtS0qdiVjchjDN0x4Eb-SttCd6zr2W4uGAYhJm6rSgD4ON4kykyVaYmikOle24agfJx-AjUvOhG49J5evjVltrQhiIzs',
      clientTransactionId: transactionId,
      amount: amountInCents,
      amountWithoutTax: amountInCents,
      amountWithTax: 0,                 
      tax: 0,                           
      service: 0,
      tip: 0,
      currency: "USD",
      storeId: "724f18f1-cb95-485d-a7b4-23e6c2171304",
      reference: `Compra en tienda - ${transactionId}`,
      lang: "es",
      defaultMethod: "card",
      timeZone: -5,
      
      // Eventos y callbacks
    onSuccessfulPayment: function(response) {
      showPaymentMessage('¡Pago exitoso! Gracias por tu compra.', 'success');
      cart.length = 0; // Vaciar carrito
      updateCart();

      // Redirigir a confirmacion.html usando el mismo origen (puerto incluido)
      const url = new URL(`${window.location.origin}/confirmacion.html`);
      url.searchParams.set('clientTransactionId', response.clientTransactionId || 'N/A');
      url.searchParams.set('transactionId', response.transactionId || 'N/A');
      url.searchParams.set('transactionStatus', response.transactionStatus || 'Approved');

      window.location.href = url.toString();
    },
      onCancelledPayment: function(response) {
        showPaymentMessage('Pago cancelado', 'info');
      },
      onFailurePayment: function(error) {
        showPaymentMessage('Error en el pago: ' + error.message, 'error');
      }
    });
    
    // Renderizar el botón en el contenedor
    ppButton.render("pp-button");
  } else {
    console.error("La librería PayPhone no está disponible");
    showPaymentMessage("Error al cargar el botón de pago. Intente más tarde.", "error");
  }
}

// Función para mostrar mensajes de respuesta de pago
function showPaymentMessage(message, type) {
  const paymentResponse = document.getElementById('payment-response');
  if (paymentResponse) {
    paymentResponse.textContent = message;
    paymentResponse.style.display = 'block';
    paymentResponse.className = `payment-response ${type}`;
    
    // Ocultar el mensaje después de 5 segundos
    setTimeout(() => {
      paymentResponse.style.display = 'none';
    }, 5000);
  }
}

// Verificar que la librería de PayPhone se cargue correctamente
document.addEventListener('DOMContentLoaded', function() {
  // Esperar un tiempo para que el módulo de PayPhone se cargue completamente
  setTimeout(() => {
    if (!window.PPaymentButtonBox) {
      console.error('No se pudo cargar la librería de PayPhone');
    } else {
      console.log('PayPhone cargado correctamente');
    }
  }, 1000);
});
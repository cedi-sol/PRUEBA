// ================================
//           SCRIPT.JS
// ================================

// -------------------------------
// ELEMENTOS
// -------------------------------

const modal = document.getElementById("modalPedido");

const form = document.getElementById("formPedido");

const prodInput = document.getElementById("prodSelected");

const precioInput = document.getElementById("precioSelected");

const contenedorTienda =
document.getElementById("contenedorTienda");

// -------------------------------
// CARGAR PRODUCTOS FIREBASE
// -------------------------------

if (contenedorTienda) {

    db.collection("productos")
    .onSnapshot((snapshot) => {

        contenedorTienda.innerHTML = "";

        // SI NO HAY PRODUCTOS

        if (snapshot.empty) {

            contenedorTienda.innerHTML = `

            <div class="empty-products">

                <i class="fa-solid fa-gift"></i>

                <h3>
                    Próximamente nuevos productos 💖
                </h3>

            </div>

            `;

            return;

        }

        // RECORRER PRODUCTOS

        snapshot.forEach((doc) => {

            const p = doc.data();

            contenedorTienda.innerHTML += `

            <div class="product-card">

                <div
                class="product-img"

                style="
                background-image:
                url('${p.imagen || 'https://via.placeholder.com/500'}')
                ">
                </div>

                <div class="product-info">

                    <h3>
                        ${p.nombre}
                    </h3>

                    <p class="price">

                        S/ ${p.precio.toFixed(2)}

                    </p>

                    <button
                    class="btn-order"

                    onclick="
                    openModal(
                    '${p.nombre}',
                    ${p.precio}
                    )
                    ">

                        Pedir ahora 💖

                    </button>

                </div>

            </div>

            `;

        });

    });

}

// -------------------------------
// ABRIR MODAL
// -------------------------------

function openModal(nombreProducto, precio) {

    modal.style.display = "block";

    document.body.style.overflow = "hidden";

    prodInput.value = nombreProducto;

    precioInput.value = precio;

}

// -------------------------------
// CERRAR MODAL
// -------------------------------

function closeModal() {

    modal.style.display = "none";

    document.body.style.overflow = "auto";

    form.reset();

}

// -------------------------------
// CERRAR AL TOCAR AFUERA
// -------------------------------

window.onclick = function(event) {

    if (event.target == modal) {

        closeModal();

    }

}

// -------------------------------
// ENVIAR PEDIDO
// -------------------------------

form.addEventListener(
"submit",
async function(e) {

    e.preventDefault();

    // ---------------------------
    // DATOS DEL PEDIDO
    // ---------------------------

    const datosPedido = {

        producto:
        prodInput.value,

        precioUnitario:
        parseFloat(precioInput.value),

        cantidad:
        parseInt(
        document.getElementById("cantidad").value
        ),

        dni:
        document.getElementById("dni").value,

        mensaje:
        document.getElementById("mensaje").value
        || "Sin mensaje",

        cliente:
        `${document.getElementById("nombre").value}
        ${document.getElementById("apellidos").value}`,

        cel:
        document.getElementById("celular").value,

        ubicacion:
        `${document.getElementById("dep").value},
        ${document.getElementById("prov").value},
        ${document.getElementById("dist").value}`,

        dir:
        document.getElementById("dir").value,

        fecha:
        new Date().toLocaleDateString(),

        timestamp:
        firebase.firestore.FieldValue.serverTimestamp()

    };

    // ---------------------------
    // TOTAL
    // ---------------------------

    datosPedido.totalVenta =

    datosPedido.precioUnitario *
    datosPedido.cantidad;

    try {

        // -----------------------
        // GUARDAR FIREBASE
        // -----------------------

        await db.collection("pedidos")
        .add(datosPedido);

        // -----------------------
        // MENSAJE WHATSAPP
        // -----------------------

        const numeroNegocio =
        "51900890790";

        const textoWhatsApp =

        `Hola! ✨ Deseo realizar un pedido:%0A%0A` +

        `🎁 *${datosPedido.producto}*%0A` +

        `💰 *Precio:* S/ ${datosPedido.precioUnitario}%0A` +

        `🔢 *Cantidad:* ${datosPedido.cantidad}%0A` +

        `📝 *Mensaje:* ${datosPedido.mensaje}%0A%0A` +

        `👤 *Cliente:* ${datosPedido.cliente}%0A` +

        `🪪 *DNI:* ${datosPedido.dni}%0A` +

        `📞 *Celular:* ${datosPedido.cel}%0A` +

        `📍 *Ubicación:* ${datosPedido.ubicacion}%0A` +

        `🏠 *Dirección:* ${datosPedido.dir}%0A%0A` +

        `💵 *TOTAL:* S/ ${datosPedido.totalVenta}`;

        // -----------------------
        // URL WHATSAPP
        // -----------------------

        const url =

        `https://api.whatsapp.com/send?phone=${numeroNegocio}&text=${textoWhatsApp}`;

        // -----------------------
        // CERRAR MODAL
        // -----------------------

        closeModal();

        // -----------------------
        // ABRIR WHATSAPP
        // -----------------------

        window.open(url, "_blank");

    } catch(error) {

        console.error(
        "Error al guardar pedido:",
        error
        );

        alert(
        "Hubo un error al procesar el pedido 😢"
        );

    }

});

// -------------------------------
// SCROLL SUAVE
// -------------------------------

document
.querySelectorAll('a[href^="#"]')

.forEach(anchor => {

    anchor.addEventListener(
    "click",
    function(e) {

        e.preventDefault();

        document.querySelector(
        this.getAttribute("href")
        )

        .scrollIntoView({

            behavior:"smooth"

        });

    });

});

// -------------------------------
// ANIMACIÓN APARICIÓN PRODUCTOS
// -------------------------------

window.addEventListener("scroll", () => {

    const cards =
    document.querySelectorAll(".product-card");

    cards.forEach((card) => {

        const top =
        card.getBoundingClientRect().top;

        if(top < window.innerHeight - 50){

            card.style.opacity = "1";

            card.style.transform =
            "translateY(0)";

        }

    });

});

// -------------------------------
// EFECTO HEADER
// -------------------------------

window.addEventListener("scroll", () => {

    const header =
    document.querySelector(".header");

    if(window.scrollY > 50){

        header.style.background =
        "rgba(255,255,255,0.85)";

        header.style.boxShadow =
        "0 10px 30px rgba(0,0,0,0.08)";

    }

    else{

        header.style.background =
        "rgba(255,255,255,0.6)";

        header.style.boxShadow =
        "none";

    }

});

// =====================================
// HERO SLIDER AUTOMÁTICO
// =====================================

const slides =
document.querySelectorAll(".hero-slide");

let currentSlide = 0;

function changeSlide(){

    slides[currentSlide]
    .classList.remove("active");

    currentSlide++;

    if(currentSlide >= slides.length){

        currentSlide = 0;

    }

    slides[currentSlide]
    .classList.add("active");

}

// CAMBIAR CADA 3 SEGUNDOS

setInterval(changeSlide, 3000);

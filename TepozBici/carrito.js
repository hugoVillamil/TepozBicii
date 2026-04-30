// ===============================
// IMPORTAR FIREBASE
// ===============================

import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    updateDoc,
    doc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


// ===============================
// OBTENER CARRITO
// ===============================

// Traemos lo guardado en localStorage
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];


// ===============================
// MOSTRAR CARRITO
// ===============================

function cargarCarrito(){

    let contenedor = document.getElementById("contenedor-carrito");
    contenedor.innerHTML = "";

    let totalGeneral = 0;

    carrito.forEach((bici,index)=>{

        // Calculamos total por bici
        let total = bici.precio * bici.horas;

        // Sumamos al total general
        totalGeneral += total;

        // Pintamos en pantalla
        contenedor.innerHTML += `
        <div class="cart-item">

            <span>${bici.nombre}</span>
            <span>$${bici.precio}</span>

            <!-- Cantidad de horas -->
            <div class="qty-box">
                <button onclick="menos(${index})">-</button>
                ${bici.horas}
                <button onclick="mas(${index})">+</button>
            </div>

            <span>$${total}</span>

            <!-- Botón eliminar -->
            <button class="btn-eliminar" onclick="eliminar(${index})">
                Eliminar
            </button>

        </div>
        `;
    });

    // Mostrar subtotal
    document.getElementById("totalGeneral").textContent =
    "Subtotal $" + totalGeneral;
}


// ===============================
// SUMAR HORAS
// ===============================

window.mas = function(index){
    carrito[index].horas++;
    guardar();
}


// ===============================
// RESTAR HORAS
// ===============================

window.menos = function(index){

    if(carrito[index].horas > 1){
        carrito[index].horas--;
        guardar();
    }
}


// ===============================
// ELIMINAR PRODUCTO
// ===============================

window.eliminar = function(index){

    carrito.splice(index,1);

    guardar();

    mostrarMensaje("Bicicleta eliminada");
}


// ===============================
// GUARDAR CAMBIOS
// ===============================

function guardar(){
    localStorage.setItem("carrito", JSON.stringify(carrito));
    cargarCarrito();
}


// ===============================
// PAGAR
// ===============================

window.pagar = async function(){

    let usuario = JSON.parse(localStorage.getItem("usuario"));

    for(let bici of carrito){

        // Guardar renta
        await addDoc(collection(db, "rentas"), {
            cliente: usuario.nombre,
            idCliente: usuario.idUsuario,
            idBicicleta: bici.id,
            bicicleta: bici.nombre,
            horas: bici.horas,
            total: bici.precio * bici.horas,
            estado: "activa",
            fecha: new Date().toLocaleDateString()
        });

        // Cambiar estado de la bici
        await updateDoc(doc(db, "bicicletas", bici.id), {
            estado: "rentada"
        });
    }

    mostrarMensaje("Pago realizado");

    // Vaciar carrito
    localStorage.removeItem("carrito");

    // Regresar a inventario
    setTimeout(()=>{
        window.location.href = "inventario.html";
    },2000);
}


// ===============================
// MENSAJE BONITO
// ===============================

function mostrarMensaje(texto){

    let toast = document.getElementById("toast");

    toast.textContent = texto;
    toast.classList.add("show");

    setTimeout(()=>{
        toast.classList.remove("show");
    },3000);
}


// ===============================
// INICIAR
// ===============================

cargarCarrito();
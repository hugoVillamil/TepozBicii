// ===============================
//  IMPORTAR FIREBASE
// ===============================

import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    updateDoc,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


// ===============================
//  OBTENER USUARIO
// ===============================

// Guardamos el usuario que inició sesión
let usuario = JSON.parse(localStorage.getItem("usuario"));

// Si no hay usuario → lo mandamos al login
if (!usuario) {
    window.location.href = "login.html";
}


// ===============================
//  CONTROL VISUAL
// ===============================

// Si es cliente → ocultamos botón agregar
if (usuario.tipo === "cliente") {
    document.getElementById("btnAgregar").style.display = "none";
} 
// Si es empleado → ocultamos carrito
else {
    document.getElementById("carrito").style.display = "none";
}

// ===============================
// AGREGAR AL CARRITO
// ===============================
window.agregar = function (id, nombre, precio) {

    // Traemos carrito actual
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    // Agregamos nueva bici
    carrito.push({
        id: id,
        nombre: nombre,
        precio: precio,
        horas: 1
    });

    window.irCarrito = function () {
    window.location.href = "carrito.html";
};

    // Guardamos
    localStorage.setItem("carrito", JSON.stringify(carrito));

    mostrarMensaje("Agregado al carrito");
};


// ===============================
//  MENSAJES
// ===============================

function mostrarMensaje(texto) {

    let toast = document.getElementById("toast");

    toast.textContent = texto;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}


// ===============================
// CARGAR BICICLETAS
// ===============================

async function cargarBicis() {

    // Traemos datos de Firebase
    const querySnapshot = await getDocs(collection(db, "bicicletas"));

    let contenedor = document.getElementById("contenedor-bicis");
    contenedor.innerHTML = "";

    const template = document.getElementById("template-bici");

    querySnapshot.forEach((docu) => {

        let data = docu.data();

        // Cliente solo ve disponibles
        if (usuario.tipo === "cliente" && data.estado !== "disponible") return;

        // Clonamos plantilla
        let clone = template.content.cloneNode(true);

        // ===============================
        //  IMAGEN
        // ===============================

        let img = clone.querySelector(".img-bici");
        img.src = "css/images/" + data.imagen;

        // Si falla la imagen → ponemos una por defecto
        img.onerror = function () {
            this.src = "css/images/default.jpg";
        };

        // ===============================
        //  DATOS
        // ===============================

        clone.querySelector(".nombre").textContent = data.nombre;
        clone.querySelector(".marca").textContent = "Marca: " + data.marca;
        clone.querySelector(".tipo").textContent = "Tipo: " + data.tipo;
        clone.querySelector(".precio").textContent = "$" + data.precio + "/hora";
        clone.querySelector(".descripcion").textContent = data.descripcion;

        let estadoTexto = clone.querySelector(".estado");
        estadoTexto.textContent = "Estado: " + data.estado;

        //  Colores según estado
        if (data.estado === "disponible") estadoTexto.style.color = "lightgreen";
        if (data.estado === "rentada") estadoTexto.style.color = "red";
        if (data.estado === "mantenimiento") estadoTexto.style.color = "orange";

        let acciones = clone.querySelector(".acciones");

        // ===============================
        //  CLIENTE
        // ===============================

        if (usuario.tipo === "cliente") {

            acciones.innerHTML = `
    <button class="btn-pro" onclick="agregar('${docu.id}','${data.nombre}','${data.precio}')">
        Rentar
    </button>
`;
        }

        // ===============================
        //  EMPLEADO
        // ===============================

        else {

            acciones.innerHTML = `
                <button class="btn-pro"
                    onclick="abrirEditar('${docu.id}', '${data.nombre}', '${data.marca}', '${data.tipo}', '${data.precio}', '${data.imagen}', '${data.descripcion}')">
                    Editar 
                </button>

                <button class="btn-pro" onclick="confirmarEliminar('${docu.id}')">
                    Eliminar 
                </button>

                <select class="select-pro" onchange="cambiarEstado('${docu.id}', this.value)">
                    <option value="">Cambiar estado</option>
                    <option value="disponible">Disponible</option>
                    <option value="rentada">Rentada</option>
                    <option value="mantenimiento">Mantenimiento</option>
                </select>
            `;
        }

        contenedor.appendChild(clone);
    });

    // Si no hay bicicletas
    if (contenedor.innerHTML === "") {
        contenedor.innerHTML = "<h3 style='color:white'>No hay bicicletas disponibles </h3>";
    }
}


// ===============================
//  CAMBIAR ESTADO
// ===============================

window.cambiarEstado = async function (id, estado) {

    if (!estado) return;

    await updateDoc(doc(db, "bicicletas", id), {
        estado: estado
    });

    mostrarMensaje("Estado actualizado ");

    cargarBicis();
};


// ===============================
//  ELIMINAR
// ===============================

window.confirmarEliminar = function (id) {

    let seguro = confirm("¿Seguro que quieres eliminar esta bicicleta?");

    if (!seguro) return;

    eliminarBici(id);
};

async function eliminarBici(id) {

    await deleteDoc(doc(db, "bicicletas", id));

    mostrarMensaje("Bicicleta eliminada ");

    cargarBicis();
}


// ===============================
//  EDITAR
// ===============================

let idEditar = null;

window.abrirEditar = function(id, nombre, marca, tipo, precio, imagen, descripcion){

    idEditar = id;

    document.getElementById("modalEditar").style.display = "flex";

    document.getElementById("editNombre").value = nombre;
    document.getElementById("editMarca").value = marca;
    document.getElementById("editTipo").value = tipo;
    document.getElementById("editPrecio").value = precio;
    document.getElementById("editImagen").value = imagen;
    document.getElementById("editDescripcion").value = descripcion;
};

window.cerrarModal = function(){
    document.getElementById("modalEditar").style.display = "none";
};

window.guardarCambios = async function(){

    let nombre = document.getElementById("editNombre").value;
    let marca = document.getElementById("editMarca").value;
    let tipo = document.getElementById("editTipo").value;
    let precio = document.getElementById("editPrecio").value;
    let imagen = document.getElementById("editImagen").value;
    let descripcion = document.getElementById("editDescripcion").value;

    // Validación básica
    if (!nombre || !marca || !tipo) {
        mostrarMensaje("Completa los campos");
        return;
    }

    await updateDoc(doc(db, "bicicletas", idEditar), {
        nombre,
        marca,
        tipo,
        precio,
        imagen,
        descripcion
    });

    mostrarMensaje("Bicicleta actualizada ");

    cerrarModal();
    cargarBicis();
};



// ===============================
//  INICIAR
// ===============================

cargarBicis();
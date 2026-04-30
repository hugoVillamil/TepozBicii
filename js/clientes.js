// ===============================
// IMPORTAR FIREBASE
// ===============================

import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


// ===============================
// OBTENER USUARIO
// ===============================

let usuario = JSON.parse(localStorage.getItem("usuario"));

// Si no hay usuario → fuera
if (!usuario) {
    window.location.href = "login.html";
}

// Solo empleados pueden entrar
if (usuario.tipo !== "empleado") {
    alert("No tienes permiso");
    window.location.href = "menu.html";
}


// ===============================
// CARGAR CLIENTES
// ===============================

async function cargarClientes() {

    const querySnapshot = await getDocs(collection(db, "usuarios"));

    let tabla = document.getElementById("tabla-clientes");

    tabla.innerHTML = ""; // limpiar tabla

    querySnapshot.forEach((docu) => {

    let data = docu.data();

    // Solo mostrar clientes
    if (data.tipo === "cliente") {

    tabla.innerHTML += `
        <tr>
            <td>${data.idUsuario}</td>
            <td>${data.nombre}</td>
            <td>${data.apellidos}</td>
            <td>${data.telefono}</td>
            <td>${data.direccion}</td>
            <td>${data.correo}</td>
            <td>${data.password}</td>

            <td>
            <button onclick="eliminar('${docu.id}')" class="btn btn-danger btn-sm">
                Eliminar
            </button>
            </td>
        </tr>
        `;
    }

    });

}


// ===============================
// 🗑 ELIMINAR CLIENTE
// ===============================

window.eliminar = async function (id) {

    let confirmar = confirm("¿Eliminar cliente?");

    if (!confirmar) return;

    await deleteDoc(doc(db, "usuarios", id));

    alert("Cliente eliminado");

  cargarClientes(); // recargar tabla
};


// ===============================
//  INICIAR
// ===============================

cargarClientes();

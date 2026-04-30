import { db } from "./firebase.js";

import {
    collection,
    addDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// 👨‍🔧 Guardar bici
window.guardar = async function () {

    let nombre = document.getElementById("nombre").value;
    let marca = document.getElementById("marca").value;
    let tipo = document.getElementById("tipo").value;
    let precio = document.getElementById("precio").value;
    let imagen = document.getElementById("imagen").value;
    let descripcion = document.getElementById("descripcion").value;

    await addDoc(collection(db, "bicicletas"), {
    nombre,
    marca,
    tipo,
    precio,
    imagen,
    descripcion,
    estado: "disponible"
    });

    alert("Bicicleta agregada ");

    window.location.href = "inventario.html";
};
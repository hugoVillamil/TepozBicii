// ===============================
//  IMPORTAMOS FIREBASE
// ===============================

import { db } from "./firebase.js";

// Funciones para guardar datos
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

console.log("FUNCION EJECUTADA");
// ===============================
//  FUNCIÓN PRINCIPAL
// ===============================

window.guardarMantenimiento = async function () {

    // ===============================
    //  TOMAMOS LOS DATOS DEL FORMULARIO
    // ===============================

    let fecha = document.querySelector('input[type=\"date\"]').value;

    let tipo = document.querySelectorAll('select')[0].value;

    let descripcion = document.querySelectorAll('textarea')[0].value;

    let idBici = document.querySelectorAll('input[type=\"number\"]')[0].value;

    let estado = document.querySelectorAll('select')[1].value;

    let idEmpleado = document.querySelectorAll('input[type=\"number\"]')[1].value;

    let refacciones = document.querySelectorAll('textarea')[1].value;


    // ===============================
    //  VALIDACIÓN (IMPORTANTE)
    // ===============================

    if (!fecha || !descripcion) {
        alert("Completa los campos importantes ");
        return;
    }


    // ===============================
    //  GUARDAR EN FIREBASE
    // ===============================

    try {

        await addDoc(collection(db, "mantenimientos"), {

            // Guardamos todos los datos
            fecha: fecha,
            tipo: tipo,
            descripcion: descripcion,
            id_bicicleta: idBici,
            reparado: estado,
            id_empleado: idEmpleado,
            refacciones: refacciones

        });

        alert("Mantenimiento guardado");

    } catch (error) {

        console.error("Error:", error);

    }

};

// ===============================
// IMPORTAMOS FIREBASE
// ===============================

import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


// ===============================
// FUNCIÓN PARA MENSAJES BONITOS
// ===============================

function mostrarMensaje(texto, tipo = "ok") {

    let toast = document.getElementById("toast");

    // Colocamos el texto
    toast.textContent = texto;

    // Reiniciamos las clases
    toast.className = "toast";

    // Aplicamos color según tipo
    if (tipo === "ok") toast.classList.add("toast-ok");
    if (tipo === "error") toast.classList.add("toast-error");
    if (tipo === "warning") toast.classList.add("toast-warning");

    // Mostrar mensaje
    toast.classList.add("show");

    // Ocultar después de 3 segundos
    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}


// ===============================
// REGISTRAR USUARIO
// ===============================

window.registrar = async function () {

    // Tomamos los datos del formulario
    let nombre = document.getElementById("nombre").value;
    let apellidos = document.getElementById("apellidos").value;
    let telefono = document.getElementById("telefono").value;
    let direccion = document.getElementById("direccion").value;
    let correo = document.getElementById("correo").value;

    let pass = document.getElementById("password").value;
    let pass2 = document.getElementById("password2").value;

    let llave = document.getElementById("llave").value;


    // Validaciones
    if (!nombre || !correo || !pass) {
        mostrarMensaje("Completa los campos", "warning");
        return;
    }

    if (pass !== pass2) {
        mostrarMensaje("Las contraseñas no coinciden", "error");
        return;
    }


    // Validación de llave
    let tipo = "cliente";

    if (llave !== "") {

        if (llave === "T62520") {
            tipo = "empleado";
        } else {
            mostrarMensaje("Llave incorrecta", "error");
            return;
        }

    }


    // Generar ID automático
    const querySnapshot = await getDocs(collection(db, "usuarios"));

    let nuevoId = 260401;

    if (!querySnapshot.empty) {

        let ultimoId = 260400;

        querySnapshot.forEach((docu) => {
            let data = docu.data();

            if (data.idUsuario && data.idUsuario > ultimoId) {
                ultimoId = data.idUsuario;
            }
        });

        nuevoId = ultimoId + 1;
    }


    // Guardar en Firebase
    await addDoc(collection(db, "usuarios"), {
        idUsuario: nuevoId,
        nombre,
        apellidos,
        telefono,
        direccion,
        correo,
        password: pass,
        tipo,
        llave
    });

    mostrarMensaje("Usuario registrado correctamente", "ok");

    // Esperar antes de ir al login
    setTimeout(() => {
        window.location.href = "login.html";
    }, 3000);
};



// ===============================
// LOGIN
// ===============================

window.login = async function () {

    // Tomamos correo y contraseña
    let correo = document.getElementById("correo").value;
    let pass = document.getElementById("password").value;

    // Buscar usuario en Firebase
    const q = query(
        collection(db, "usuarios"),
        where("correo", "==", correo),
        where("password", "==", pass)
    );

    const querySnapshot = await getDocs(q);

    // Si no existe
    if (querySnapshot.empty) {
        mostrarMensaje("Usuario incorrecto", "error");
        return;
    }

    // Guardamos sesión
    let usuario = querySnapshot.docs[0].data();

    localStorage.setItem("usuario", JSON.stringify(usuario));

    // Mensaje de bienvenida
    mostrarMensaje("Bienvenido " + usuario.nombre, "ok");

    // Esperar antes de entrar al menú
    setTimeout(() => {
        window.location.href = "menu.html";
    }, 2500);
};
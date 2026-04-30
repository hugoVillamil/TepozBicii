// ===============================
// IMPORTAR FIREBASE
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
// VARIABLES GLOBALES
// ===============================

let rentaActual = null;
let biciActual = null;


// ===============================
// CARGAR RENTAS
// ===============================

async function cargarRentas(){

    let contenedor = document.getElementById("contenedor-rentas");
    contenedor.innerHTML = "";

    // Traer todas las rentas
    const querySnapshot = await getDocs(collection(db,"rentas"));

    querySnapshot.forEach((docu)=>{

        let data = docu.data();

        contenedor.innerHTML += `
        <div class="card-renta">

            <h3>Cliente: ${data.cliente}</h3>
            <p>Bicicleta: ${data.bicicleta}</p>
            <p>Horas: ${data.horas}</p>
            <p>Total: $${data.total}</p>
            <p>Estado: ${data.estado}</p>

            <!-- Mostrar retraso -->
            <p>Retraso: ${data.retraso || "Sin registro"}</p>

            <!-- Mostrar penalización -->
            <p>Penalización: $${data.penalizacion || 0}</p>

            ${
                data.estado !== "devuelta"
                ? `
                <button onclick="devolver('${docu.id}','${data.idBicicleta}')" class="btn-warning">
                    Devolver
                </button>

                <button onclick="eliminar('${docu.id}')" class="btn-danger">
                    Eliminar
                </button>
                `
                : `<p style="color:lightgreen;">Entrega finalizada</p>`
            }

        </div>
        `;
    });
}


// ===============================
// ABRIR MODAL
// ===============================

window.devolver = function(id, bicicletaId){
    rentaActual = id;
    biciActual = bicicletaId;

    document.getElementById("modalPregunta").style.display = "flex";
};


// ===============================
// CERRAR MODAL
// ===============================

window.cerrarModal = function(){
    document.getElementById("modalPregunta").style.display = "none";
    document.getElementById("modalPenalizacion").style.display = "none";
};


// ===============================
// DEVOLVER SIN RETRASO
// ===============================

window.sinRetraso = async function(){

    // Cambiar renta
    await updateDoc(doc(db,"rentas",rentaActual),{
        estado:"devuelta",
        retraso:"Entregó a tiempo",
        penalizacion:0
    });

    // Cambiar bicicleta
    await updateDoc(doc(db,"bicicletas",biciActual),{
        estado:"disponible"
    });

    cerrarModal();

    mostrarMensaje("Bicicleta devuelta correctamente");

    setTimeout(()=>{
        cargarRentas();
    },1000);
};


// ===============================
// MOSTRAR FORMULARIO PENALIZACIÓN
// ===============================

window.mostrarPenalizacion = function(){

    document.getElementById("modalPregunta").style.display = "none";
    document.getElementById("modalPenalizacion").style.display = "flex";
};


// ===============================
// CALCULAR COSTO
// ===============================

window.calcularCosto = function(){

    let horas = Number(document.getElementById("horasExtra").value);

    let costo = horas * 20;

    document.getElementById("costoRetraso").value = "$" + costo;
};


// ===============================
// APLICAR PENALIZACIÓN
// ===============================

window.aplicarPenalizacion = async function(){

    let horas = Number(document.getElementById("horasExtra").value);

    let penalizacion = horas * 20;

    // Actualizar renta
    await updateDoc(doc(db,"rentas",rentaActual),{
        estado:"devuelta",
        retraso:"Entregó con retraso",
        horasExtra: horas,
        penalizacion: penalizacion
    });

    // Cambiar bicicleta
    await updateDoc(doc(db,"bicicletas",biciActual),{
        estado:"disponible"
    });

    cerrarModal();

    mostrarMensaje("Devuelta con penalización $" + penalizacion);

    setTimeout(()=>{
        cargarRentas();
    },1000);
};


// ===============================
// ELIMINAR RENTA
// ===============================

window.eliminar = async function(id){

    let seguro = confirm("¿Eliminar renta?");

    if(!seguro) return;

    await deleteDoc(doc(db,"rentas",id));

    mostrarMensaje("Renta eliminada");

    cargarRentas();
};


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

cargarRentas();
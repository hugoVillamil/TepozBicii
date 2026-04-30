// ===============================
// IMPORTAMOS FIREBASE (MODERNO)
// ===============================

// Estas líneas traen las herramientas de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


// ===============================
//  CONFIGURACIÓN DE TU PROYECTO
// ===============================

//  Aquí pegas los datos que te da Firebase
const firebaseConfig = {
apiKey: "AIzaSyBn1P-lRM-yXgL1yY6mTlMDdVHJqlKkyoo",
authDomain: "primerproyecto-a4880.firebaseapp.com",
databaseURL: "https://primerproyecto-a4880-default-rtdb.firebaseio.com",
projectId: "primerproyecto-a4880",
storageBucket: "primerproyecto-a4880.firebasestorage.app",
messagingSenderId: "795828370125",
appId: "1:795828370125:web:b6ea63508dea09727c4784",
measurementId: "G-BYD4LV9R3K"
};


// ===============================
//  INICIAR FIREBASE
// ===============================

// Creamos la app de Firebase
const app = initializeApp(firebaseConfig);

// Creamos la conexión a la base de datos
const db = getFirestore(app);


// ===============================
//  EXPORTAR PARA USAR EN OTROS JS
// ===============================

// Esto permite usar "db" en otros archivos
export { db };

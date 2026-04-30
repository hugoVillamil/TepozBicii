// ===============================
//  OBTENER USUARIO
// ===============================

let usuario = JSON.parse(localStorage.getItem("usuario"));


// ===============================
//  PROTECCIÓN
// ===============================

if (!usuario) {
window.location.href = "login.html";
}

// ===============================
//  LOGOUT
// ===============================

window.logout = function () {
localStorage.removeItem("usuario");
window.location.href = "login.html";
};


// ===============================
//  OCULTAR MENÚ SI ES CLIENTE
// ===============================

if (usuario.tipo === "cliente") {

document.getElementById("menu-clientes").style.display = "none";
document.getElementById("menu-empleados").style.display = "none";
document.getElementById("menu-renta").style.display = "none";
document.getElementById("menu-mantenimiento").style.display = "none";

}

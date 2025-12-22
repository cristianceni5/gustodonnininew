const utentiReg = ["ceni", "aurora", "selma", "ginevra", "asia", "alessia", "marco"];
const passwordCorretta = "gusto";


document.getElementById("accedi").addEventListener("click", function (e) {
    e.preventDefault()
    const nomeUtente = document.getElementById("username-utente").value.trim().toLowerCase();
    const passwordUtente = document.getElementById("pass-utente").value;

    if (utentiReg.includes(nomeUtente) && passwordUtente == passwordCorretta) {
        localStorage.setItem("utenteLoggato", nomeUtente);
        window.location.href = "menu-staff.html";
    }
    else {
        alert("Credenziali non corrette");
    }
});

document.getElementById("cred-dim").addEventListener("click", function (e) {
    alert("Contatta lo sviluppatore");
});

window.onload = function () {
    if (localStorage.getItem("utenteLoggato")) {
        window.location.href = "menu-staff.html";
    }
}
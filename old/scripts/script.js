//Developed by Cristian Ceni 2025, all the rights are reserved
let order = [];


//ANIMAZIONE SCROLL, TEMI
/////////////////////////////////////////////////////////////////////////////////////////

function animateOnScroll() {
    // Seleziona solo gli elementi da animare (escludendo il carrello)
    const elementsToAnimate = [
        '.menu-section',
        '.container',
        '.sec-div',
        '.social-box',
        '.theme-selector'
    ].join(',');

    const elements = document.querySelectorAll(elementsToAnimate);
    const windowHeight = window.innerHeight;
    const triggerOffset = windowHeight * 0.8;

    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        if (elementPosition < triggerOffset) {
            element.classList.add('animate-in');
        }
    });
}

//Gestione iniziale e allo scroll
document.addEventListener('DOMContentLoaded', () => {
    animateOnScroll(); // Animazione elementi già visibili al caricamento
    window.addEventListener('scroll', animateOnScroll);
});

//Gestione temi
document.addEventListener('DOMContentLoaded', function () {
    const themeOptions = document.querySelectorAll('.theme-option');
    const savedTheme = localStorage.getItem('theme') || 'classic';

    // Applica tema salvato
    applyTheme(savedTheme);

    themeOptions.forEach(option => {
        option.addEventListener('click', function () {
            const theme = this.getAttribute('data-theme');
            applyTheme(theme);
            localStorage.setItem('theme', theme);
        });
    });

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);

        // Aggiorna selezione visiva
        themeOptions.forEach(opt => {
            opt.classList.remove('active');
            if (opt.getAttribute('data-theme') === theme) {
                opt.classList.add('active');
            }
        });
    }
});

//GENERAZIONE MENU
/////////////////////////////////////////////////////////////////////////////////////////

function generateMenu() {
    menu.sort((a, b) => (a.categoria === "Legenda Allergeni" ? 1 : b.categoria === "Legenda Allergeni" ? -1 : 0));

    const menuContainer = document.getElementById("menu-container");
    menuContainer.innerHTML = "";


    menu.forEach(section => {
        var pagina = location.pathname.split("/").slice(-1)
        const sectionDiv = document.createElement("div");
        sectionDiv.classList.add("menu-section");

        if (section.categoria === "Legenda Allergeni") {
            sectionDiv.classList.add("allergen-section");
        }

        const button = document.createElement("button");
        button.classList.add("menu-toggle");
        button.innerHTML = `${section.categoria}`;
        button.addEventListener("click", () => {
            const isOpen = categoryDiv.classList.contains("show");

            // Chiudi tutte le sezioni
            document.querySelectorAll(".menu-category").forEach(div => {
                div.classList.remove("show");
                if (div.previousElementSibling) {
                    div.previousElementSibling.classList.remove("active-toggle");
                }
            });

            // Sezione cliccata: apri e scrolla
            if (!isOpen) {
                categoryDiv.classList.add("show");
                button.classList.add("active-toggle");

                // Scrolla in modo fluido alla sezione
                setTimeout(() => {
                    button.scrollIntoView({ behavior: "smooth", block: "start" });
                }, 100);
            }
        });

        const categoryDiv = document.createElement("div");

        categoryDiv.classList.add("menu-category", "hidden");


        if (section.categoria === "Legenda Allergeni") { //Modificare qui per gli allergeni. Ricorda <!> anche nel CSS
            categoryDiv.innerHTML = `
                <div class="allergen-legend">
                    <div class="allergen-container"><span class="allergen-dot glutine"></span> Glutine</div>
                    <div class="allergen-container"><span class="allergen-dot latte"></span> Lattosio</div>
                    <div class="allergen-container"><span class="allergen-dot uova"></span> Uova</div>
                    <div class="allergen-container"><span class="allergen-dot pesce"></span> Pesce</div>
                    <div class="allergen-container"><span class="allergen-dot soia"></span> Soia</div>
                    <div class="allergen-container"><span class="allergen-dot arachidi"></span> Arachidi</div>
                    <div class="allergen-container"><span class="allergen-dot anidride"></span> Anidride solforosa</div>
                    <div class="allergen-container"><span class="allergen-dot lupini"></span> Lupini</div>
                    <div class="allergen-container"><span class="allergen-dot molluschi"></span> Molluschi</div>
                    <div class="allergen-container"><span class="allergen-dot crostacei"></span> Crostacei</div>
                    <div class="allergen-container"><span class="allergen-dot sedano"></span> Sedano</div>
                    <div class="allergen-container"><span class="allergen-dot semisesamo"></span> Semi di sesamo</div>
                    <div class="allergen-container"><span class="allergen-dot senape"></span> Senape</div>
                    <div class="allergen-container"><span class="allergen-dot fruttaguscio"></span> Frutta a guscio</div>
                    <div class="allergen-container"><span class="allergen-dot piccante"></span> Piccante</div>
                </div>
            `;
        } else {
            section.prodotti.forEach(prodotto => {
                const itemDiv = document.createElement("div");

                if (pagina == "menu-staff.html") {
                    itemDiv.classList.add("menu-item-staff");
                }
                else {
                    itemDiv.classList.add("menu-item");
                }

                itemDiv.style.backgroundImage = `url(${prodotto.immagine})`;

                itemDiv.innerHTML = `
                    <br>
                    <span class="allergen-container">
                        ${prodotto.allergeni.map(all => `<span class="allergen-dot ${all}"></span>`).join("")}
                    </span>
                `;

                const infoDiv = document.createElement("div");
                infoDiv.classList.add("info");

                itemDiv.addEventListener("click", (e) => {

                    if (e.target.closest('.gluten-option')) {
                        return;
                    }

                    //Pizza personalizzata
                    if (prodotto.nome === "Personalizzata") {
                        openCustomPizzaModal("");
                        return;
                    }

                    //Calzone personalizzato
                    if (prodotto.nome == "Personalizzato") {
                        openCustomPizzaModal("calzone");
                        return;
                    }

                    //Gin Tonic personalizzato
                    if (prodotto.nome === "Gin Tonic") {
                        openBevandaModal("gin");
                        return;
                    }

                    //Vino personalizzato
                    if (prodotto.nome === "Vino (bottiglia, calice)") {
                        openBevandaModal("vino");
                        return;
                    }


                    let prezzoFinale = prodotto.prezzo;
                    let nomeProdotto = prodotto.nome;
                    let categoriaProdotto = section.categoria;

                    const glutenCheckbox = itemDiv.querySelector(".gluten-free-checkbox");
                    if (glutenCheckbox && glutenCheckbox.checked) {
                        prezzoFinale += 1;
                        nomeProdotto += " (senza glutine)";
                    }

                    addToOrder(nomeProdotto, prezzoFinale, categoriaProdotto);
                });

                document.addEventListener('click', function (e) {
                    const glutenOption = e.target.closest('.gluten-option');
                    if (glutenOption) {
                        e.stopPropagation();
                        const checkbox = glutenOption.querySelector('.gluten-free-checkbox');
                        checkbox.checked = !checkbox.checked;
                        glutenOption.classList.toggle('selected', checkbox.checked);
                        return;
                    }
                });

                //Nel menù dello staff non serve la descrizione
                if (pagina == "menu-staff.html") {
                    infoDiv.innerHTML = `
                    <p> 
                        ${prodotto.nome}<br> 
                        <b>€${prodotto.prezzo.toFixed(2)}</b>
                    </p>
                    ${section.categoria.includes("Pizze") && prodotto.allergeni.includes("glutine") ? `
                    <div class="gluten-option">
                        <input type="checkbox" class="gluten-free-checkbox" readonly tabindex="-1">
                        <p style="font-size: 8px">Senza glutine <b>1€</b></p>
                    </div>
                    ` : ""}
                `;
                }
                else {
                    infoDiv.innerHTML = `
                    <p> 
                        ${prodotto.nome}<br> 
                        ${prodotto.descrizione ? `<p style="font-size: 7.5px; font-weight: 200;">${prodotto.descrizione}</p>` : ""}
                        <b>€${prodotto.prezzo.toFixed(2)}</b>
                    </p>
                    ${section.categoria.includes("Pizze") && prodotto.allergeni.includes("glutine") ? `
                    <div class="gluten-option">
                        <input type="checkbox" class="gluten-free-checkbox" readonly tabindex="-1">
                        <p style="font-size: 12px">Senza glutine <b>1€</b></p>
                    </div>
                    ` : ""}
                `;
                }

                itemDiv.appendChild(infoDiv);
                categoryDiv.appendChild(itemDiv);
            });
        }

        sectionDiv.appendChild(button);
        sectionDiv.appendChild(categoryDiv);
        menuContainer.appendChild(sectionDiv);
    });
}

//CARRELLO, LISTA ORDINE
/////////////////////////////////////////////////////////////////////////////////////////

//Aggiorna il carrello
function updateOrderList() {
    const orderList = document.getElementById("order-list");
    const totalPrice = document.getElementById("total-price");
    orderList.innerHTML = "";

    let total = 0;

    order.forEach((entry, index) => {
        const li = document.createElement("li");
        li.classList.add("order-item");
        if (index % 2 === 0) {
            li.classList.add("even");
        } else {
            li.classList.add("odd");
        }

        li.innerHTML = `
            <span class="order-product-name">${entry.item}: <b>€${entry.price.toFixed(2)}</b></span>
            <button onclick="removeFromOrder(${index})" class="button-remove">
                <img src="img/icone e loghi/remove.png" alt="Rimuovi" class="butt-img"> Elimina
            </button>
        `;

        orderList.appendChild(li);
        total += entry.price;
    });

    totalPrice.textContent = total.toFixed(2);
}

//Clicca carrello per andare nella sezione carrello
document.getElementById("cart").addEventListener("click", function () {
    const orderSection = document.getElementById("riepilogo-ordine");
    if (orderSection) {
        orderSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
});

document.addEventListener("DOMContentLoaded", generateMenu);

//Aggiorna conteggio carrello
function updateCartCount() {
    document.getElementById("cart").textContent = order.length;
}

//Metti nel carrello
function addToOrder(item, price, categoria = "Altro") {
    order.push({ item, price, categoria });
    updateOrderList();
    updateCartCount();

    // Resetta il toggle senza glutine dopo l'ordinazione
    document.querySelectorAll('.gluten-option').forEach(div => {
        const checkbox = div.querySelector('.gluten-free-checkbox');
        checkbox.checked = false;
        div.classList.remove('selected');
    });
}

//Rimuovi dal carrello
function removeFromOrder(index) {
    order.splice(index, 1);
    updateOrderList();
    updateCartCount();
}

//ANIMAZIONI PULSANTI
/////////////////////////////////////////////////////////////////////////////////////////

//Animazioni click
function addButtonClickAnimation() {
    document.querySelectorAll("button, .menu-item, .menu-item-staff").forEach(element => {
        element.addEventListener("click", (event) => {
            // Ignora completamente i click sul gluten-option
            if (event.target.closest('.gluten-option')) {
                return;
            }

            element.classList.add("animate__animated", "animate__pulse");
            element.addEventListener("animationend", () => {
                element.classList.remove("animate__animated", "animate__pulse");
            }, { once: true });
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    generateMenu();
    addButtonClickAnimation();
    /* Funzione salva cognome - rimossa esigenze di Marco DHNNNN
    const savedCognome = localStorage.getItem("cognomeCliente");
        if (savedCognome) {
            document.getElementById("cognome-cliente").value = savedCognome;
        }
            */
});

//SEZIONE PERSONALIZZAZIONE PIZZE
/////////////////////////////////////////////////////////////////////////////////////////

//Apertura sezione personalizzazione
function openCustomPizzaModal(baseForzata = null) {
    //Var del div modal
    const modal = document.getElementById("custom-pizza-modal");
    //Var del div cart
    const cart = document.getElementById("cart");
    //Abilito display
    modal.style.display = "flex";

    //Disabilito il carrello sennò si incrisa anche l'ostia
    cart.style.pointerEvents = "none";
    cart.style.opacity = "0.1";

    const baseSelect = document.getElementById("base-pizza");

    if (baseForzata) {
        baseSelect.value = baseForzata;
        baseSelect.disabled = true;
    } else {
        baseSelect.disabled = false;
        baseSelect.value = "covaccino";
    }

    // Reset per sicurezza
    modal.querySelector(".modal-content").classList.remove("animate__zoomOut");

    // Animazione ingresso
    setTimeout(() => {
        modal.querySelector(".modal-content").classList.add("animate__animated", "animate__zoomIn");
    }, 10);

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    //iOS che scassa la minchia
    document.body.style.width = "100%";
}

//Chiusura sezione personalizzazione
function closeCustomPizzaModal() {
    const modal = document.getElementById("custom-pizza-modal");
    const modalContent = modal.querySelector(".modal-content");
    const cart = document.getElementById("cart");

    // Ripristino il carrello
    cart.style.pointerEvents = "auto";
    cart.style.opacity = "1";

    // Aggiunge animazione di uscita sia al contenuto che al container
    modal.classList.remove("animate__fadeIn"); // se c'è
    modal.classList.add("animate__animated", "animate__fadeOut");

    modalContent.classList.remove("animate__zoomIn");
    modalContent.classList.add("animate__animated", "animate__zoomOut");

    // Una volta terminata l'animazione, nasconde tutto
    modalContent.addEventListener('animationend', () => {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
        document.documentElement.style.overflow = "auto";
        //Sempre iOS che rompe il cazzo lui e webkit dhn
        document.body.style.width = "";

        // Pulizia classi per il prossimo utilizzo
        modal.classList.remove("animate__animated", "animate__fadeOut");
        modalContent.classList.remove("animate__animated", "animate__zoomOut");
    }, { once: true });
}

document.getElementById("esc-pers").addEventListener("click", function () {
    closeCustomPizzaModal();
});

//Aggiunta pizza personalizzata
document.getElementById("add-pers").addEventListener("click", function () {
    const base = document.getElementById("base-pizza").value;
    const extra = document.getElementById("extra-ingredienti").value.trim();
    const quantity = parseInt(document.getElementById("pizza-quantity").value) || 1;
    const glutenCheckbox = document.getElementById("gluten-freeid");

    let prezzoBase = 6.00;
    let nome = `Personalizzata ${base}`;
    let categoria = "Pizze";

    if (base === "calzone") {
        prezzoBase = 8.50;
        nome = "Personalizzato";
        categoria = "Calzoni";
    } else if (base === "covaccino") {
        prezzoBase = 5;
        nome = "Covaccino";
    }

    if (extra) {
        const paroleValide = extra.match(/\b(?!e\b)[a-zàèéìòù']+\b/gi) || [];
        const extraCosto = paroleValide.length * 1;
        prezzoBase += extraCosto;
        nome += ` con ${extra}`;
    }

    if (glutenCheckbox && glutenCheckbox.checked) {
        prezzoBase += 1;
        nome += " (senza glutine)";
    }

    const totale = prezzoBase * quantity;

    addToOrder(`${nome} x${quantity}`, totale, categoria);
    closeCustomPizzaModal();

    // Reset campi
    document.getElementById("pizza-quantity").value = 1;
    document.getElementById("extra-ingredienti").value = "";
    glutenCheckbox.checked = false;
    glutenCheckbox.closest('.gluten-option').classList.remove('selected');
});

// SEZIONE PERSONALIZZAZIONE BEVANDE (GIN, VINO ecc.)
/////////////////////////////////////////////////////////////////////////////////////////

function openBevandaModal(tipo) {
    const modal = document.getElementById("custom-bevanda-modal");
    const contenuto = document.getElementById("bevanda-opzioni");
    const titolo = document.getElementById("bevanda-titolo");

    contenuto.innerHTML = "";
    let html = "";
    let categoria = "";
    titolo.textContent = "Personalizzazione";

    if (tipo === "gin") {
        categoria = "Gin Tonic";
        titolo.textContent = "Scegli il Gin";
        html = `
      <label for="gin-select">Tipo di Gin:</label>
      <select id="gin-select">
        <option value="Tanquerail|5">Tanquerail - €5.00</option>
        <option value="Bombay|6">Bombay - €6.00</option>
        <option value="Gin Mare|7">Gin Mare - €7.00</option>
        <option value="Selvapura|7">Selvapura - €7.00</option>
        <option value="Gin Vallombrosa|8">Gin Vallombrosa - €8.00</option>
        <option value="Ginepraio|7.5">Ginepraio - €7.50</option>
        <option value="Num 3|7.5">Num 3 - €7.50</option>
      </select>
    `;
    } else if (tipo === "vino") {
        categoria = "Vini";
        titolo.textContent = "Scegli il Vino";
        html = `
      <label for="formato-vino">Formato:</label>
      <select id="formato-vino">
        <option value="Calice|3.5">Calice - €3.50</option>
        <option value="Bottiglia|15">Bottiglia - €15.00</option>
      </select>

      <label for="colore-vino">Tipo:</label>
      <select id="colore-vino">
        <option value="Rosso">Rosso</option>
        <option value="Bianco">Bianco</option>
        <option value="Rosé">Rosé</option>
        <option value="Prosecco">Prosecco</option>
      </select>
    `;
    }

    contenuto.innerHTML = html;

    modal.dataset.categoria = categoria;
    modal.dataset.tipo = tipo;

    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
}

function chiudiBevandaModal() {
    const modal = document.getElementById("custom-bevanda-modal");
    modal.style.display = "none";
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";
}

document.getElementById("esc-bevanda").addEventListener("click", chiudiBevandaModal);

document.getElementById("add-bevanda").addEventListener("click", function () {
    const modal = document.getElementById("custom-bevanda-modal");
    const tipo = modal.dataset.tipo;
    const categoria = modal.dataset.categoria;
    let nome = "";
    let prezzo = 0;

    if (tipo === "gin") {
        const valore = document.getElementById("gin-select").value;
        const [nomeGin, costo] = valore.split("|");
        nome = `Gin Tonic con ${nomeGin}`;
        prezzo = parseFloat(costo);
    } else if (tipo === "vino") {
        const formatoValore = document.getElementById("formato-vino").value;
        const colore = document.getElementById("colore-vino").value;
        const [formato, costo] = formatoValore.split("|");
        nome = `${formato} di vino ${colore}`;
        prezzo = parseFloat(costo);
    }

    addToOrder(nome, prezzo, categoria);
    chiudiBevandaModal();
});

//INVIO DELL'ORDINE SU WHATSAPP
/////////////////////////////////////////////////////////////////////////////////////////

//Invia ordine su WhatsApp
document.getElementById("send-order").addEventListener("click", function () {
    const tableNumber = document.getElementById("table-number").value;
    const coperto = document.getElementById("coperto").value;
    const orderNotes = document.getElementById("order-notes").value.trim();
    const cognomeCliente = document.getElementById("cognome-cliente").value.trim();
    localStorage.setItem("cognomeCliente", cognomeCliente);

    if (!tableNumber) {
        alert("Inserisci il numero del tavolo.");
        return;
    }
    if (!coperto) {
        alert("Inserisci il numero di persone per il coperto.");
        return;
    }
    if (order.length === 0) {
        alert("Non hai selezionato alcun piatto.");
        return;
    }

    let total = order.reduce((sum, entry) => sum + entry.price, 0);
    let message = `*Ordine per il tavolo:* ${tableNumber}%0A`;
    if (cognomeCliente) {
        message += `*Cliente:* ${cognomeCliente}%0A`;
    }
    message += `*Coperti:* ${coperto}%0A%0A`;

    // Raggruppa per categoria salvata
    const ordiniPerCategoria = {};
    order.forEach(entry => {
        const categoria = entry.categoria || "Altro";
        if (!ordiniPerCategoria[categoria]) {
            ordiniPerCategoria[categoria] = [];
        }
        ordiniPerCategoria[categoria].push(entry);
    });

    // Costruzione messaggio WhatsApp
    for (let categoria in ordiniPerCategoria) {
        message += `*${categoria}*%0A`;
        ordiniPerCategoria[categoria].forEach(entry => {
            let nome = entry.item;
            message += `- ${nome}: €${entry.price.toFixed(2)}%0A`;
        });
        message += `%0A`;
    }

    if (orderNotes) {
        message += `*Note:* ${orderNotes}%0A`;
    }

    message += `%0A*Totale:* €${total.toFixed(2)}%0A`;

    const phoneNumber = "393473118588";
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappURL, "_blank");

    callResetPagina();
});

//RESET
/////////////////////////////////////////////////////////////////////////////////////////
function resetPagina() {
    window.location.reload();
}

function callResetPagina() {
    const orderSection = document.getElementById("up-page");
    if (orderSection) {
        orderSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    window.setTimeout(resetPagina, 1000);
}


document.getElementById("reset-order").addEventListener("click", function () {
    callResetPagina();
});

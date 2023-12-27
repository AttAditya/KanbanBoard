var currentFilter = "all";

function reloadPage() {
    document.getElementById("loader").classList.remove("off");
    document.getElementById("loader").animate([
        {left: "-100%"},
        {left: "0"}
    ], {
        duration: 1000,
        easing: "ease-in-out"
    });

    setTimeout(() => {
        window.location.reload();
    }, 1000);
}

function loadTheme() {
    Array.from(document.querySelector(":root").classList).forEach(className => {
        if (className.startsWith("theme-")) {
            document.querySelector(":root").classList.remove(className);
        }
    });
    
    let theme = localStorage.getItem("theme");
    
    if (!theme) {
        localStorage.setItem("theme", "light");
        theme = "light";
    }

    document.querySelector(":root").classList.add(`theme-${theme}`);

    if (theme == "light") {
        document.querySelector(".theme-icon").classList.add("fa-sun");
        document.querySelector(".theme-icon").classList.remove("fa-moon");
    } else if (theme == "dark") {
        document.querySelector(".theme-icon").classList.add("fa-moon");
        document.querySelector(".theme-icon").classList.remove("fa-sun");
    }
}

function toggleTheme() {
    let theme = localStorage.getItem("theme");

    if (theme == "light") {
        localStorage.setItem("theme", "dark");
    } else {
        localStorage.setItem("theme", "light");
    }

    loadTheme();
}

function loadData() {
    let data = JSON.parse(localStorage.getItem("data")) || [];

    data.forEach(card => {
        addCard(card.id, card.content, card.color, card.locked, card.column, false);
    });
}

function saveCardData(card_id, content, color) {
    let data = JSON.parse(localStorage.getItem("data")) || [];

    data.push({
        id: card_id,
        content: content,
        color: color,
        locked: false,
        column: null
    });

    localStorage.setItem("data", JSON.stringify(data));
}

function removeData(card_id) {
    let data = JSON.parse(localStorage.getItem("data")) || [];

    data = data.filter(card => card.id != card_id);

    localStorage.setItem("data", JSON.stringify(data));
}

function swapColorData(card_id) {
    let data = JSON.parse(localStorage.getItem("data")) || [];

    data.forEach(card => {
        if (card.id == card_id) {
            card.color = Number(card.color) + 1;
            if (card.color > 4) {
                card.color = 1;
            }
        }
    });

    localStorage.setItem("data", JSON.stringify(data));
}

function lockCardData(card_id) {
    let data = JSON.parse(localStorage.getItem("data")) || [];

    data.forEach(card => {
        if (card.id == card_id) {
            card.locked = true;
        }
    });

    localStorage.setItem("data", JSON.stringify(data));
}

function unlockCardData(card_id) {
    let data = JSON.parse(localStorage.getItem("data")) || [];

    data.forEach(card => {
        if (card.id == card_id) {
            card.locked = false;
        }
    });

    localStorage.setItem("data", JSON.stringify(data));
}

function putCardInColumn(card_id, column) {
    let data = JSON.parse(localStorage.getItem("data")) || [];
    let temp = null;

    data.forEach(card => {
        if (card.id == card_id) {
            card.column = column;
            temp = card;
        }
    });

    data = data.filter(card => card.id != card_id);
    data.unshift(temp);

    localStorage.setItem("data", JSON.stringify(data));
}

function generateID(length) {
    let id = "";
    let characters = "abcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < length; i++) {
        id += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return id;
}

function addCard(card_id, content, color, locked, column, animate) {
    let cards_container = document.getElementById("cards");
    let card = document.createElement("div");

    if (column) {
        cards_container = document.getElementById(`card-column-${column}`);
    }

    let card_buttons = `
        <button class="card-button" onclick="lockCard('${card_id}');">
            <i class="fa-solid fa-lock-open"></i>

            <span class="tooltip">
                Lock card
            </span>
        </button>

        <button class="card-button" onclick="swapColor('${card_id}');">
            <i class="fa-solid fa-rotate"></i>

            <span class="tooltip">
                Swap color
            </span>
        </button>
        
        <button class="card-button" onclick="removeCard('${card_id}');">
            <i class="fa-solid fa-trash"></i>

            <span class="tooltip">
                Remove card
            </span>
        </button>
    `;

    if (locked) {
        card_buttons = `
            <button class="card-button" onclick="unlockCard('${card_id}');">
                <i class="fa-solid fa-lock"></i>

                <span class="tooltip">
                    Unlock card
                </span>
            </button>
        `;
    }
    
    card.innerHTML = `
        <div class="card-header bg-color-${color}">
            <div class="card-id">
                #${card_id}
            </div>

            <div class="card-buttons">
                ${card_buttons}
            </div>
        </div>

        <div class="card-content">
            ${content}
        </div>
    `;

    card.id = `card-${card_id}`;
    card.classList.add("card");

    cards_container.appendChild(card);

    if (animate) {
        card.animate([
            {transform: "scale(0)"},
            {transform: "scale(1)"}
        ], {
            duration: 200,
            easing: "ease-in-out"
        });
    }
}

function removeCard(card_id) {
    removeData(card_id);
    
    let card = document.getElementById(`card-${card_id}`);
    card.animate([
        {transform: "scale(1)"},
        {transform: "scale(0)"}
    ], {
        duration: 200,
        easing: "ease-in-out"
    });

    setTimeout(() => {
        card.remove();
    }, 180);
}

function swapColor(card_id) {
    if (currentFilter != "all") {
        removeColorFilters();
    }
    
    let card = document.getElementById(`card-${card_id}`);
    let card_header = card.querySelector(".card-header");
    let color = Array.from(card_header.classList).find(className => className.startsWith("bg-color-")).split("-")[2];

    card_header.classList.remove(`bg-color-${color}`);

    color = Number(color) + 1;
    if (color > 4) {
        color = 1;
    }

    card_header.classList.add(`bg-color-${color}`);

    swapColorData(card_id);
}

function lockCard(card_id) {
    let card = document.getElementById(`card-${card_id}`);
    let card_buttons = card.querySelector(".card-buttons");

    card_buttons.animate([
        {transform: "scale(1)"},
        {transform: "scale(0)"}
    ], {
        duration: 200,
        easing: "ease-in-out"
    });

    setTimeout(() => {
        Array.from(card_buttons.children).forEach(card_button => {
            card_button.remove();
        });

        let unlockButton = document.createElement("button");
        unlockButton.classList.add("card-button");
        unlockButton.onclick = () => unlockCard(card_id);

        unlockButton.innerHTML = `
            <i class="fa-solid fa-lock"></i>
        `;

        card_buttons.appendChild(unlockButton);

        unlockButton.animate([
            {transform: "scale(0)"},
            {transform: "scale(1)"}
        ], {
            duration: 200,
            easing: "ease-in-out"
        });
    }, 200);

    lockCardData(card_id);
}

function unlockCard(card_id) {
    let card = document.getElementById(`card-${card_id}`);
    let card_buttons = card.querySelector(".card-buttons");

    card_buttons.animate([
        {transform: "scale(1)"},
        {transform: "scale(0)"}
    ], {
        duration: 200,
        easing: "ease-in-out"
    });

    setTimeout(() => {
        Array.from(card_buttons.children).forEach(card_button => {
            card_button.remove();
        });

        let lockButton = document.createElement("button");
        lockButton.classList.add("card-button");
        lockButton.onclick = () => lockCard(card_id);

        let swapColorButton = document.createElement("button");
        swapColorButton.classList.add("card-button");
        swapColorButton.onclick = () => swapColor(card_id);

        swapColorButton.innerHTML = `
            <i class="fa-solid fa-rotate"></i>
        `;

        let removeCardButton = document.createElement("button");

        removeCardButton.classList.add("card-button");
        removeCardButton.onclick = () => removeCard(card_id);

        removeCardButton.innerHTML = `
            <i class="fa-solid fa-trash"></i>
        `;


        lockButton.innerHTML = `
            <i class="fa-solid fa-lock-open"></i>
        `;

        card_buttons.appendChild(lockButton);
        card_buttons.appendChild(swapColorButton);
        card_buttons.appendChild(removeCardButton);

        Array.from(card_buttons.children).forEach(card_button => {
            card_button.animate([
                {transform: "scale(0)"},
                {transform: "scale(1)"}
            ], {
                duration: 200,
                easing: "ease-in-out"
            });
        })
    }, 200);

    unlockCardData(card_id);
}

function removeColorFilters() {
    currentFilter = "all";

    let cards = Array.from(document.getElementsByClassName("card"));

    setTimeout(() => {
        cards.forEach(card => {
            card.style.width = "100%";

            if (card.parentElement.classList.contains("cards")) {
                card.style.margin = "0 1rem 2rem 1rem";
            }
        });
    }, 200);
}

function lockAllCards() {
    let cards = Array.from(document.getElementsByClassName("card"));

    cards.forEach(card => {
        let card_id = card.id.split("-")[1];

        if (card.querySelector(".fa-lock-open")) {
            lockCard(card_id);
        }
    });
}

function unlockAllCards() {
    let cards = Array.from(document.getElementsByClassName("card"));

    cards.forEach(card => {
        let card_id = card.id.split("-")[1];
        
        if (card.querySelector(".fa-lock")) {
            unlockCard(card_id);
        }
    });
}

function deleteAllCards() {
    let cards = Array.from(document.getElementsByClassName("card"));

    cards.forEach(card => {
        if (card.querySelector(".fa-lock-open")) {
            removeCard(card.id.split("-")[1]);
        }
    });
}

function openModal() {
    document.getElementById("modal").style.display = "flex";
    document.getElementById("modal").animate([
        {opacity: 0},
        {opacity: 1}
    ], {
        duration: 200,
        easing: "ease-in-out"
    });

    document.querySelector(".modal-all").animate([
        {transform: "translateY(100%)"},
        {transform: "translateY(0)"}
    ], {
        duration: 200,
        easing: "ease-in-out"
    });

    document.getElementById("task-input").value = "";
    document.getElementById("task-input").focus();
}

function closeModal() {
    document.getElementById("modal").animate([
        {opacity: 1},
        {opacity: 0}
    ], {
        duration: 200,
        easing: "ease-in-out"
    });

    document.querySelector(".modal-all").animate([
        {transform: "translateY(0)"},
        {transform: "translateY(100%)"}
    ], {
        duration: 200,
        easing: "ease-in-out"
    });

    setTimeout(() => {
        document.getElementById("modal").style.display = "none";
    }
    , 180);
}

document.getElementById("add-card-button").addEventListener("click", event => {
    openModal();
});

document.getElementById("modal").addEventListener("click", event => {
    if (event.target.id == "modal") {
        closeModal();
    }

    if (event.target.classList.contains("modal-color-button")) {
        let color = Array.from(event.target.classList).find(className => className.startsWith("bg-color-")).split("-")[2];
        let content = document.getElementById("task-input").value;

        content = content.replace("<", "&lt;");
        content = content.replace(">", "&gt;");
        content = content.replace("/", "&#47;");

        if (content != "") {
            let card_id = generateID(6);
            while (document.getElementById(`card-${card_id}`)) {
                card_id = generateID(6);
            }

            saveCardData(card_id, content, color);
            removeColorFilters();
            addCard(card_id, content, color, false, 0, true);

            closeModal();
        }
    }
});

document.getElementById("filters").addEventListener("click", event => {
    if (event.target.classList.contains("toolbox-color-button")) {
        let color = Array.from(event.target.classList).find(className => className.startsWith("bg-color-")).split("-")[2];
        let cards = Array.from(document.getElementsByClassName("card"));
        
        currentFilter = color;

        setTimeout(() => {
            cards.forEach(card => {
                if (card.querySelector(".card-header").classList.contains(`bg-color-${color}`)) {
                    card.style.width = "100%";
                    if (card.parentElement.classList.contains("cards")) {
                        card.style.margin = "0 1rem 2rem 1rem";
                    }
                } else {
                    card.style.width = "0%";
                    card.style.margin = "0";
                }
            });
        }, 200);

        document.getElementById("cards").scrollTo(0, 0, {behavior: "smooth"});
    }
    
    if (event.target.classList.contains("toolbox-action-button") || event.target.classList.contains("toolbox-action-button-icon")) {
        removeColorFilters();
    }
});

document.addEventListener("mousedown", event => {
    if (event.button != 0) {
        return;
    }

    if (event.target.classList.contains("card-header")) {
        if (event.target.querySelector(".fa-lock")) {
            return;
        }

        let card = event.target.parentElement;
        card.classList.add("dragging");

        card.parentElement.removeChild(card);
        document.body.appendChild(card);

        card.style.position = "absolute";
        card.style.zIndex = "1000";

        card.animate([
            {top: `${event.clientY}px`},
            {top: `${event.clientY - card.offsetHeight / 2}px`},
        ], {
            duration: 200,
            easing: "ease-in-out"
        });

        card.style.top = `${event.clientY - card.offsetHeight / 2}px`;
        card.style.left = `${event.clientX - card.offsetWidth / 2}px`;
    }
});

document.addEventListener("mousemove", event => {
    let card = document.querySelector(".dragging");

    if (card) {
        card.style.transition = "transform 0.2s ease-in-out";
        card.style.zIndex = "1000";
        
        card.style.top = `${event.clientY - card.offsetHeight / 2}px`;
        card.style.left = `${event.clientX - card.offsetWidth / 2}px`;
    }
});

document.addEventListener("mouseup", event => {
    let card = document.querySelector(".dragging");

    if (card) {
        card.style.transition = "transform 0.2s ease-in-out";

        card.style.zIndex = "0";
        card.classList.remove("dragging");

        card.style.position = "relative";
        card.style.top = "0";
        card.style.left = "0";

        let card_col = document.querySelector(".card-column:hover");

        if (!card_col) {
            card_col = document.querySelector(".cards");
        }

        document.body.removeChild(card);
        card_col.insertBefore(card, card_col.firstChild);

        putCardInColumn(card.id.split("-")[1], Number(card_col.id.split("-")[2]));
    }
});

document.addEventListener("contextmenu", event => {
    event.preventDefault();
});

function load() {
    loadTheme();
    loadData();

    setTimeout(() => {
        document.getElementById("loader").animate([
            {left: "0"},
            {left: "-100%"}
        ], {
            duration: 1000,
            easing: "ease-in-out"
        });
        
        setTimeout(() => {
            document.getElementById("loader").classList.add("off");
        }, 1000);
    }, Math.random() * 1000 + 1000);
}

document.onload = load();


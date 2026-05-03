const sidebar = document.getElementById("sidebar");
const openBtn = document.getElementById("openModal");
const closeBtn = document.getElementById("closeModal");
const cancelBtn = document.getElementById("cancelBtn");
const modal = document.getElementById("modalOverlay");
const form = document.getElementById("taskForm");
const cards = document.querySelector(".cardsec");

const statCards = document.querySelectorAll(".stat-card .stat-value");
const totalEl = statCards[0];
const inProgressEl = statCards[1];
const completedEl = statCards[2];
const overdueEl = statCards[3];

function toggleSidebar() {
    const isOpen = sidebar.classList.toggle("show");
    document.querySelector(".btn .material-symbols-outlined").textContent = isOpen ? "close" : "menu";
}

function showModal() {
    modal.style.display = "flex";
}

function hideModal() {
    modal.style.display = "none";
}

function updateCounts() {
    const allCards = cards.querySelectorAll(".card");
    let total = allCards.length;
    let inProgress = 0;
    let completed = 0;
    let overdue = 0;
    let today = new Date();
    today.setHours(0, 0, 0, 0);

    allCards.forEach(card => {
        const statusEl = card.querySelector(".tags span:last-child");
        const dateEl = card.querySelector(".foot span");
        const status = statusEl ? statusEl.textContent.trim() : "";
        const dateText = dateEl ? dateEl.textContent.trim() : "";

        if (status === "Completed") {
            completed++;
        } else if (status === "In Progress") {
            inProgress++;
        }

        if (status !== "Completed" && dateText !== "No date") {
            const taskDate = new Date(dateText);
            taskDate.setHours(0, 0, 0, 0);
            if (taskDate < today) {
                overdue++;
            }
        }
    });

    totalEl.textContent = total;
    inProgressEl.textContent = inProgress;
    completedEl.textContent = completed;
    overdueEl.textContent = overdue;
}

openBtn.onclick = showModal;
closeBtn.onclick = hideModal;
cancelBtn.onclick = hideModal;

form.onsubmit = function (e) {
    e.preventDefault();

    let name = form.querySelector("input").value;
    let desc = form.querySelector("textarea").value;
    let selects = form.querySelectorAll("select");
    let priority = selects[0].value;
    let status = selects[1].value;
    let date = form.querySelector("input[type='date']").value;

    if (name === "") return;

    let card = document.createElement("div");
    card.className = "card";

    let pClass = priority.toLowerCase().replace(" ", "");
    let sClass = status.toLowerCase().replace(" ", "");

    let d = date ? new Date(date).toDateString() : "No date";

    card.innerHTML = `
        <h3>${name}</h3>
        <p>${desc}</p>
        <div class="tags">
            <span class="${pClass}">${priority}</span>
            <span class="${sClass}">${status}</span>
        </div>
        <div class="foot">
            <span>${d}</span>
            <button class="mark">Mark Completed</button>
        </div>
    `;

    card.querySelector(".mark").onclick = function () {
        const statusTag = this.parentElement.previousElementSibling.lastElementChild;
        statusTag.textContent = "Completed";
        statusTag.className = "completed";
        updateCounts();
    };

    cards.appendChild(card);
    updateCounts();

    form.reset();
    hideModal();
};
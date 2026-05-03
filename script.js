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

let tasks = [];

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
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let inProgress = 0, completed = 0, overdue = 0;

    tasks.forEach(task => {
        if (task.status === "Completed") {
            completed++;
        } else if (task.status === "In Progress") {
            inProgress++;
        }
        if (task.status !== "Completed" && task.date) {
            const taskDate = new Date(task.date);
            taskDate.setHours(0, 0, 0, 0);
            if (taskDate < today) overdue++;
        }
    });

    totalEl.textContent = tasks.length;
    inProgressEl.textContent = inProgress;
    completedEl.textContent = completed;
    overdueEl.textContent = overdue;
}

function renderTasks() {
    cards.innerHTML = "";

    tasks.forEach((task, index) => {
        const card = document.createElement("div");
        card.className = "card";

        const pClass = task.priority.toLowerCase().replace(" ", "");
        const sClass = task.status.toLowerCase().replace(" ", "");
        const d = task.date ? new Date(task.date).toDateString() : "No date";

        card.innerHTML = `
            <h3>${task.name}</h3>
            <p>${task.desc}</p>
            <div class="tags">
                <span class="${pClass}">${task.priority}</span>
                <span class="${sClass}">${task.status}</span>
            </div>
            <div class="foot">
                <span>${d}</span>
                <div class="card-actions">
                    <button class="mark">Mark Completed</button>
                    <button class="delete">Delete</button>
                </div>
            </div>
        `;

        card.querySelector(".mark").onclick = function () {
            tasks[index].status = "Completed";
            renderTasks();
            updateCounts();
        };

        card.querySelector(".delete").onclick = function () {
            tasks.splice(index, 1);
            renderTasks();
            updateCounts();
        };

        cards.appendChild(card);
    });

    updateCounts();
}

openBtn.onclick = showModal;
closeBtn.onclick = hideModal;
cancelBtn.onclick = hideModal;

form.onsubmit = function (e) {
    e.preventDefault();

    const name = form.querySelector("input").value;
    const desc = form.querySelector("textarea").value;
    const selects = form.querySelectorAll("select");
    const priority = selects[0].value;
    const status = selects[1].value;
    const date = form.querySelector("input[type='date']").value;

    if (name === "") return;

    tasks.push({ name, desc, priority, status, date });
    renderTasks();
    form.reset();
    hideModal();
};
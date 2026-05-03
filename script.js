const sidebar = document.getElementById("sidebar")
const openBtn = document.getElementById("openModal");
const closeBtn = document.getElementById("closeModal");
const cancelBtn = document.getElementById("cancelBtn")
const modal = document.getElementById("modalOverlay");
const form = document.getElementById("taskForm");
const cards = document.querySelector(".cardsec");
const statCards = document.querySelectorAll(".stat-card .stat-value");
const totalEl = statCards[0];
const inProgressEl = statCards[1];
const completedEl = statCards[2]
const overdueEl = statCards[3];
const tabs = document.querySelectorAll(".tab");
const sortButtons = document.querySelectorAll(".sort-menu button");
const searchInput = document.getElementById("searchInput");
let searchQuery = "";


let tasks = [];
let activeFilter = "All";
let sortBy = null;

function toggleSidebar() {
    const isOpen = sidebar.classList.toggle("show")
    document.querySelector(".btn .material-symbols-outlined").textContent = isOpen ? "close" : "menu"
}

function showModal() {
    modal.style.display = "flex"
}

function hideModal() {
    modal.style.display = "none"
}

function updateCounts() {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    let inProgress = 0, completed = 0, overdue = 0

    tasks.forEach(task => {
        if (task.status === "Completed") {
            completed++
        } else if (task.status === "In Progress") {
            inProgress++
        }
        if (task.status !== "Completed" && task.date) {
            const taskDate = new Date(task.date)
            taskDate.setHours(0, 0, 0, 0)
            if (taskDate < today) overdue++
        }
    })

    totalEl.textContent = tasks.length
    inProgressEl.textContent = inProgress
    completedEl.textContent = completed
    overdueEl.textContent = overdue
}

tabs.forEach(tab => {
    tab.onclick = function () {
        tabs.forEach(t => t.classList.remove("active"))
        this.classList.add("active")
        activeFilter = this.textContent.trim()
        renderTasks()
    }
})

sortButtons.forEach(btn => {
    btn.onclick = function () {
        sortBy = this.textContent.trim().toLowerCase()
        sortButtons.forEach(b => b.classList.remove("sort-active"))
        this.classList.add("sort-active")
        renderTasks()
    }
})

const priorityOrder = { "High": 1, "Medium": 2, "Low": 3 }

function getSortedTasks(list) {
    if (!sortBy) return list

    return [...list].sort((a, b) => {
        if (sortBy == "date") {
            if (!a.date) return 1
            if (!b.date) return -1
            return new Date(a.date) - new Date(b.date)
        }
        if (sortBy == "priority") {
            return (priorityOrder[a.priority] || 99) - (priorityOrder[b.priority] || 99)
        }
        if (sortBy == "name") {
            return a.name.localeCompare(b.name)
        }
        return 0
    })
}

function renderTasks() {
    cards.innerHTML = ""

    const filtered = activeFilter === "All"
        ? tasks
        : tasks.filter(task => task.status === activeFilter)

    const sorted = getSortedTasks(filtered)

    sorted.forEach((task) => {
        const actualIndex = tasks.indexOf(task)
        const card = document.createElement("div")
        card.className = "card"

        const pClass = task.priority.toLowerCase().replace(" ", "")
        const sClass = task.status.toLowerCase().replace(" ", "")
        const d = task.date ? new Date(task.date).toDateString() : "No date"

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
        `

        card.querySelector(".mark").onclick = function () {
            tasks[actualIndex].status = "Completed"
            renderTasks()
            updateCounts()
        }

        card.querySelector(".delete").onclick = function () {
            tasks.splice(actualIndex, 1)
            renderTasks()
            updateCounts()
        }

        cards.appendChild(card)
    })

    updateCounts()
}

openBtn.onclick = showModal
closeBtn.onclick = hideModal
cancelBtn.onclick = hideModal

form.onsubmit = function (e) {
    e.preventDefault()

    const name = form.querySelector("input").value
    const desc = form.querySelector("textarea").value
    const selects = form.querySelectorAll("select")
    const priority = selects[0].value
    const status = selects[1].value
    const date = form.querySelector("input[type='date']").value

    if (name === "") return

    tasks.push({ name, desc, priority, status, date })
    renderTasks()
    form.reset()
    hideModal()
}
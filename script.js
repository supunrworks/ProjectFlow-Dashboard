const sidebar = document.getElementById("sidebar")

function toggleSidebar() {
    sidebar.classList.toggle("show")
}

const modal = document.getElementById('modalOverlay');
const openBtn = document.getElementById('openModal');
const closeBtn = document.getElementById('closeModal');
const cancelBtn = document.getElementById('cancelBtn');

openBtn.onclick = () =>modal.classList.add('active');

const hideModal = () => modal.classList.remove('active');

closeBtn.onclick = hideModal;
cancelBtn.onclick = hideModal;
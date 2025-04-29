// Configuración inicial
const ADMIN_CREDENTIALS = {
    user: "DocenteBD",
    pass: "UPLA2024"
};

let weeksData = JSON.parse(localStorage.getItem('weeksData')) || [];

// Login
function login() {
    const user = document.getElementById('admin-user').value;
    const pass = document.getElementById('admin-pass').value;

    if (user === ADMIN_CREDENTIALS.user && pass === ADMIN_CREDENTIALS.pass) {
        document.getElementById('login-box').style.display = 'none';
        document.getElementById('admin-panel').style.display = 'block';
        loadExistingWeeks();
    } else {
        alert("Acceso denegado. Verifique sus credenciales.");
    }
}

// Logout
function logout() {
    localStorage.removeItem('loggedIn');
    window.location.reload();
}

// Añadir enlace
function addLink() {
    const container = document.getElementById('links-container');
    const div = document.createElement('div');
    div.className = 'link-input';
    div.innerHTML = `
        <input type="text" placeholder="Nombre" class="link-name">
        <input type="url" placeholder="URL" class="link-url">
        <button type="button" class="btn-remove" onclick="removeLink(this)">&times;</button>
    `;
    container.appendChild(div);
}

// Eliminar enlace
function removeLink(btn) {
    btn.parentElement.remove();
}

// Guardar semana
document.getElementById('week-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const newWeek = {
        week: document.getElementById('week-number').value,
        title: document.getElementById('week-title').value,
        subtitle: document.getElementById('week-subtitle').value,
        status: document.getElementById('week-status').value,
        description: document.getElementById('week-description').value,
        tags: document.getElementById('week-tags').value.split(',').map(t => t.trim()),
        links: Array.from(document.getElementsByClassName('link-input')).map(input => ({
            name: input.querySelector('.link-name').value,
            url: input.querySelector('.link-url').value
        }))
    };

    // Actualizar o agregar
    const index = weeksData.findIndex(w => w.week === newWeek.week);
    if (index >= 0) weeksData[index] = newWeek;
    else weeksData.push(newWeek);

    localStorage.setItem('weeksData', JSON.stringify(weeksData));
    renderWeeks();
    this.reset();
});

// Renderizar semanas
function renderWeeks() {
    const container = document.querySelector('main.container');
    container.innerHTML = weeksData.map(week => `
        <section id="semana${week.week}" class="week-card">
            <div class="week-header">
                <div class="week-number">${week.week.toString().padStart(2, '0')}</div>
                <div class="week-titles">
                    <h2>${week.title}</h2>
                    <p class="week-subtitle">${week.subtitle}</p>
                </div>
                <span class="update-badge ${week.status === 'Nuevo' ? 'new' : ''}">${week.status}</span>
            </div>
            <div class="week-body">
                <div class="week-description">
                    <p>${week.description}</p>
                    ${week.tags?.length ? `
                    <div class="week-tags">
                        ${week.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>` : ''}
                </div>
                <div class="week-actions">
                    ${week.links?.length ? `
                    <div class="buttons-group">
                        ${week.links.map(link => `
                            <a href="${link.url}" class="material-button ${link.name.toLowerCase().includes('canva') ? 'canva' : 'miro'}" target="_blank">
                                <span class="button-icon">${link.name.includes('Canva') ? '🎨' : '📊'}</span>
                                ${link.name}
                            </a>
                        `).join('')}
                    </div>` : ''}
                </div>
            </div>
        </section>
    `).join('');

    updateFooterLinks();
}

// Actualizar footer
function updateFooterLinks() {
    const footerLinks = document.querySelector('.footer-section ul');
    footerLinks.innerHTML = weeksData.map(week => `
        <li><a href="#semana${week.week}">Semana ${week.week}</a></li>
    `).join('');
}

// Cargar semanas existentes
function loadExistingWeeks() {
    const existingWeeks = document.querySelectorAll('.week-card');
    existingWeeks.forEach(week => {
        const weekNumber = week.id.replace('semana', '');
        if (!weeksData.some(w => w.week === weekNumber)) {
            weeksData.push({
                week: weekNumber,
                title: week.querySelector('h2').innerText,
                subtitle: week.querySelector('.week-subtitle').innerText,
                status: week.querySelector('.update-badge').innerText,
                description: week.querySelector('.week-description p').innerText,
                tags: Array.from(week.querySelectorAll('.tag')).map(t => t.innerText),
                links: Array.from(week.querySelectorAll('.material-button')).map(btn => ({
                    name: btn.innerText.trim(),
                    url: btn.href
                }))
            });
        }
    });
    localStorage.setItem('weeksData', JSON.stringify(weeksData));
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('weeksData')) renderWeeks();
});
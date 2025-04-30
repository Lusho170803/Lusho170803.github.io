const ADMIN_CREDENTIALS = { user: "DocenteBD", pass: "UPLA2024" };
let weeksData = JSON.parse(localStorage.getItem('weeksData')) || [];

function login() {
    const user = document.getElementById('admin-user').value;
    const pass = document.getElementById('admin-pass').value;
    if (user === ADMIN_CREDENTIALS.user && pass === ADMIN_CREDENTIALS.pass) {
        document.getElementById('login-box').style.display = 'none';
        document.getElementById('admin-panel').style.display = 'block';
    } else {
        alert("Credenciales incorrectas");
    }
}

function logout() {
    localStorage.removeItem('loggedIn');
    window.location.reload();
}

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

function removeLink(btn) {
    btn.parentElement.remove();
}

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
    weeksData.push(newWeek);
    localStorage.setItem('weeksData', JSON.stringify(weeksData));
    renderNewWeek(newWeek);
    this.reset();
});

function renderNewWeek(week) {
    const container = document.querySelector('main.container');
    if (!document.getElementById(`semana${week.week}`)) {
        container.innerHTML += `
            <section id="semana${week.week}" class="week-card">
                <div class="week-header">
                    <div class="week-number">${String(week.week).padStart(2, '0')}</div>
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
        `;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    weeksData.forEach(week => {
        if (!document.getElementById(`semana${week.week}`)) {
            renderNewWeek(week);
        }
    });
});

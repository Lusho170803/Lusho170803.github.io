const ADMIN_USER = "DocenteBD";
const ADMIN_PASS = "UPLA2024";
let weeksData = JSON.parse(localStorage.getItem('weeksData')) || [];

function login() {
    const user = document.getElementById('admin-user').value;
    const pass = document.getElementById('admin-pass').value;
    
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
        document.getElementById('login-box').style.display = 'none';
        document.getElementById('admin-panel').style.display = 'block';
    } else {
        alert("⚠️ Credenciales incorrectas");
    }
}

function logout() {
    localStorage.removeItem('weeksData');
    window.location.reload();
}

function addLink() {
    const container = document.getElementById('links-container');
    const newLink = document.createElement('div');
    newLink.className = 'link-input';
    newLink.innerHTML = `
        <input type="text" placeholder="Nombre" class="link-name">
        <input type="url" placeholder="URL" class="link-url">
        <button type="button" class="btn-remove" onclick="removeLink(this)">&times;</button>
    `;
    container.appendChild(newLink);
}

function removeLink(btn) {
    btn.parentElement.remove();
}

document.getElementById('week-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newWeek = {
        week: document.getElementById('week-number').value,
        title: document.getElementById('week-title').value,
        subtitle: document.getElementById('week-subtitle').value,
        status: document.getElementById('week-status').value,
        description: document.getElementById('week-description').value,
        tags: document.getElementById('week-tags').value.split(',').map(t => t.trim()),
        links: Array.from(document.querySelectorAll('.link-input')).map(input => ({
            name: input.querySelector('.link-name').value,
            url: input.querySelector('.link-url').value
        }))
    };
    
    weeksData.push(newWeek);
    localStorage.setItem('weeksData', JSON.stringify(weeksData));
    renderWeek(newWeek);
    e.target.reset();
});

function renderWeek(week) {
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
                        ${week.tags?.length ? `<div class="week-tags">${week.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>` : ''}
                    </div>
                    <div class="week-actions">
                        ${week.links?.length ? `<div class="buttons-group">${week.links.map(l => `
                            <a href="${l.url}" class="material-button ${l.name.toLowerCase().includes('canva') ? 'canva' : 'miro'}" target="_blank">
                                ${l.name.includes('Canva') ? '🎨' : '📊'} ${l.name}
                            </a>`).join('')}</div>` : ''}
                    </div>
                </div>
            </section>
        `;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    weeksData.forEach(week => renderWeek(week));
});

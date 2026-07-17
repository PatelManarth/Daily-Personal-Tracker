export function setupNavigation() {
  const labels = {
    today: ['⌂', 'Today'],
    daily: ['✎', 'Log'],
    meals: ['🍽', 'Meals'],
    weekly: ['▦', 'Weekly'],
    measurements: ['↔', 'Measure'],
    adjustments: ['⇄', 'Adjust'],
    settings: ['⚙', 'Settings'],
  };

  const style = document.createElement('style');
  style.textContent = `
    .nav-button .nav-icon{display:none;font-size:1rem;line-height:1}
    .app-link-nav a.nav-button{text-decoration:none;display:inline-flex;align-items:center;justify-content:center;gap:.35rem}
    @media(max-width:720px){
      .main-nav{justify-content:space-around;gap:.1rem;overflow-x:auto}
      .nav-button{display:grid;place-items:center;gap:.15rem;min-width:62px;padding:.4rem .45rem;font-size:.72rem}
      .nav-button .nav-icon{display:block}
      .nav-button span:last-child{display:block}
    }
  `;
  document.head.appendChild(style);

  document.querySelectorAll('#nav [data-view]').forEach((button) => {
    const view = button.dataset.view;
    const [icon, label] = labels[view] || ['', button.textContent];
    button.innerHTML = `<span class="nav-icon" aria-hidden="true">${icon}</span><span>${label}</span>`;
    button.setAttribute('aria-label', label);
    if (view === 'meals') {
      button.onclick = () => { window.location.href = 'meals.html'; };
    }
  });

  function openHashView() {
    const view = window.location.hash.replace('#', '');
    if (!view || view === 'meals') return;
    const button = document.querySelector(`#nav [data-view="${CSS.escape(view)}"]`);
    if (button) button.click();
  }

  window.addEventListener('hashchange', openHashView);
  window.setTimeout(openHashView, 60);
}

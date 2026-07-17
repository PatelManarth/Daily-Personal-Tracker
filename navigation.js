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
    .meal-shortcut{display:inline-flex;align-items:center;gap:.35rem;margin-top:.7rem;text-decoration:none}
    .meal-fieldset-link{float:right;margin-top:-.45rem;text-decoration:none;font-size:.82rem;font-weight:800;color:var(--primary)}
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
    if (view === 'meals') button.onclick = () => { window.location.href = 'meals.html'; };
  });

  const todayMeals = document.querySelector('#today-meals')?.closest('.card');
  if (todayMeals && !todayMeals.querySelector('.meal-shortcut')) {
    todayMeals.insertAdjacentHTML('beforeend', '<a class="button secondary meal-shortcut" href="meals.html">🍽 Browse meal options</a>');
  }

  const mealFieldset = [...document.querySelectorAll('#daily-form fieldset')].find((field) => field.querySelector('legend')?.textContent.trim() === 'Meals');
  if (mealFieldset && !mealFieldset.querySelector('.meal-fieldset-link')) {
    mealFieldset.querySelector('legend').insertAdjacentHTML('afterend', '<a class="meal-fieldset-link" href="meals.html">Browse recipes →</a>');
  }

  function openHashView() {
    const view = window.location.hash.replace('#', '');
    if (!view || view === 'meals') return;
    const button = document.querySelector(`#nav [data-view="${view.replace(/[^a-z-]/gi, '')}"]`);
    if (button) button.click();
  }

  window.addEventListener('hashchange', openHashView);
  window.setTimeout(openHashView, 80);
}

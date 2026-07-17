const ITEMS = [
  ['today', 'index.html', '⌂', 'Today'],
  ['daily', 'daily.html', '✎', 'Log'],
  ['meals', 'meals.html', '🍽', 'Meals'],
  ['weekly', 'weekly.html', '▦', 'Weekly'],
  ['measurements', 'measurements.html', '↔', 'Measure'],
  ['adjustments', 'adjustments.html', '⇄', 'Adjust'],
  ['settings', 'settings.html', '⚙', 'Settings'],
];

export function setupNavigation() {
  const nav = document.querySelector('#nav');
  if (nav) {
    nav.classList.add('app-link-nav');
    nav.setAttribute('aria-label', 'Main navigation');
    nav.innerHTML = ITEMS.map(([key, href, icon, label]) => `
      <a class="nav-button${key === 'today' ? ' active' : ''}" href="${href}"${key === 'today' ? ' aria-current="page"' : ''}>
        <span class="nav-icon" aria-hidden="true">${icon}</span><span>${label}</span>
      </a>`).join('');
  }

  const style = document.createElement('style');
  style.textContent = `
    .app-link-nav a.nav-button{text-decoration:none;display:inline-flex;align-items:center;justify-content:center;gap:.38rem}
    .app-link-nav .nav-icon{display:inline-block;font-size:1rem;line-height:1}
    .meal-shortcut{display:inline-flex;align-items:center;gap:.35rem;margin-top:.7rem;text-decoration:none}
    .meal-fieldset-link{float:right;margin-top:-.45rem;text-decoration:none;font-size:.82rem;font-weight:800;color:var(--primary)}
    @media(max-width:720px){
      .app-link-nav{justify-content:flex-start;gap:.1rem;overflow-x:auto}
      .app-link-nav a.nav-button{display:grid;place-items:center;gap:.15rem;min-width:62px;padding:.4rem .45rem;font-size:.72rem}
      .app-link-nav .nav-icon{display:block}
    }
  `;
  document.head.appendChild(style);

  const todayMeals = document.querySelector('#today-meals')?.closest('.card');
  if (todayMeals && !todayMeals.querySelector('.meal-shortcut')) {
    todayMeals.insertAdjacentHTML('beforeend', '<a class="button secondary meal-shortcut" href="meals.html">🍽 Browse meal options</a>');
  }

  const mealFieldset = [...document.querySelectorAll('#daily-form fieldset')].find((field) => field.querySelector('legend')?.textContent.trim() === 'Meals');
  if (mealFieldset && !mealFieldset.querySelector('.meal-fieldset-link')) {
    mealFieldset.querySelector('legend').insertAdjacentHTML('afterend', '<a class="meal-fieldset-link" href="meals.html">Browse recipes →</a>');
  }
}
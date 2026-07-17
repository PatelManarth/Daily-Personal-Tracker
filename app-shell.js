const NAV_ITEMS = [
  { key: 'today', href: 'index.html', icon: '⌂', label: 'Today' },
  { key: 'daily', href: 'daily.html', icon: '✎', label: 'Log' },
  { key: 'meals', href: 'meals.html', icon: '🍽', label: 'Meals' },
  { key: 'weekly', href: 'weekly.html', icon: '▦', label: 'Weekly' },
  { key: 'measurements', href: 'measurements.html', icon: '↔', label: 'Measure' },
  { key: 'adjustments', href: 'adjustments.html', icon: '⇄', label: 'Adjust' },
  { key: 'settings', href: 'settings.html', icon: '⚙', label: 'Settings' },
];

export function setupAppShell({ page, title, subtitle }) {
  const mount = document.querySelector('#app-shell');
  if (!mount) throw new Error('Missing #app-shell mount point.');

  const nav = NAV_ITEMS.map((item) => {
    const active = item.key === page;
    return `<a class="nav-button${active ? ' active' : ''}" href="${item.href}"${active ? ' aria-current="page"' : ''}>
      <span class="nav-icon" aria-hidden="true">${item.icon}</span>
      <span>${item.label}</span>
    </a>`;
  }).join('');

  mount.innerHTML = `
    <header class="app-header shared-app-header">
      <div>
        <p class="eyebrow">Daily Personal Tracker</p>
        <h1>${title}</h1>
        <p class="muted shell-subtitle">${subtitle}</p>
      </div>
      <div class="header-actions">
        <a class="button secondary shell-backup-link" href="settings.html#backup">Backup</a>
        <button id="theme" class="icon-button" type="button" aria-label="Toggle light or dark mode">◐</button>
      </div>
    </header>
    <nav class="main-nav app-link-nav" aria-label="Main navigation">${nav}</nav>
  `;
}

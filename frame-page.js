import { loadProfile, initializeShell, $ } from './page-common.js';

const page = document.body.dataset.page;
const titles = {
  daily: ['Daily Log', 'Record weight, Cronometer totals, meals, movement and recovery.'],
  weekly: ['Weekly Check-in', 'Review Monday to Sunday and document what needs attention.'],
  measurements: ['Body Measurements', 'Track tape measurements with consistent placement.'],
  adjustments: ['Adjustment History', 'Keep every plan change manual, evidence-based and reviewable.'],
  settings: ['Settings & Backups', 'Manage your local data, exports, products and routine.'],
};

async function init() {
  const profile = await loadProfile();
  const [title, subtitle] = titles[page];
  initializeShell(profile, page, title, subtitle);

  const response = await fetch('index.html', { cache: 'no-store' });
  if (!response.ok) throw new Error('Unable to load tracker interface.');
  const documentCopy = new DOMParser().parseFromString(await response.text(), 'text/html');
  documentCopy.querySelectorAll('script').forEach((script) => script.remove());

  const wrapper = document.createElement('div');
  wrapper.className = 'embedded-app';
  [...documentCopy.body.children].forEach((child) => wrapper.appendChild(document.importNode(child, true)));
  $('#page-root').appendChild(wrapper);

  wrapper.querySelector('.app-header')?.remove();
  const legacyNav = wrapper.querySelector('#nav');
  if (legacyNav) legacyNav.hidden = true;

  await import('./app.js');

  window.setTimeout(() => {
    wrapper.querySelectorAll('.view').forEach((view) => view.classList.toggle('active', view.id === page));
    window.scrollTo(0, 0);
  }, 150);
}

init().catch((error) => {
  console.error(error);
  $('#page-root').innerHTML = '<main class="page-main"><div class="notice warning">This page could not start. Reload the website or restore a valid backup.</div></main>';
});
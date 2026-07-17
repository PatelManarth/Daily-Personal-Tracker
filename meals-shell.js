import { loadProfile, initializeShell } from './page-common.js';

const profile = await loadProfile();
initializeShell(
  profile,
  'meals',
  'Meal Library',
  'Pick what to cook using time, ingredients and macros.',
);
await import('./meals-page.js');
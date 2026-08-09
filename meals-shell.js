import { loadProfile, initializeShell, db } from './page-common.js';
import { ensureShravanRecipes } from './shravan-phase.js';

const profile = await loadProfile();
await ensureShravanRecipes(db);
initializeShell(
  profile,
  'meals',
  'Meal Library',
  'Pick what to cook using time, ingredients, macros and the active meal phase.',
);
await import('./meals-page.js');
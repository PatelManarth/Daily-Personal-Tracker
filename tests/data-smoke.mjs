import { DEFAULT_PROFILE, DEFAULT_PRODUCTS, DEFAULT_RECIPES, ENUMS } from '../data.js';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const activeRecipes = DEFAULT_RECIPES.filter((recipe) => recipe.code !== 'None');
const counts = activeRecipes.reduce((result, recipe) => {
  result[recipe.category] = (result[recipe.category] || 0) + 1;
  return result;
}, {});

assert(DEFAULT_PROFILE.startDate === '2026-07-13', 'Unexpected start date.');
assert(DEFAULT_PROFILE.deadline === '2026-11-09', 'Unexpected deadline.');
assert(DEFAULT_PROFILE.startWeightKg === 74, 'Unexpected start weight.');
assert(DEFAULT_PROFILE.goalWeightKg === 61, 'Unexpected goal weight.');
assert(DEFAULT_PROFILE.calorieMin >= 1500, 'Calorie minimum must not be below 1,500 kcal.');
assert(DEFAULT_PROFILE.structuredExerciseCapMinutes === 20, 'Structured exercise cap must remain 20 minutes.');
assert(counts.Breakfast === 9, 'Expected 9 breakfast recipes.');
assert(counts.Lunch === 10, 'Expected 10 lunch recipes.');
assert(counts.Snack === 10, 'Expected 10 snack recipes.');
assert(counts['Late top-up'] === 3, 'Expected 3 late top-up recipes.');
assert(DEFAULT_PRODUCTS.length === 10, 'Expected 10 branded product settings.');
assert(ENUMS.walkSetting.length >= 4, 'Walking setting options are missing.');

const requiredRecipeFields = [
  'code', 'name', 'category', 'calories', 'protein', 'time', 'ingredients', 'method',
  'taste', 'prepPacking', 'batchCooking', 'storage', 'workPacking', 'tracking', 'pairing'
];

for (const recipe of activeRecipes) {
  for (const field of requiredRecipeFields) {
    assert(recipe[field] !== undefined && recipe[field] !== null, `${recipe.code} is missing ${field}.`);
  }
  assert(Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0, `${recipe.code} has no ingredients.`);
  assert(Array.isArray(recipe.method) && recipe.method.length > 0, `${recipe.code} has no method.`);
}

const days = (new Date('2026-11-09T12:00:00') - new Date('2026-07-13T12:00:00')) / 86400000;
assert(days === 119, 'Trajectory period must be 119 days.');

console.log(`Validated ${activeRecipes.length} recipes, ${DEFAULT_PRODUCTS.length} products and the 119-day trajectory.`);

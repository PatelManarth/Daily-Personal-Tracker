import breakfast from '../shravan-breakfast.js';
import snacks from '../shravan-snacks.js';
import topups from '../shravan-topups.js';
import {SHRAVAN_CONFIG,SHRAVAN_RECIPES,isShravanDate,recipesForPhase,recipeSelectable} from '../shravan-phase.js';

function assert(condition,message){if(!condition)throw new Error(message)}
assert(SHRAVAN_CONFIG.phase.activeFrom==='2026-08-12','Unexpected Shravan start date.');
assert(SHRAVAN_CONFIG.phase.dailyCalories.min===1500&&SHRAVAN_CONFIG.phase.dailyCalories.max===1600,'Shravan calorie range changed.');
assert(SHRAVAN_CONFIG.phase.dailyProteinG.min===110,'Shravan protein minimum changed.');
assert(SHRAVAN_CONFIG.religiousRules.maxGrainMealsPerDay===1,'Shravan must allow one grain meal per day.');
assert(breakfast.length===10,'Expected 10 Shravan breakfasts.');
assert(snacks.length===8,'Expected 8 Shravan snacks.');
assert(topups.length===3,'Expected 3 Shravan top-ups.');
assert(SHRAVAN_RECIPES.length===21,'Expected 21 new Shravan recipes.');
assert(SHRAVAN_CONFIG.existingRecipeTagUpdates.length===10,'Expected L1-L10 tag updates.');
assert(SHRAVAN_CONFIG.shravanAddOns.length===6,'Expected six measured Shravan add-ons.');
assert(!isShravanDate('2026-08-11',{mode:'auto'}),'Auto Shravan activated too early.');
assert(isShravanDate('2026-08-12',{mode:'auto'}),'Auto Shravan did not activate on Aug 12.');
assert(isShravanDate('2026-08-01',{mode:'shravan'}),'Manual Shravan preview failed.');
assert(!isShravanDate('2026-08-20',{mode:'normal'}),'Manual normal override failed.');
for(const recipe of SHRAVAN_RECIPES){
  assert(recipe.tags?.includes('shravan'),`${recipe.code} missing shravan tag.`);
  assert(recipe.tags?.includes('off-grain'),`${recipe.code} missing off-grain tag.`);
  assert(recipe.ingredients.some(x=>/Shravan-compatible whey/i.test(x)),`${recipe.code} must reference Shravan-compatible whey.`);
  for(const key of ['code','name','category','calories','protein','carbs','fat','time','ingredients','method','taste','prepPacking','tracking'])assert(recipe[key]!==undefined,`${recipe.code} missing ${key}.`);
}
assert(breakfast.filter(r=>r.tags.includes('premium-optional')).map(r=>r.code).sort().join(',')==='SHB10P,SHB9P','Premium breakfast flags changed.');
const fakeLunches=SHRAVAN_CONFIG.existingRecipeTagUpdates.map(x=>({code:x.code,category:'Lunch',tags:x.addTags,grainMealOnly:true}));
const shravanBreakfast=breakfast.map(r=>({...r,premiumOptional:r.tags.includes('premium-optional'),wheyCompatibilityRequired:true}));
const all=[...shravanBreakfast,...fakeLunches];
const visible=recipesForPhase(all,'Breakfast','2026-08-12',{mode:'auto',showPremium:false,wheyCompatible:false});
assert(visible.length===8,'Premium breakfasts should be hidden by default.');
assert(recipesForPhase(all,'Lunch','2026-08-11',{mode:'auto'}).length===10,'Canonical L1-L10 lunches must remain available in normal mode.');
assert(recipesForPhase(all,'Lunch','2026-08-12',{mode:'auto'}).length===10,'Shravan must expose exactly L1-L10 as grain lunches.');
assert(!recipeSelectable({...visible[0],wheyCompatibilityRequired:true},true,{wheyCompatible:false}),'Whey recipe should be locked until compatibility is confirmed.');
console.log(`Validated Shravan phase: ${breakfast.length} breakfasts, ${snacks.length} snacks, ${topups.length} top-ups, ${fakeLunches.length} grain lunches.`);
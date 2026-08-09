import breakfast from './shravan-breakfast.js';
import snacks from './shravan-snacks.js';
import topups from './shravan-topups.js';
import { SHRAVAN_CONFIG } from './shravan-core.js';

export { SHRAVAN_CONFIG };
export const SHRAVAN_RECIPES=[...breakfast,...snacks,...topups];
export const SHRAVAN_SETTINGS_KEY='shravanPhase';
export const DEFAULT_SHRAVAN_SETTINGS={mode:'auto',wheyCompatible:false,showPremium:false};

const clone=v=>structuredClone(v);
const hasTag=(r,t)=>Array.isArray(r?.tags)&&r.tags.includes(t);
const usesWhey=r=>(r.ingredients||[]).some(x=>/shravan-compatible whey/i.test(x));

export function isShravanDate(date,settings=DEFAULT_SHRAVAN_SETTINGS){
  if(settings.mode==='shravan')return true;
  if(settings.mode==='normal')return false;
  const {activeFrom,activeUntil}=SHRAVAN_CONFIG.phase;
  return date>=activeFrom&&(!activeUntil||date<=activeUntil);
}

export async function loadShravanSettings(db){
  const saved=await db.get('settings',SHRAVAN_SETTINGS_KEY);
  return {...DEFAULT_SHRAVAN_SETTINGS,...(saved?.value||{})};
}

export async function saveShravanSettings(db,settings){
  const value={...DEFAULT_SHRAVAN_SETTINGS,...settings};
  await db.put('settings',{key:SHRAVAN_SETTINGS_KEY,value});
  return value;
}

function decorateShravanRecipe(source,existing){
  const tags=[...new Set([...(source.tags||[]),'shravan','off-grain'])];
  const premium=tags.includes('premium-optional');
  const cold=tags.includes('cold-pack');
  return {
    ...existing,
    ...clone(source),
    tags,
    phaseIds:['shravan-2026'],
    shravanOffGrainAllowed:true,
    grainMealOnly:false,
    premiumOptional:premium,
    requiresColdPack:cold,
    coldPack:cold,
    perishable:cold||/(milk|curd|yogurt|cooked potato|sweet potato)/i.test((source.ingredients||[]).join(' ')),
    wheyCompatibilityRequired:usesWhey(source),
    normalSaltAllowed:false,
    onionGarlicAllowed:false,
    batchCooking:source.prepPacking||'',
    storage:cold?'Keep refrigerated and use a cold pack when carried to work.':'Follow ingredient storage requirements.',
    workPacking:source.prepPacking||'',
    pairing:source.category==='Late top-up'?'Use only after checking the final Cronometer totals.':'Use within the Shravan structure: off-grain breakfast/snack plus one L1-L10 grain lunch.',
    favourite:existing?.favourite??false,
  };
}

export async function ensureShravanRecipes(db){
  const recipes=await db.getAll('recipes');
  const byCode=new Map(recipes.map(r=>[r.code,r]));
  const changed=[];
  for(const source of SHRAVAN_RECIPES){
    const merged=decorateShravanRecipe(source,byCode.get(source.code));
    byCode.set(source.code,merged);changed.push(merged);
  }
  for(const update of SHRAVAN_CONFIG.existingRecipeTagUpdates){
    const current=byCode.get(update.code);if(!current)continue;
    const merged={...current,tags:[...new Set([...(current.tags||[]),...(update.addTags||[])])],phaseIds:[...new Set([...(current.phaseIds||[]),'shravan-2026'])],shravanAllowed:true,grainMealOnly:true,mealWindow:update.mealWindow,normalSaltAllowed:true,onionGarlicAllowed:true};
    byCode.set(update.code,merged);changed.push(merged);
  }
  if(changed.length)await db.bulkPut('recipes',changed);
  return [...byCode.values()];
}

export function recipesForPhase(recipes,category,date,settings=DEFAULT_SHRAVAN_SETTINGS){
  const active=isShravanDate(date,settings);
  if(!active)return recipes.filter(r=>r.category===category&&!/^(SHB|SHS|SHT)/.test(r.code));
  if(category==='Breakfast')return recipes.filter(r=>r.category==='Breakfast'&&/^SHB/.test(r.code)&&(!r.premiumOptional||settings.showPremium));
  if(category==='Lunch')return recipes.filter(r=>r.category==='Lunch'&&r.grainMealOnly&&/^L(?:10|[1-9])$/.test(r.code));
  if(category==='Snack')return recipes.filter(r=>r.category==='Snack'&&/^SHS/.test(r.code));
  if(category==='Late top-up')return recipes.filter(r=>r.category==='Late top-up'&&/^SHT/.test(r.code));
  return [];
}

export function recipeSelectable(recipe,active,settings){
  return !(active&&recipe?.wheyCompatibilityRequired&&!settings.wheyCompatible);
}

export function phaseBadges(recipe,active){
  if(!active)return [];
  const out=[];
  if(recipe.grainMealOnly)out.push('SHRAVAN - GRAIN MEAL ONLY');
  else if(hasTag(recipe,'shravan'))out.push('SHRAVAN - OFF-GRAIN');
  if(recipe.premiumOptional)out.push('PREMIUM OPTIONAL');
  if(recipe.requiresColdPack)out.push('COLD PACK REQUIRED');
  if(hasTag(recipe,'shelf-stable'))out.push('SHELF-STABLE');
  return out;
}

export function shravanRuleText(){
  return 'Off-grain: milk/curd, confirmed whey, fruit, potato/sweet potato, sabudana, peanuts/nuts and permitted seasonings. No paneer, soy/tofu, legumes, Gusta, normal vegetables, makhana, onion, garlic, normal salt or regular grains outside the single L1-L10 grain meal.';
}

export function planningGuidance(selected,profile,active){
  if(!active)return [];
  const sum=k=>selected.reduce((s,r)=>s+(Number(r?.[k])||0),0),cal=sum('calories'),protein=sum('protein');
  const out=[];
  const grain=selected.filter(r=>r.grainMealOnly).length;
  if(grain===0)out.push('Choose one L1-L10 lunch; it is the day’s single grain meal.');
  if(grain>1)out.push('More than one grain meal is selected. Shravan allows one per calendar day; a second requires an explicit manual override and reason.');
  if(cal>=profile.calorieMin&&cal<=profile.calorieMax&&protein>=profile.proteinMin)out.push('Planning estimate is complete: calories are in range and protein is at least 110 g. No top-up is required unless Cronometer says otherwise.');
  else if(protein<profile.proteinMin){
    const room=profile.calorieMax-cal;
    const candidates=topups.filter(r=>r.calories<=room).sort((a,b)=>a.calories-b.calories);
    if(candidates[0])out.push(`Protein is below 110 g by planning estimate. The smallest Shravan top-up that fits the remaining calorie ceiling is ${candidates[0].code} — ${candidates[0].name}. Confirm in Cronometer first.`);
    else out.push('Protein is below 110 g but no standard Shravan top-up fits the estimated calorie ceiling. Adjust the meal combination and confirm in Cronometer.');
  }else if(cal<profile.calorieMin){
    out.push('Protein is adequate but calories are below 1,500 by planning estimate. Use a measured Shravan add-on such as fruit, milk, curd, potato, peanuts or nuts; do not automatically add more whey.');
  }
  return out;
}

function optionRows(recipes,selected,active,settings){
  return `<option value="">None / custom</option>${recipes.map(r=>{const disabled=!recipeSelectable(r,active,settings);return `<option value="${r.code}" ${r.code===selected?'selected':''} ${disabled?'disabled':''}>${r.code} — ${r.name}${disabled?' — confirm whey first':''}</option>`}).join('')}`;
}

export async function setupDailyShravanFiltering({db,profile,root=document}){
  const dateInput=root.querySelector('#log-date'),form=root.querySelector('#daily-form');if(!dateInput||!form)return;
  let settings=await loadShravanSettings(db),recipes=await ensureShravanRecipes(db);
  const mealField=[...form.querySelectorAll('fieldset')].find(f=>f.querySelector('legend')?.textContent.trim()==='Meals');
  let note=mealField?.querySelector('.shravan-daily-note');
  if(mealField&&!note){note=document.createElement('div');note.className='notice neutral shravan-daily-note';mealField.insertBefore(note,mealField.children[1]||null)}
  const refresh=()=>{
    const d=dateInput.value,active=isShravanDate(d,settings);
    const fields=[['breakfastCode','Breakfast'],['lunchCode','Lunch'],['snackCode','Snack'],['topUpCode','Late top-up']];
    for(const [name,cat] of fields){const el=form.querySelector(`[name="${name}"]`);if(!el)continue;const current=el.value;const list=recipesForPhase(recipes,cat,d,settings);el.innerHTML=optionRows(list,current,active,settings);if(current&&![...el.options].some(o=>o.value===current))el.value='';}
    if(note)note.innerHTML=active?`<strong>Shravan mode.</strong> One L1-L10 grain lunch only. Off-grain breakfast/snack/top-up rules apply.${settings.wheyCompatible?'':' <a href="meals.html">Confirm Shravan-compatible whey in Meals</a> before selecting whey recipes.'}`:`<strong>Normal plan.</strong> Shravan auto-activates from ${SHRAVAN_CONFIG.phase.activeFrom}.`;
  };
  refresh();
  dateInput.addEventListener('change',()=>setTimeout(refresh,30));
}

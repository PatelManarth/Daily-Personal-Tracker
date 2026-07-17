import { db } from './db.js';
import {
  DEFAULT_PROFILE,
  DEFAULT_PRODUCTS,
  DEFAULT_RECIPES,
  ROUTINE_REMINDERS,
  AUTHORITY_NOTE,
} from './data.js';
import { setupAppShell } from './app-shell.js';

export { db, DEFAULT_PROFILE, DEFAULT_PRODUCTS, DEFAULT_RECIPES, ROUTINE_REMINDERS, AUTHORITY_NOTE };
export const $ = (selector, root = document) => root.querySelector(selector);
export const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
export const clone = (value) => structuredClone(value);
export const num = (value) => value === '' || value == null ? undefined : Number(value);
export const avg = (values) => {
  const valid = values.filter(Number.isFinite);
  return valid.length ? valid.reduce((sum, value) => sum + value, 0) / valid.length : undefined;
};
export const esc = (value) => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

export function parseDate(value) {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day, 12);
}

export function iso(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function addDays(value, days) {
  const date = parseDate(value);
  date.setDate(date.getDate() + days);
  return iso(date);
}

export function daysBetween(start, end) {
  return Math.round((parseDate(end) - parseDate(start)) / 86400000);
}

export function today(profile) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: profile.timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

export function monday(value) {
  const date = parseDate(value);
  const weekday = date.getDay();
  date.setDate(date.getDate() + (weekday === 0 ? -6 : 1 - weekday));
  return iso(date);
}

export function sunday(value) {
  return addDays(monday(value), 6);
}

export function fmt(value) {
  return value
    ? new Intl.DateTimeFormat('en-CA', { month: 'short', day: 'numeric', year: 'numeric' }).format(parseDate(value))
    : '—';
}

export function toast(message) {
  const element = $('#toast');
  if (!element) return;
  element.textContent = message;
  element.classList.add('show');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => element.classList.remove('show'), 2300);
}

export function setForm(form, object) {
  [...form.elements].forEach((element) => {
    if (!element.name) return;
    if (element.type === 'checkbox') element.checked = Boolean(object[element.name]);
    else element.value = object[element.name] ?? '';
  });
}

export function readForm(form) {
  const result = {};
  [...form.elements].forEach((element) => {
    if (!element.name) return;
    if (element.type === 'checkbox') result[element.name] = element.checked;
    else if (element.type === 'number') result[element.name] = num(element.value);
    else result[element.name] = element.value;
  });
  return result;
}

export function upsert(array, item, key) {
  const index = array.findIndex((entry) => entry[key] === item[key]);
  if (index >= 0) array[index] = item;
  else array.push(item);
  array.sort((a, b) => String(a[key]).localeCompare(String(b[key])));
}

export function validWeight(log) {
  return Number.isFinite(log?.weightKg)
    && log.afterBathroom
    && log.beforeFood
    && log.normalHydration
    && log.weighInTime
    && Number(log.weighInTime.slice(0, 2)) < 12;
}

export function target(profile, date) {
  const total = daysBetween(profile.startDate, profile.deadline);
  const elapsed = Math.max(0, Math.min(total, daysBetween(profile.startDate, date)));
  return profile.startWeightKg - ((profile.startWeightKg - profile.goalWeightKg) * elapsed / total);
}

export function rolling(profile, logs, endDate) {
  const startDate = addDays(endDate, -6);
  const values = logs
    .filter((log) => log.date >= startDate && log.date <= endDate && validWeight(log))
    .map((log) => log.weightKg);
  return values.length >= 4 ? avg(values) : undefined;
}

export function previousRolling(profile, logs, endDate) {
  return rolling(profile, logs, addDays(endDate, -7));
}

export function weeklySummary(profile, logs, date) {
  const start = monday(date);
  const end = addDays(start, 6);
  const weekLogs = logs.filter((log) => log.date >= start && log.date <= end);
  const nutrition = weekLogs.filter((log) => Number.isFinite(log.calories) || Number.isFinite(log.proteinG));
  const completed = weekLogs.filter((log) => log.completed);
  const weights = weekLogs.filter(validWeight).map((log) => log.weightKg);
  const calorieAdherence = nutrition.length
    ? nutrition.filter((log) => log.calories >= profile.calorieMin && log.calories <= profile.calorieMax).length / nutrition.length
    : undefined;
  const proteinAdherence = nutrition.length
    ? nutrition.filter((log) => log.proteinG >= profile.proteinMin).length / nutrition.length
    : undefined;
  const walkAdherence = Math.min(1, weekLogs.reduce((sum, log) => sum + (log.walkMinutes || 0), 0) / (7 * profile.walkTargetMinutes));
  const logAdherence = completed.length / 7;
  const sleep = avg(weekLogs.map((log) => log.sleepHours));
  const sleepAdherence = Number.isFinite(sleep) ? Math.min(1, sleep / profile.sleepTargetHours) : undefined;
  const combined = [calorieAdherence, proteinAdherence, walkAdherence, logAdherence, sleepAdherence].every(Number.isFinite)
    ? calorieAdherence * 0.35 + proteinAdherence * 0.25 + walkAdherence * 0.2 + logAdherence * 0.1 + sleepAdherence * 0.1
    : undefined;

  return {
    start,
    end,
    avgWeight: avg(weights),
    lowest: weights.length ? Math.min(...weights) : undefined,
    readings: weights.length,
    avgCalories: avg(nutrition.map((log) => log.calories)),
    avgProtein: avg(nutrition.map((log) => log.proteinG)),
    avgFibre: avg(nutrition.map((log) => log.fibreG)),
    avgSteps: avg(weekLogs.map((log) => log.steps)),
    avgWalk: avg(weekLogs.map((log) => log.walkMinutes)),
    avgSleep: sleep,
    avgHunger: avg(weekLogs.map((log) => log.hunger)),
    avgEnergy: avg(weekLogs.map((log) => log.energy)),
    calorieAdherence,
    proteinAdherence,
    walkAdherence,
    logAdherence,
    combined,
    daysCalories: nutrition.filter((log) => log.calories >= profile.calorieMin && log.calories <= profile.calorieMax).length,
    daysProtein: nutrition.filter((log) => log.proteinG >= profile.proteinMin).length,
    walkDays: weekLogs.filter((log) => log.walkStatus === 'Completed').length,
  };
}

export function kpi(label, value, sub = '') {
  return `<div class="kpi-card"><span class="label">${esc(label)}</span><span class="value">${esc(value)}</span><div class="sub">${esc(sub)}</div></div>`;
}

export function options(recipes, category, selected = '') {
  const list = recipes.filter((recipe) => recipe.category === category && recipe.code !== 'None');
  return `<option value="">None / custom</option>${list.map((recipe) => `<option value="${esc(recipe.code)}" ${recipe.code === selected ? 'selected' : ''}>${esc(recipe.code)} — ${esc(recipe.name)}</option>`).join('')}`;
}

export async function loadProfile() {
  const saved = await db.get('settings', 'profile');
  if (saved?.value) return saved.value;
  const profile = clone(DEFAULT_PROFILE);
  await db.put('settings', { key: 'profile', value: profile });
  return profile;
}

export async function ensureRecipes() {
  let recipes = await db.getAll('recipes');
  if (!recipes.length) {
    recipes = clone(DEFAULT_RECIPES);
    await db.bulkPut('recipes', recipes);
  }
  return recipes;
}

export async function ensureProducts() {
  let products = await db.getAll('products');
  if (!products.length) {
    products = clone(DEFAULT_PRODUCTS);
    await db.bulkPut('products', products);
  }
  return products;
}

export function applyTheme(profile) {
  const theme = profile.theme === 'system'
    ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : profile.theme;
  document.documentElement.dataset.theme = theme;
}

export function initializeShell(profile, page, title, subtitle) {
  setupAppShell({ page, title, subtitle });
  applyTheme(profile);
  const themeButton = $('#theme');
  if (themeButton) {
    themeButton.onclick = async () => {
      const currentlyDark = document.documentElement.dataset.theme === 'dark';
      profile.theme = currentlyDark ? 'light' : 'dark';
      applyTheme(profile);
      await db.put('settings', { key: 'profile', value: profile });
    };
  }
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(console.warn);
}

export function download(name, text, type) {
  const anchor = document.createElement('a');
  anchor.href = URL.createObjectURL(new Blob([text], { type }));
  anchor.download = name;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(anchor.href), 1000);
}

export function csvCell(value) {
  const text = value == null ? '' : String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export function csv(rows) {
  if (!rows.length) return '';
  const keys = [...new Set(rows.flatMap(Object.keys))];
  return [keys.join(','), ...rows.map((row) => keys.map((key) => csvCell(row[key])).join(','))].join('\n');
}

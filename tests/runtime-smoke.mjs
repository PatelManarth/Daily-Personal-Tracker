import { readFileSync } from 'node:fs';

const files=['app-part-1.txt','app-part-2.txt','app-part-3.txt','app-part-4.txt','app-part-5.txt'];
const source=files.map(file=>readFileSync(new URL(`../${file}`,import.meta.url),'utf8')).join('');
new Function('db','DEFAULT_PROFILE','DEFAULT_PRODUCTS','DEFAULT_RECIPES','ROUTINE_REMINDERS','AUTHORITY_NOTE','renderLineChart',source);
for (const required of ['renderToday','saveDaily','renderMeals','renderWeekly','exportJson','importJson','register']) {
  if (!source.includes(required)) throw new Error(`Runtime is missing ${required}.`);
}
console.log(`Validated reconstructed tracker runtime (${source.length} characters).`);

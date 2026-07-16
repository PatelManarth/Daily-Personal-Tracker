import {db} from './db.js';
import {DEFAULT_PROFILE,DEFAULT_PRODUCTS,DEFAULT_RECIPES,ROUTINE_REMINDERS,AUTHORITY_NOTE} from './data.js';
import {renderLineChart} from './charts.js';
const files=['app-part-1.txt','app-part-2.txt','app-part-3.txt','app-part-4.txt','app-part-5.txt'];
const source=(await Promise.all(files.map(async file=>{const response=await fetch(file);if(!response.ok)throw new Error(`Unable to load ${file}`);return response.text()}))).join('');
new Function('db','DEFAULT_PROFILE','DEFAULT_PRODUCTS','DEFAULT_RECIPES','ROUTINE_REMINDERS','AUTHORITY_NOTE','renderLineChart',source)(db,DEFAULT_PROFILE,DEFAULT_PRODUCTS,DEFAULT_RECIPES,ROUTINE_REMINDERS,AUTHORITY_NOTE,renderLineChart);

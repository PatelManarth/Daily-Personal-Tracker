export const DEFAULT_PROFILE={
  "name": "Manarth Patel",
  "timezone": "America/Toronto",
  "heightCm": 159,
  "sex": "Male",
  "startDate": "2026-07-13",
  "startWeightKg": 74,
  "baselineAverageKg": 73.8,
  "goalWeightKg": 61,
  "deadline": "2026-11-09",
  "calorieMin": 1500,
  "calorieMax": 1600,
  "proteinMin": 110,
  "proteinTarget": 120,
  "walkStart": "08:00",
  "walkEnd": "09:00",
  "walkTargetMinutes": 60,
  "structuredExerciseCapMinutes": 20,
  "weeklyCheckInDay": "Sunday",
  "weightUnit": "kg",
  "measurementUnit": "cm",
  "waterMinL": 2.5,
  "waterMaxL": 3,
  "sleepTargetHours": 7,
  "theme": "system"
};
export const DEFAULT_PRODUCTS=[
  {"key":"dieselProtein","productName":"DIESEL protein powder","servingWeight":"35 g","calories":120,"protein":24,"carbs":null,"fat":null,"fibre":null,"dateUpdated":"2026-07-16"},
  {"key":"neilsonMilk","productName":"Neilson 2% milk","servingWeight":"100 ml","calories":50,"protein":3.4,"carbs":null,"fat":null,"fibre":0,"dateUpdated":"2026-07-16"},
  {"key":"homemadeCurd","productName":"Homemade curd from 2% milk","servingWeight":"100 g","calories":60,"protein":3.5,"carbs":null,"fat":null,"fibre":0,"dateUpdated":"2026-07-16"},
  {"key":"dempstersBread","productName":"Dempster's Protein White","servingWeight":"2 slices / 86 g","calories":220,"protein":14,"carbs":null,"fat":null,"fibre":2,"dateUpdated":"2026-07-16"},
  {"key":"gustaTurkey","productName":"Gusta turkey-flavoured slices","servingWeight":"3 slices","calories":50,"protein":8,"carbs":null,"fat":null,"fibre":null,"dateUpdated":"2026-07-16"},
  {"key":"gustaSausage","productName":"Gusta sausage","servingWeight":"1 sausage / about 88 g","calories":190,"protein":21,"carbs":null,"fat":null,"fibre":null,"dateUpdated":"2026-07-16"},
  {"key":"gustaGround","productName":"Gusta Original Veggie Ground","servingWeight":"55 g","calories":70,"protein":9,"carbs":null,"fat":null,"fibre":null,"dateUpdated":"2026-07-16"},
  {"key":"cheese","productName":"Light cheese","servingWeight":"20 g","calories":50,"protein":5,"carbs":null,"fat":null,"fibre":0,"dateUpdated":"2026-07-16"},
  {"key":"tofu","productName":"Firm tofu","servingWeight":"Enter package serving","calories":null,"protein":null,"carbs":null,"fat":null,"fibre":null,"dateUpdated":""},
  {"key":"paneer","productName":"Paneer","servingWeight":"Enter package serving","calories":null,"protein":null,"carbs":null,"fat":null,"fibre":null,"dateUpdated":""}
];
export const ENUMS={
  "yesNo":["Yes","No"],
  "walkStatus":["Yes","Partial","No"],
  "walkEffort":["Easy","Conversational","Moderately challenging"],
  "walkSetting":["Outdoor","Indoor treadmill","Indoor mall","Other"],
  "exerciseType":["None","Band workout A","Band workout B","Yoga","Modified Surya Namaskar","Mobility","Other"],
  "digestion":["Normal","Gas/bloating","Constipation","Loose stools","Reflux","Other","Unsure"],
  "weightContext":["High-sodium meal","Alcohol","Late meal","Constipation","Travel","Illness","Poor sleep","Other"],
  "adjustmentType":["No change","Calorie adjustment","Protein adjustment","Walking adjustment","Exercise adjustment","Meal-structure adjustment","Digestion adjustment","Schedule adjustment"],
  "status":["Pending","Completed","Skipped","Not applicable"]
};
export const ROUTINE_REMINDERS=[
  {"time":"07:15","label":"Morning weigh-in"},
  {"time":"08:00","label":"Start morning walk"},
  {"time":"09:05","label":"Breakfast"},
  {"time":"13:00","label":"Lunch"},
  {"time":"17:00","label":"Planned work snack"},
  {"time":"22:45","label":"Finish Cronometer and check top-up"}
];
export const SAFETY_RULES=[
  "Do not routinely eat below 1,500 kcal.",
  "Never use dehydration, fluid restriction, laxatives, starvation, or extreme fasting to reach the goal.",
  "Review complete two-week trends before changing calories, steps, or exercise.",
  "Walking is separate from the 20-minute structured-exercise cap.",
  "Stop and seek medical assessment for swelling, locking, giving way, inability to bear weight, chest pain, fainting, or unusual breathlessness."
];
export const AUTHORITY_NOTE="Cronometer and current package labels control the final daily totals.";

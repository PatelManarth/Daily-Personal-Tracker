# Daily Personal Tracker

A focused, mobile-first, local-first fat-loss tracking Progressive Web App for Manarth Patel. The product specification is based on the **Dr. Vance Flexible Living Fat-Loss Handbook v3.1** and the companion **Daily & Weekly Website Tracker v1.0** workbook.

## Fixed plan

- Official start: **74.0 kg on 13 July 2026**
- Goal: **61.0 kg or below on or before 9 November 2026**
- Calories: **1,500–1,600 kcal/day**
- Protein: **110–120 g/day**
- Morning walk: **08:00–09:00 daily**
- Structured movement: **maximum 20 minutes per session**
- Daily structure: one breakfast, one lunch, one snack, and zero or one late protein top-up

## Product boundary

Cronometer remains the source of truth for calories, protein, carbohydrates, fat, fibre, package-label entries and custom recipes. The website handles personalized meal selection, daily logs, trends, weekly check-ins, measurements, movement, adjustment history, charts, exports and reminders.

## Local-first architecture

- Static GitHub Pages application
- IndexedDB for personal records
- Installable offline Progressive Web App
- JSON full backup and restore
- Separate CSV coaching exports
- No personal records committed to the Git repository
- No fake client-side password gate

Clearing browser/site data can erase records, so the application must display a Sunday backup reminder. This version does not automatically synchronize across devices or browsers.

## Required modules

1. Today dashboard
2. Daily log
3. Meal builder and complete recipe library
4. Product-label overrides
5. Weekly Sunday check-in
6. Body measurements
7. Walking and structured movement calendar
8. Progress charts
9. Permanent adjustment history
10. Settings, JSON backup/restore, CSV exports and calendar routine file

## Core interpretation rules

- Formal averages and goal recognition use only normal-condition morning weigh-ins.
- A reliable seven-day average requires at least four valid readings.
- Coaching decisions use the fourteen-day trend whenever possible.
- The application never changes calories or activity automatically.
- Review the complete two-week trend before changing calories, steps or exercise.
- Never recommend eating below 1,500 kcal, dehydration, laxatives, deliberate fluid restriction, extreme fasting or excessive exercise.

## Nutrition authority

**Cronometer and current package labels control the final daily totals.** Recipe values in the app are editable planning estimates only.

## Reference documents reviewed

- `Dr_Vance_Manarth_Flexible_Fat_Loss_Handbook_v3_1.pdf` — 47-page plan, recipe library, flavour instructions, movement guidance, packing rules and weekly adjustment protocol.
- `Dr_Vance_Manarth_Daily_Weekly_Website_Tracker_v1_0.xlsx` — sheets for START HERE, Dashboard, Daily Log, Weekly Check-ins, Measurements, Adjustment Log, Meal Codes, Website Field Map and Lists.

## Deployment

When the application files are committed, enable GitHub Pages through **Settings → Pages → Deploy from a branch → main / root**.

# Daily Personal Tracker

A mobile-first, installable and offline-ready personal fat-loss tracking Progressive Web App for Manarth Patel.

The application follows the **Dr. Vance Flexible Living Fat-Loss Handbook v3.1** and the companion **Daily & Weekly Website Tracker v1.0** workbook.

## Fixed plan

- Start: **74.0 kg on 13 July 2026**
- Goal: **61.0 kg or below on or before 9 November 2026**
- Calories: **1,500-1,600 kcal/day**
- Protein: **110-120 g/day**
- Morning walk: **08:00-09:00 daily**
- Structured movement: **maximum 20 minutes per session**
- Meal structure: one breakfast, one lunch, one snack and zero or one late top-up

## Nutrition authority

**Cronometer and current package labels control the final daily totals.**

Recipe values in this app are editable planning estimates. The application does not attempt to recreate Cronometer's food database.

## Included features

- Today dashboard focused on immediate actions
- One editable daily record per local calendar date
- Normal-condition morning weigh-in validation
- Seven-day average, two-week trend and required trajectory
- Complete B1-B9, L1-L10, S1-S10 and T1-T3 recipe library
- Editable recipe estimates and branded product settings
- Meal builder with neutral planning warnings
- Morning walking, steps, structured movement and pain tracking
- Sleep, water, hunger, energy, stress and digestion tracking
- Monday-Sunday weekly summaries and guided Sunday check-ins
- Body measurements and charts
- Permanent adjustment history
- JSON backup and restore with a pre-import backup
- Separate CSV coaching exports
- Daily-routine iCalendar export
- Light/dark mode, large tap targets and phone-first layout
- IndexedDB local storage and service-worker offline support

## Privacy model

Personal records stay in IndexedDB inside the browser. They are not written into the public repository. See [PRIVACY.md](PRIVACY.md).

Clearing browser data can erase records. Export a JSON backup every Sunday.

## Run locally

No build step or paid service is required.

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

Run the built-in checks with:

```bash
npm test
```

## GitHub Pages deployment

The repository includes `.github/workflows/pages.yml`. Every push to `main` runs the checks and deploys the static application.

For the first deployment, open:

**Repository Settings -> Pages -> Build and deployment -> Source -> GitHub Actions**

After the workflow succeeds, the default site address is:

`https://patelmanarth.github.io/Daily-Personal-Tracker/`

## Safety rules implemented

- Calories below 1,500 are highlighted neutrally and are never praised.
- The app never recommends dehydration, laxatives, deliberate fluid restriction, starvation, extreme fasting or excessive exercise.
- Walking is separate from the structured-exercise limit.
- Exercise over 20 minutes warns but does not block saving.
- Formal weight calculations use only valid normal-condition morning readings.
- A reliable seven-day average requires at least four valid readings.
- Plan adjustments are manual and documented.
- The app repeatedly states: **Review the complete two-week trend before changing calories, steps or exercise.**

# RAMS Generator

A mobile-friendly single-page web app that generates **Risk Assessment and Method Statement (RAMS)** documents for UK event setups: festivals, corporate events, weddings and outdoor shows.

It has no build step, no dependencies and no backend. Everything runs in the browser.

## Features

- **Event details:** event name, date, venue, client, event type and (optionally) who prepared it.
- **Activity selection:** tick any of:
  - Power distribution
  - Staging
  - Marquee or tent
  - Fencing and barriers
  - Lighting and sound rigging
  - Vehicle movements
  - Working at height
  - Manual handling
- **Risk assessments:** a table for each ticked activity, plus a general site conditions table, with columns for *hazard*, *who might be harmed*, *existing controls*, *risk rating* (low / medium / high) and *further actions*.
- **Method statement:** numbered steps for **setup**, **during the event** and **pack-down**, grouped by activity, with general induction and handover steps around them.
- **Specific UK controls:** for example, 30 mA RCDs on every final circuit with time-delayed upstream RCDs and daily test-button checks; cable protectors rated for pedestrians or vehicles, with planned cable routes; Heras fence stays and ballast at set intervals, with extra bracing for clad runs; physical separation of pedestrians and vehicles, with banksman rules and plant exclusion zones; and wind loading on marquees, stages, towers, fencing and MEWPs.
- **Wind action plan:** for outdoor events, section 5 adds a table for each wind-sensitive structure in use. It gives amber and red actions, with blank spaces for the design gust and trigger speeds, which must come from each structure's own design figures.
- **PPE and emergency arrangements:** the PPE list follows the activities you ticked; the emergency contact table is left blank to fill in.
- **Sign-off:** a declaration with a name, role, signature and date table (pre-filled with any staff names you enter, plus blank rows), and an approval block.
- **Editable before printing:** click any text in the generated document to change it, and tap a risk rating to cycle it between low, medium and high.
- **Print / Save as PDF:** uses the browser's print dialogue, with A4 print styles. Choose "Save as PDF" as the printer to get a PDF.
- **Event-type aware:** wording follows the audience (e.g. "guests" for weddings, "festival-goers" for festivals). Weather and wind rows (marked `outdoor: true` in `data.js`) and the wind action plan are left out for corporate events unless a marquee is in use.
- **Remembers your form:** form entries are saved in your browser's local storage, so a refresh doesn't lose them. "Clear form" wipes them.

## Running it

Open `index.html` in any modern browser. That's all.

To serve it locally (useful for testing on a phone on the same network):

```bash
python3 -m http.server 8000
# then visit http://localhost:8000 (or http://<your-computer-ip>:8000 from a phone)
```

To host it, upload the four files to any static host (GitHub Pages, Netlify, an S3 bucket and so on).

## Files

| File         | Purpose                                                          |
|--------------|------------------------------------------------------------------|
| `index.html` | Page structure and form                                          |
| `styles.css` | Screen styles (mobile-first) and print styles                    |
| `app.js`     | Form handling, validation, document rendering and print          |
| `data.js`    | Content library: hazards, controls, ratings and method steps     |

## Customising the content

All the wording lives in `data.js`, so you can tailor it to your company without touching the app logic.

- **Edit hazards:** each activity has a `hazards` array of `{ hazard, who, controls, rating, actions }`. `rating` must be `'low'`, `'medium'` or `'high'`.
- **Edit method steps:** each activity has `method.setup`, `method.during` and `method.packdown` arrays.
- **Add an activity:** add a new key under `activities` with a `label`, `short` description, `hazards` and `method`. A checkbox for it appears on the form automatically.
- **Add an event type:** add an entry under `eventTypes`, then add a matching `<option>` to the event type `<select>` in `index.html`.
- **Wind action plan rows:** edit the `windPlan` array. Each row is linked to an activity key.
- **Outdoor-only rows:** add `outdoor: true` to a hazard to hide it for indoor (corporate) events.
- **Audience wording:** `{public}` in any text is replaced with the event type's `public` value.

## Legislation and guidance referenced

The default content refers to UK legislation and industry guidance, including the Health and Safety at Work etc. Act 1974, the Management of Health and Safety at Work Regulations 1999, CDM 2015, the Work at Height Regulations 2005, LOLER 1998, the Manual Handling Operations Regulations 1992, the Control of Noise at Work Regulations 2005, RIDDOR, BS 7909 (temporary power for events), BS EN 13782 (tents) and the Purple Guide.

## Disclaimer

This tool produces a **starting template**, not a finished safety document. Every RAMS must be reviewed, adapted to the specific site, venue, contractors and event, and approved by a competent person before work starts. The authors accept no liability for how generated documents are used.

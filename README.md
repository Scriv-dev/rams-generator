# RAMS Generator

**Draft Risk Assessments and Method Statements (RAMS) for UK event setups in minutes.**

Live site: https://scriv-dev.github.io/rams-generator/

> **Disclaimer:** every RAMS this tool produces is a **draft**. A competent person must check it, adapt it to the specific site, venue, contractors and event, and approve it before work starts. It does not replace your duty to carry out a suitable and sufficient risk assessment under the Management of Health and Safety at Work Regulations 1999. See [Disclaimer](#disclaimer).

## What it does

You enter the event details (name, date, venue, client and type), tick the activities happening on site, and the tool builds a structured RAMS document. It includes:

- risk assessment tables with hazards, who might be harmed, existing controls, low / medium / high ratings and further actions
- a method statement with numbered setup, during-event and pack-down steps
- a PPE list, a wind action plan for outdoor structures, emergency arrangements and a sign-off sheet

You can then edit any text, save the RAMS in your browser to reopen later, and print it or save it as a PDF for sign-off.

## Who it's for

UK event companies and the people who have to hand a venue, client or safety officer a RAMS before they're allowed on site:

- **Event and production companies** running festivals, corporate events, weddings and outdoor shows
- **Site contractors**: staging, marquee, fencing, power and rigging crews
- **Small teams and freelancers**, such as crew chiefs and production managers without a health and safety department
- **Venue and event managers** who want a structure to check supplier RAMS against

It runs entirely in the browser, with no account, server or build step. Nothing you type is uploaded.

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
- **Save, reopen, edit and delete:** tap **Save RAMS** to store the generated document, including any text or rating changes, in your browser. The **Saved RAMS** list on the start screen shows each one with its event date, venue, type and when it was last saved.
  - **Open** brings back the document exactly as you saved it. Keep editing in place, then tap **Save changes**.
  - **Edit details** takes you back to the form with that RAMS's details filled in. Generating again updates the same saved RAMS, but rebuilds the document, so text changed in the document itself is replaced.
  - **Delete** needs a second tap within a few seconds, so a stray tap can't lose work.
  - The app warns you before you leave the page or open another RAMS with unsaved changes.
  - Saved RAMS stay in this browser on this device only. They don't sync between devices, and clearing site data deletes them. Most browsers allow about 5 MB, which is enough for dozens of documents.
- **Remembers your form:** form entries are saved in your browser's local storage, so a refresh doesn't lose them. "Clear form" wipes them.

## Running it

Use the live site, or open `index.html` in any modern browser. The landing page links to the generator (`app.html`).

To serve it locally (useful for testing on a phone on the same network):

```bash
python3 -m http.server 8000
# then visit http://localhost:8000 (or http://<your-computer-ip>:8000 from a phone)
```

To host it, upload the files to any static host (GitHub Pages, Netlify, an S3 bucket and so on).

## Files

| File          | Purpose                                                          |
|---------------|------------------------------------------------------------------|
| `index.html`  | Landing page: what the tool does, who it's for, disclaimer       |
| `landing.css` | Landing page styles                                              |
| `app.html`    | The generator: form, saved RAMS list and document view          |
| `styles.css`  | App screen styles (mobile-first), print styles, shared tokens    |
| `app.js`      | Form handling, validation, rendering, saving and printing        |
| `data.js`     | Content library: hazards, controls, ratings and method steps     |

## Customising the content

All the wording lives in `data.js`, so you can tailor it to your company without touching the app logic.

- **Edit hazards:** each activity has a `hazards` array of `{ hazard, who, controls, rating, actions }`. `rating` must be `'low'`, `'medium'` or `'high'`.
- **Edit method steps:** each activity has `method.setup`, `method.during` and `method.packdown` arrays.
- **Add an activity:** add a new key under `activities` with a `label`, `short` description, `hazards` and `method`. A checkbox for it appears on the form automatically.
- **Add an event type:** add an entry under `eventTypes`, then add a matching `<option>` to the event type `<select>` in `app.html`.
- **Wind action plan rows:** edit the `windPlan` array. Each row is linked to an activity key.
- **Outdoor-only rows:** add `outdoor: true` to a hazard to hide it for indoor (corporate) events.
- **Audience wording:** `{public}` in any text is replaced with the event type's `public` value.

## Legislation and guidance referenced

The default content refers to UK legislation and industry guidance, including the Health and Safety at Work etc. Act 1974, the Management of Health and Safety at Work Regulations 1999, CDM 2015, the Work at Height Regulations 2005, LOLER 1998, the Manual Handling Operations Regulations 1992, the Control of Noise at Work Regulations 2005, RIDDOR, BS 7909 (temporary power for events), BS EN 13782 (tents) and the Purple Guide.

## Disclaimer

Every RAMS this tool produces is a **draft**: a starting point based on common UK event practice, not a finished safety document.

- A **competent person** must check every document, adapt it to the specific site, venue, contractors and event, and approve it before work starts.
- Wind speeds, load ratings and other figures must come from your own suppliers' design calculations and manuals.
- Using this tool does not replace your duty to carry out a suitable and sufficient risk assessment under the Management of Health and Safety at Work Regulations 1999.

The authors accept no liability for how generated documents are used.

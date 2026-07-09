# How to help with this trip

You are helping organize one trip into a clean, private web page. The person you are
helping may not be technical. Do the work for them; explain only what they need to decide.

## What this repo is
- A **private** repo holding the editable trip: `docs/` (the source of truth) and
  `index.html` (the viewable page built from those docs).
- A guided script publishes an **encrypted, password-protected** copy of `index.html`
  to a separate **public** repo (`<slug>-page`) served by GitHub Pages.

## One folder = one trip (check this FIRST)
Each trip lives in its own copy of this starter. Before organizing anything, check `trip.config`:
- If `trip.config` does NOT exist yet → this is a fresh copy. Good, proceed.
- If `trip.config` exists and its `TRIP_NAME` matches the trip they're describing → you're updating that same trip. Proceed.
- If `trip.config` exists but names a DIFFERENT trip (e.g. it says Taiwan and they're now asking about Japan) → STOP. This folder already holds another trip; reusing it would overwrite that trip's docs and publish to the wrong page. Tell them to get a FRESH copy of the starter — on GitHub, click "Code → Download ZIP" and unzip it into a new folder — and open Claude there, then set up the new trip in that fresh copy.

## The workflow

### 1. Intake — they paste travel info
Accept anything: forwarded confirmation emails, booking snippets, screenshots-as-text,
loose notes. Never demand a format.

### 2. Organize — route each item into `docs/`
- Flights → `docs/flights.md` (airline, flight #, date, depart/arrive times + airports,
  confirmation code, seats, baggage).
- Lodging → `docs/hotels.md` (name, full address, check-in/out dates, confirmation code, phone).
- Day-by-day plans → `docs/itinerary.md`.
- Tours / tickets / reservations / things to do → `docs/activities.md`.
- Anything ambiguous or leftover → `docs/notes.md`, and ask one short clarifying question.
Extract concrete details (dates, times, codes, addresses, phone numbers) into a clean,
consistent layout. Keep it skimmable.

### 3. Build — regenerate `index.html` from `docs/`
Replace everything between `<!-- TRIP-CONTENT:START -->` and `<!-- TRIP-CONTENT:END -->`
with the current trip content, one `<section>` per docs file that has content. Update the
`<title>` and the `<header><h1>` to the trip name. Do not touch anything outside the markers.

### 4. Publish
- First time only: run `bash setup-trip.sh`. It asks for the trip name and their GitHub
  username, then creates the private and public repos and enables the page. `gh` must be
  installed and authenticated (`gh auth login`) — if it isn't, tell them and stop.
- Every time (including the first, after setup): run `bash tools/publish.sh`. It will ask
  them to type a page password directly in the terminal — you cannot type it for them, so
  tell them to enter it. The password is never stored.
- After it finishes, give them the link from `trip.config` (`PAGES_URL`). It may take ~1
  minute to go live.

### 5. Updating later
When they paste more info ("we booked the hotel"), repeat Organize → Build → `tools/publish.sh`.

## Reusing features from another trip
Sometimes the user wants a feature they built in a previous trip (a photo gallery,
a custom layout, etc.).
- You can only copy from another trip if you can **see its folder**. If you can't,
  tell them to open the folder that contains both trips (e.g. their `Trips` folder)
  so you can access both, then copy the feature over.
- If a feature is generally useful, offer to add it to their **`trip-starter`
  master** folder so every future trip they copy inherits it.
- Trip content (photos, confirmation codes, details) stays per-trip — only the
  feature/code carries over.
- If a feature adds media such as images, remember only the page HTML is encrypted:
  plan protection for those files too, or clearly warn the user before publishing
  anything private.

## Security rules (non-negotiable)
- **Never** put plaintext confirmation codes or personal details into the public
  `<slug>-page` repo. Only the encrypted `index.html` from `publish.sh` belongs there.
- Never write the page password to a file or commit it.
- The private repo stays private. Do not change repo visibility.

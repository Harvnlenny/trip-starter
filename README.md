# Trip Starter ✈️

Turn your travel confirmations into one clean, password-protected web page —
just by chatting with Claude. No tech skills needed.

> 🔖 **Bookmark this page** (https://github.com/Harvnlenny/trip-starter) so you
> can find it again.

## What you'll end up with
A private link like `https://<your-username>.github.io/<your-trip>-page/`,
protected by a password you pick, showing your flights, hotels, and plans in one
tidy place. **Claude creates everything and publishes it for you — you never run
any commands.**

## Before your very first trip (one-time setup)
You need three things, once:
- The **Claude app** installed.
- A free **GitHub account** (sign up at github.com).
- The **GitHub CLI** installed and signed in.

Easiest way: open Claude and say **"help me get set up for trip pages"** — it'll
walk you through all three. You only ever do this once.
*(Comfortable in a terminal? You can instead install the GitHub CLI and run
`gh auth login` yourself.)*

## Get the starter (once)
1. Go to **https://github.com/Harvnlenny/trip-starter**, click the green **Code**
   button → **Download ZIP** (it saves to **Downloads**).
2. **Double-click** `trip-starter-main.zip` to unzip it. Rename the folder to
   **`trip-starter`** and move it somewhere easy to find — a **Trips** folder in
   your Home folder is ideal (in Finder: **Go → Home**, **File → New Folder**,
   name it `Trips`).
3. **This folder is your master — leave it as-is.** You'll make a copy of it for
   each trip, so you never have to download it again.

## Make a trip page
1. **Copy your master.** In your Trips folder, right-click **`trip-starter`** →
   **Duplicate**. Rename the copy to your trip (e.g. `taiwan`).
2. **Open the copy in Claude:**
   - **Claude app (easiest):** open the **Claude app**, choose **Code**, and when
     it asks which folder to work in, pick your trip copy and click **Open**. Just
     a folder picker — nothing to type.
   - **Terminal (if you prefer):** open **Terminal** (**⌘ + Space** → `Terminal`),
     type `cd ` (with a space), **drag your trip copy from Finder onto the Terminal
     window**, press **Return**, type `claude`, press **Return**.
3. **Tell Claude about your trip.** Say **"Set up my trip"**, give the trip name,
   and paste in your travel info — flights, hotels, anything. It doesn't need to be
   tidy. Claude sorts it out, then creates your GitHub repos and publishes your
   page for you.
4. **Type your password.** A small **password box pops up** — pick a password for
   your page and type it in. It stays on your computer and is never saved. Share it
   only with people you want to see the trip.
5. **Done ✈️** Claude gives you your private link. It may take about a minute to go
   live.

## Add or change details later
Open the same trip's folder in Claude again, paste any new info ("we booked the
hotel"), and say **"update the page."**

## Your next trip
Just **duplicate your `trip-starter` master again** and repeat — one copy per trip.
No re-downloading. Each trip gets its own private page. Don't reuse a previous
trip's folder, or you'd overwrite it.

## Reuse features across trips
Built something you love in one trip (a photo gallery, a custom layout)? Two ways
to carry it forward:
- **Just this once:** open your **Trips** folder in Claude (so it can see both
  trips), then say *"copy the photo gallery from my Taiwan trip into this one."*
- **For every future trip:** ask Claude to add the feature to your **`trip-starter`
  master**. Every copy you make after that already has it.

Your photos and details stay per-trip — only the feature carries over.

## What Claude is doing for you (optional)
You never run these yourself, but for the curious: Claude runs `setup-trip.sh`
once to create your two GitHub repos — a **private** one for your details and a
**public** one that hosts only the *encrypted* page — then `tools/publish.sh` to
encrypt and publish it. Your confirmation codes are only ever public in encrypted
form.

# Trip Starter ✈️

Turn your travel confirmations into one clean, password-protected web page — by just
chatting with Claude.

## Use it
1. Open this folder in Claude.
2. Say: **"Set up my trip"**, tell it your trip name, and paste in your travel info —
   flights, hotels, anything. It doesn't need to be tidy.
3. Claude organizes it, builds your page, and helps you publish it.
4. You'll get a private link like `https://<your-username>.github.io/<your-trip>-page/`,
   protected by a password you choose.

## One-time requirement
You need a free [GitHub](https://github.com) account and the GitHub CLI installed and
signed in:
```
brew install gh
gh auth login
```
Claude will tell you if this step is still needed.

## For each new trip
Get a **fresh copy** of this starter for each trip — download it again ("Code → Download ZIP"
into a new folder, or clone it into a new folder) and open Claude there. Each trip gets its own
private repo and its own page. Don't reuse a previous trip's folder — that would overwrite it.
On your first trip with a new copy, run `setup-trip.sh` to create your repos.

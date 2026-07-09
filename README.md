# Trip Starter ✈️

Turn your travel confirmations into one clean, password-protected web page — by just
chatting with Claude.

## Use it
1. On GitHub, click **Code → Download ZIP**, then unzip it into a new folder (one folder per trip).
2. Open that folder in Claude.
3. Say: **"Set up my trip"**, tell it your trip name, and paste in your travel info —
   flights, hotels, anything. It doesn't need to be tidy.
4. Claude organizes it, builds your page, and helps you publish it.
5. You'll get a private link like `https://<your-username>.github.io/<your-trip>-page/`,
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
Download a **fresh copy** for each trip — click **Code → Download ZIP** and unzip it into a new
folder. Each trip gets its own private repo and its own page. Don't reuse a previous trip's
folder — that would overwrite it. In the new folder, just ask Claude to set up the trip (it runs
`setup-trip.sh` for you) to create your repos.

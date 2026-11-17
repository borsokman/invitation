# Family dinner invitation

Static page for GitHub Pages + a free Google Sheet that collects answers.

```
index.html   invitation page (Kyrgyz) with RSVP
gallery.html full photo gallery (grid + full-screen viewer)
guests.html  PRIVATE guest list for you (asks for the secret key)
style.css    styles
script.js    RSVP logic
bg.js        background: all photos shuffled, changing every 3 s
photos.js    list of photos — add a new file's name here after dropping it into photos/ (names are case-sensitive on GitHub Pages)
photos/      photos used for the background and the gallery
config.js    ← paste your Google Apps Script URL here
apps-script/Code.gs   backend for the Google Sheet (not used by GitHub Pages)
```

## 1. Create the Google Sheet backend (≈5 min)

1. Go to https://sheets.new and name the sheet, e.g. "Обед 21 ноября".
2. **Extensions → Apps Script**. Delete the sample code and paste everything from `apps-script/Code.gs`. Save.
3. **Deploy → New deployment** → gear icon → **Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click **Deploy**, allow the permissions (Google warns "unverified app" — choose *Advanced → Go to project*; it's your own script).
5. Copy the **Web app URL** (ends with `/exec`).
6. Open `config.js` and paste it:
   ```js
   window.RSVP_URL = "https://script.google.com/macros/s/XXXX/exec";
   ```

### Your private guest list

Guests only see the RSVP form, not who else is coming.
To see the list, open `guests.html` (e.g. `https://<your-username>.github.io/family-dinner/guests.html`)
and enter the secret key from the `ADMIN_KEY` line in `Code.gs`. The page remembers it on that device.
Change `ADMIN_KEY` to any word you like before deploying. Without the key the script returns nothing.
The Google Sheet itself is also private to your Google account.

Answers appear in the **RSVP** tab of the sheet: time, name, Барам / Бара албайм.
Each name gets its own row (the "+ Дагы бирөөнү кошуу" button lets one person add family members).
The number of rows marked "Барам" is your headcount. If someone answers again with the same name, their row is updated.

> If you edit `Code.gs` later, use **Deploy → Manage deployments → Edit → New version** so the URL stays the same.

## 2. Publish on GitHub Pages

1. Create a new public repo on GitHub (e.g. `family-dinner`).
2. Upload all files and the `photos/` folder. **Do NOT upload `apps-script/`** (it contains your secret key). Also skip `.claude/` and `README.md`.
   Note: on a free GitHub account the repo must be public for Pages, so the photos are visible to anyone with the link. The pages ask search engines not to index them.
3. **Settings → Pages** → Source: *Deploy from a branch*, Branch: `main` / root → Save.
4. After a minute the page is live at `https://<your-username>.github.io/family-dinner/`. Share that link.

Without a URL in `config.js` the page works in demo mode (answers are kept only in your own browser) — handy for checking the look before setup.

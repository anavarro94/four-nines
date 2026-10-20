# Four Nines — website + office app

Free to run: GitHub Pages hosts the pages, a Google Sheet stores your data.

| File | What it is |
|---|---|
| `index.html` | Customer site — services, photos, quote form, tap-to-call/text |
| `admin.html` | Your office app — jobs, quote requests, customers, quotes/invoices, expenses |
| `config.js` | **Edit this** — phone, email, services, prices, photos |
| `style.css` | Look and colors |
| `google-sheet-backend.gs` | Goes in Google Sheets, not GitHub (step 2) |

## 1. Put the site on GitHub Pages
1. On github.com, create a new **public** repository, e.g. `four-nines`.
2. **Add file → Upload files** → upload `index.html`, `admin.html`, `config.js`, `style.css` (skip the `.gs` file).
3. **Settings → Pages** → Source: *Deploy from a branch* → Branch: `main`, folder `/ (root)` → Save.
4. In a minute your site is live at `https://YOUR-USERNAME.github.io/four-nines/`
   Office app: `https://YOUR-USERNAME.github.io/four-nines/admin.html` — bookmark it / Add to Home Screen.

The site works right away: the quote form opens a text to your phone, and the office app saves on that device only.

## 2. Connect the Google Sheet (syncs phone + computer, receives website requests)
Easiest on a computer, ~10 minutes, one time.
1. Go to sheets.new — name it **Four Nines**.
2. **Extensions → Apps Script**. Delete what's there, paste all of `google-sheet-backend.gs`.
3. Change `SECRET` to your own passcode. Optional: put your email in `NOTIFY_EMAIL` to get an email for every quote request.
4. Pick `setup` in the function menu → **Run** → allow permissions (it's your own script; click *Advanced → Go to project*).
5. **Deploy → New deployment** → gear → *Web app*. Execute as: **Me**. Who has access: **Anyone**. Deploy → copy the URL.
6. On GitHub, edit `config.js` → paste the URL into `scriptUrl: ""` → Commit.
7. Open `admin.html`, enter your passcode. Done.

Customer photos land in a Drive folder called *Four Nines Quote Photos*. Your Sheet has a tab for each list, so you can also view/sort it there.

If you edit the script later: **Deploy → Manage deployments → Edit → Version: New version** (keeps the same URL).

## Notes
- The office page is protected by your passcode; your data lives only in your Google account. The Sheet itself is private.
- **Backups:** office app → ⚙ → Download backup.
- **Custom domain** (e.g. fourninesllc.com): buy one (~$12/yr), then Settings → Pages → Custom domain.
- **Before/after photos:** upload images into an `img` folder in the repo and list them in `config.js` under `gallery`.

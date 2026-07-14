# Lucas Amstalden — Portfolio Site

A single-page, dark-themed portfolio site (HTML/CSS/JS, no build step) covering your
experience, skills, and 3 GitHub projects. Ready to host for free on GitHub Pages.

Files:
- `index.html` — content/structure
- `style.css` — styling (dark theme, red/cyan accents, responsive)
- `script.js` — nav scroll effect, mobile menu, scroll-reveal animations

---

## 1. Preview it locally

Just double-click `index.html` to open it in a browser. Or, from a terminal in this folder:

```
python -m http.server 8000
```

then visit `http://localhost:8000`.

---

## 2. Deploy for free — GitHub Pages

You already have a GitHub account (`lucas-amstal`), so this is the fastest path.

1. Go to github.com and create a **new repository** named exactly:
   ```
   lucas-amstal.github.io
   ```
   (Using your username as the repo name makes GitHub host it at the root domain
   `https://lucas-amstal.github.io` instead of a `/repo-name/` subpath.)
   Leave it public, no README/gitignore needed.

2. Push these 3 files to that repo's `main` branch:
   ```
   git init
   git remote add origin https://github.com/lucas-amstal/lucas-amstal.github.io.git
   git add index.html style.css script.js README.md
   git commit -m "Launch portfolio site"
   git branch -M main
   git push -u origin main
   ```

3. In the repo, go to **Settings → Pages**. Under "Build and deployment", source should
   already default to "Deploy from a branch" / `main` / `/ (root)`. Save if needed.

4. Within a minute or two, your site is live at:
   ```
   https://lucas-amstal.github.io
   ```

To update the site later, just edit the files and `git push` again — it redeploys automatically.

---

## 3. Add visit tracking — GoatCounter (free, no login wall for visitors)

1. Go to **https://www.goatcounter.com/signup** and create a free account.
2. Pick a site code, e.g. `lucasamstalden` → your dashboard becomes
   `https://lucasamstalden.goatcounter.com`.
3. Open `index.html`, find this line near the bottom:
   ```html
   <script data-goatcounter="https://YOUR-CODE.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>
   ```
   Replace `YOUR-CODE` with your actual site code.
4. Commit and push the change.
5. Visit your GoatCounter dashboard any time to see page views, visitor counts, referrers
   (which recruiter/site sent someone), and browser/location breakdowns — no cookie banner needed.

---

## 4. Optional next steps

- **Custom domain** (e.g. `lucasamstalden.com`): buy one from any registrar, then add a
  `CNAME` file with the domain name to this repo and configure DNS — GitHub's docs walk
  through this under Settings → Pages → Custom domain.
- **Add your photo**: replace the `.photo-placeholder` block in `index.html` (search for
  `LA</span>` inside `photo-placeholder`) with an `<img src="photo.jpg" alt="Lucas Amstalden">`
  tag, and drop `photo.jpg` in this folder.
- **Deploy the other 2 Streamlit dashboards** (`wiki-stream-pipeline`, `nyc-taxi-lakehouse`)
  to Streamlit Community Cloud the same way `housing-price-ml` was, then add "Live demo"
  links to the matching project cards in `index.html`.
- **Tailor for Swiss recruiters**: consider adding a one-line note about work-permit status
  (EU citizenship via Italian passport helps a lot for Swiss employers) near the hero or contact section.

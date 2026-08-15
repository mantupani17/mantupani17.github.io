# Your Portfolio

A single-page developer portfolio built with plain HTML, CSS, and JS — no build tools,
no frameworks. All content lives in `data.json`, and `script.js` fetches it and renders
the page at load time.

## Files

- `index.html` — page structure/shell only (no content — content comes from data.json)
- `data.json` — **all your content**: name, bio, skills, projects, experience, contact
- `style.css` — all styling
- `script.js` — fetches `data.json` and renders every section into the page

## 1. Edit your content

Open `data.json` in any text editor. It's a plain JSON object with these sections:

- `profile` — name, title, location, email, phone, résumé link, and the short fields
  shown in the hero's title block
- `hero` — the big headline, subheadline, and intro paragraph
- `about` — up to a few paragraphs (`paragraphs`), plus three stat callouts (`facts`)
- `skills` — an array of categories, each with a `category` name and a list of `items`
- `projects` — an array of project cards. Each needs `code`, `year`, `title`,
  `description`, `tags` (array), and either `status` (a plain text label like
  "Client project — Acme Inc") or `links` (an array of `{ "label": "...", "href": "..." }`)
  for real repo/live links
- `experience` — an array of roles, each with `dateRange`, `role`, `company`, `description`
- `contact` — a lead paragraph and a `links` array of `{ "label": "...", "href": "..." }`

Add, remove, or reorder items freely — the page re-renders from whatever is in the array.
You do **not** need to touch `index.html`, `style.css`, or `script.js` for content changes.

**One thing still needs your input** in `data.json`:
- `profile.resumeUrl` points to `/resume.pdf`. A merged `resume.pdf` is already included in
  this folder — just make sure it's uploaded alongside `index.html` when you push to
  GitHub Pages, or swap in a newer version any time your CV changes.

If you ever break the JSON syntax (missing comma, unmatched bracket), the page will show
an error message in the hero instead of your content — check your edit against the
original structure, or paste it into a JSON validator.

## 2. Preview it locally

Because the page loads `data.json` via `fetch()`, opening `index.html` by double-clicking
it **will not work** in most browsers (fetch is blocked on the `file://` protocol). You
need a local server. With Python installed, run this from the folder:

```
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## 3. Host it for free on GitHub Pages

1. Create a free account at [github.com](https://github.com) if you don't have one.
2. Click **New repository**. Name it exactly `yourusername.github.io`
   (replace `yourusername` with your actual GitHub username — this exact naming
   pattern is what makes GitHub Pages serve it as a site automatically).
   Make it **Public**.
3. Upload `index.html`, `style.css`, `script.js`, `data.json` (and `resume.pdf` if you
   have one) to the repository — either drag-and-drop them on the GitHub web page
   ("Add file" → "Upload files"), or via git:

   ```
   git init
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/yourusername/yourusername.github.io.git
   git push -u origin main
   ```

4. In the repository, go to **Settings → Pages**. Under "Build and deployment",
   set **Source** to "Deploy from a branch", branch `main`, folder `/ (root)`. Save.
5. Wait 1–2 minutes, then visit `https://yourusername.github.io` — your portfolio is live.
   GitHub Pages serves files over HTTP, so `fetch('data.json')` works fine there even
   though it doesn't work with a plain double-clicked file.

Any time you push a change to `data.json`, the live site updates automatically within a
minute or two — you never need to touch the HTML/CSS/JS again for content updates.

### If you'd rather not use the special `username.github.io` repo name

You can name the repo anything (e.g. `portfolio`) and still use GitHub Pages — the site
will just live at `https://yourusername.github.io/portfolio/` instead of the root domain.
Same Settings → Pages steps apply.

## 4. Optional: a custom domain

If you later buy a domain (e.g. from Namecheap or Cloudflare), GitHub Pages supports
it for free — add it under **Settings → Pages → Custom domain**, and point your
domain's DNS at GitHub's servers (GitHub shows you the exact records to add).

## Notes on the design

The layout borrows from engineering drawing sheets — the "title block" in the hero
mirrors the stamp found on real technical drawings, and each section is numbered like
a sheet in a drawing set. Fonts: Space Grotesk (headings), IBM Plex Sans (body),
IBM Plex Mono (labels/data) — loaded free from Google Fonts, no license cost.

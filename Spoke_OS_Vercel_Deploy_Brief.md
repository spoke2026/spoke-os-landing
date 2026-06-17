# Spoke OS v1 — Vercel Deployment Brief

## What you are deploying

A single-file HTML application. One file: `Spoke_OS_v1.html`. No build process, no framework, no dependencies to install locally. Pure HTML, CSS, and JavaScript.

## File to deploy

`Spoke_OS_v1.html` (approximately 579 KB)

---

## Dependency audit: everything the file needs to work

### 1. Fully self-contained (no action needed)

The following are embedded directly inside the HTML file and will work with zero external dependencies:

- **Both Spoke logos** — embedded as inline SVG inside the HTML. No external image files needed.
- **DOCX download** — the Sales Workflow Build Brief is embedded as a base64 data URI. Clicking Download full brief will download the file directly from the HTML. No server-side handling needed.
- **All CSS** — written inline in `<style>` tags. No external stylesheet files.
- **All JavaScript** — tab navigation, sprint task checkboxes, scenario builder sliders and chart rendering, Planner export function — all written inline in `<script>` tags at the end of the file.
- **PNG images inside SVG logos** — the SVG logo files contain embedded PNG bitmaps as base64 xlink:href references. These are self-contained inside the SVG.

### 2. External dependencies (require internet access to render correctly)

These are loaded from CDN at runtime. They will work on any internet-connected device automatically. No action needed for deployment, but note they require internet access:

**Google Fonts**
```
https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap
```
Used for: all typography throughout the document (DM Serif Display italic for headings, DM Sans for body text).
If this fails (offline or blocked): the document falls back to system serif/sans-serif fonts. Functional but not brand-correct.

**Chart.js**
```
https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js
```
Used for: the stacked bar chart in the Budget tab scenario planning model.
If this fails: the sliders and summary cards still work. Only the bar chart will not render.

### 3. Embedded iframe (requires separate authentication)

**Spoke Sales Performance Dashboard**
```
https://dashboard-sales.spoke.nz
```
Embedded in the Budget tab as a live iframe. The dashboard is password-protected with HTTP Basic Authentication. When a user views the Budget tab, the browser will prompt for the Spoke dashboard username and password before displaying it. This is expected behaviour.

The iframe will work correctly on Vercel as long as dashboard-sales.spoke.nz remains live and does not set X-Frame-Options headers (tested: it does not, iframe embedding is permitted).

---

## Vercel deployment steps

### Option A: Vercel CLI (fastest)

```bash
# Install Vercel CLI if not already installed
npm install -g vercel

# Create a project folder
mkdir spoke-os
cd spoke-os

# Copy the HTML file in and rename to index.html
cp /path/to/Spoke_OS_v1.html ./index.html

# Deploy
vercel --prod
```

Vercel will detect a static site automatically. No configuration file needed.

### Option B: Vercel dashboard (no CLI required)

1. Go to vercel.com and log in
2. Click New Project
3. Choose "Upload" or drag and drop a folder
4. Create a folder on your computer, put `Spoke_OS_v1.html` inside it, rename the file to `index.html`
5. Drag that folder into Vercel
6. Click Deploy

### Option C: GitHub integration

1. Create a GitHub repo
2. Add `Spoke_OS_v1.html` renamed as `index.html`
3. Connect the repo to Vercel
4. Vercel auto-deploys on every push

---

## Critical: rename the file to index.html

Vercel serves `index.html` as the root URL. If the file is named `Spoke_OS_v1.html` it will be accessible at `/Spoke_OS_v1.html` not at the root `/`. Rename it to `index.html` before deploying.

---

## Optional: vercel.json configuration

Not required, but if you want to add a custom domain, password protection, or security headers, create a `vercel.json` file in the same folder:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

For password protection across the entire Spoke OS (recommended for an internal document), use Vercel's built-in Password Protection feature in the project settings. This is available on Vercel Pro plans.

---

## What will work after deployment

| Feature | Works | Notes |
|---|---|---|
| All five tabs (Home, Vision, Strategy, Budget, Execution) | Yes | Pure HTML/JS |
| Sprint task checkboxes | Yes | State held in localStorage per browser session |
| Scenario builder sliders | Yes | Requires Chart.js CDN |
| Stacked bar chart | Yes | Requires Chart.js CDN |
| Download full brief button | Yes | Base64 embedded, no server needed |
| Planner export button | Yes | Generates text, no server needed |
| Spoke logos | Yes | Inline SVG |
| Google Fonts typography | Yes | Requires internet |
| Sales dashboard iframe | Yes | Requires password on first load |
| All internal tab navigation | Yes | JavaScript onclick |

---

## File checklist before deploying

- [ ] File renamed to `index.html`
- [ ] File is the latest version from Claude outputs (Spoke_OS_v1.html)
- [ ] No other files needed in the folder

That is everything. One file, rename to index.html, drag into Vercel.

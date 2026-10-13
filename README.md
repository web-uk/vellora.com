# Vellora Connect

Premium boutique mentoring website for Jesiel Machado. Static HTML/CSS/vanilla JavaScript, English by default with a Portuguese toggle. Brand palette: `#142D32`, `#E8D9BB`, `#F7F5F0`, `#363D40`.

## Short changelog — boutique redesign

- Rebuilt the layout with a standalone statement, numbered mentoring steps, compact horizontal formats and first-person About copy.
- Added a custom abstract Champagne symbol, a 17px/16px body scale, larger buttons and restrained reveal/hover motion.
- Rewrote both languages in Jesiel’s first person; added illustrative audience situations and card-to-form selection.
- Replaced adjective proof items with config-driven verified statistics. Kept testimonials and contact channels gated.
- Generated meaningful static English HTML, self-hosted licensed fonts, and added responsive image and photo-based sharing-image scripts.

## Latest update — compact layout and new hero

- Replaced the discarded individual-portrait layout with the supplied landscape hero (`assets/Hero.jpg.png`). Original retained; optimised JPG/WebP sizes generated for the website.
- Desktop uses the banner behind the copy; mobile shows the whole image above the copy to keep the faces visible.
- Replaced arrow characters with inline SVGs and FAQ plus/minus glyphs with CSS shapes, preventing emoji substitution.
- Reduced section, card and list spacing; removed the empty About portrait area.
- Rendered the 1200×630 sharing card with the new image and refreshed the desktop/mobile screenshots.

## Editing

- Copy: `content/en.json` and `content/pt.json`.
- Contacts, verified stats and authorised hero: `assets/config.js`.
- Design: `assets/style.css`; static HTML composition: `scripts/build.mjs`.
- After editing English copy, run `npm run build` and commit the generated `index.html` and `privacy.html`. Visitors receive real English content without JavaScript. JavaScript switches text when a language is chosen and configures interactions.
- `stats` accepts `{value, label}` entries. Each can be a string or `{en, pt}`. Empty entries are hidden; an empty array hides the whole band. Never add unverified statistics.
- Audience situations are illustrative possibilities, not testimonials or client claims.

## Photography and sharing image

1. Keep the supplied original at `assets/Hero.jpg.png` (a PNG despite its double extension).
2. Run `npm ci --cache /workspace/work/npm-cache` (a writable cache directory is required in this workspace).
3. Run `npm run images`, then `npm run build`. The image script creates `assets/hero.jpg` and 640/1280/1920px WebP/JPG derivatives.
4. Run `npm run og`. This renders `templates/og.html` to a 1200×630 PNG using the actual photo, mark, wordmark and tagline. It uses the supplied banner after image preparation. If no hero asset exists, the site build safely omits the image and renders a teal hero.
5. Commit all source and generated assets. Do not generate substitute people or use an unauthorised portrait.

The browser scripts use `/usr/bin/chromium`; set `CHROMIUM_PATH` to another installed Chromium binary when needed. No browser is installed by these scripts. The browser-facing website has no package dependency or build service requirement.

## Contacts and safeguards

Fill `email`, `whatsapp` (international digits only), and `formspreeEndpoint`. Complete the privacy notice in both languages with the legal operator, privacy contact, lawful basis, retention period and provider/transfer details. Only then set `privacyReady: true`.

The form is disabled in static HTML and stays disabled unless **both** the valid Formspree endpoint and privacy-ready flag are set. It never simulates a successful enquiry. WhatsApp and email appear only after their values are configured. Real testimonials remain hidden unless explicitly enabled and populated with authorised names and context.

## Validation and screenshots

Start a static server from the repository root: `python3 -m http.server 8000 --bind 127.0.0.1`.

- `node scripts/check.mjs`: 1440/390px overflow and typography checks, EN/PT, card selection, stats filtering, contact gate, intercepted submission, static no-JS content and axe WCAG A/AA checks. The form test is intercepted locally and sends no message.
- `SCREENSHOT_DIR=/absolute/output/path node scripts/screenshots.mjs`: full-page 1440px and 390px PNGs, with reveals and lazy-loaded images settled.
- Set `PREVIEW_URL` if the server uses a different URL.
- `npm run og`: render the social sharing card from the HTML template.

## Publication

`.github/workflows/pages.yml` deploys the committed static files on pushes to `main`. Settings → Pages → Source must be GitHub Actions. If the first run reports `Resource not accessible by integration`, activate Pages in those settings and rerun the workflow.

Live URL: https://web-uk.github.io/vellora.com/ . A repository name does not set up a custom domain. For a custom domain, configure DNS and Pages, then update canonical URLs, sharing URLs, robots and sitemap.

For Netlify, import the repository, use no build command and `.` as the publish directory. The form uses Formspree independently of hosting.

## Still needed from the client

- Official email, international WhatsApp number and Formspree endpoint.
- Legal operator and completed privacy/data-handling details.
- Approval of the first-person biography, service formats and languages offered.
- Optional verified additional statistics and genuine testimonials with consent.
- Optional official social profiles and custom-domain/DNS details.

## Privacy and licences

No analytics, advertising cookies or third-party font requests. Only the language preference is stored in localStorage. Licensed Cormorant Garamond and Inter fonts are self-hosted in `assets/fonts/`, with their licence files. The texture is a procedural SVG noise filter, not an image of a person.

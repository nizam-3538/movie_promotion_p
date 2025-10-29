## Movie Promotion Project — README

This repository is a small, static promotional site for a film (working title "F1 [2025]"). It includes a single-page layout (`index.html`), styles (`style.css`), behavior (`script.js`), and media assets in `assets/`.

This README explains each and every part of the project files so you, or another developer, can understand, maintain, and extend the site.

---

## Quick start

- Open `index.html` in a browser (double-click or serve the folder using a static server).
- The page is static — no build tools required.

---

## Project files (high-level)

- `index.html` — the HTML document: document structure, metadata, content sections (header, marquee, media, reviews, watch links, ratings, footer) and an embedded JSON-LD block.
- `style.css` — the stylesheet: CSS custom properties, layout rules, decorative background animations, responsive rules, and lightbox styles.
- `script.js` — the client-side JavaScript: DOM ready handler, interactive tilt effect, marquee population + accessibility behavior, animated views counter, and a lightbox implementation.
- `assets/poster.jpg` — poster image used by the page as the visual poster and `video` poster attribute.
- `assets/trailer.mp4` — local trailer used in the `<video>` element and available for the lightbox.

---

## File: index.html — detailed explanation

Top-level and meta
- `<!DOCTYPE html>` — declares HTML5, enabling modern parsing/behavior.
- `<html lang="en">` — language of the page; used by screen readers and search engines.
- `<head>` contains metadata:
  - `<meta charset="UTF-8">` — sets character encoding (UTF-8) to correctly display text and symbols.
  - `<meta name="viewport" content="width=device-width, initial-scale=1.0">` — makes layout responsive on mobile devices.
  - `<meta name="author" content="Page Owner Name">` and `<meta name="owner" content="owner@example.com">` — author/contact metadata (not required but useful for static pages).
  - `<title>241FA04605</title>` — page title shown in the browser tab. Currently a code-like value; change to a readable movie title if desired.
  - `<link rel="stylesheet" href="style.css">` — loads the main stylesheet.
  - Google font link — loads the `Orbitron` font used by the design.

Body structure
- Three decorative background layers: `<div id="stars"></div>`, `<div id="stars2"></div>`, `<div id="stars3"></div>`.
  - These are purely decorative and referenced by CSS to create a parallax/starfield background.
  - They are placed before main content and layered behind it using `z-index:-1` in CSS.

- Main wrapper: `<div class="container">` — centers the content and constrains max width.

Header
- `<header>` contains:
  - `<h1 class="movie-title">F1 [2025]</h1>` — primary title (visually prominent, uses `Orbitron`).
  - `<p class="tagline">BREAKING THE LIMITS OF SPEED</p>` — a subtitle/tagline.
  - A marquee section: `.marquee-wrap` > `.marquee` with a `data-scroll` attribute.
    - The marquee text is read from the `data-scroll` attribute by `script.js` and duplicated to create a seamless loop.
    - Accessibility: the marquee is focusable in JS (`tabIndex = 0`) and animation pauses on hover/focus.

Main content
- `<main>` breaks content into semantic sections:
  1. `.media-section` — shows the poster image and an HTML5 `<video>` element for the trailer.
     - Poster container: `<div id="poster-container">` contains `<img class="poster-image" src="assets/poster.jpg">`.
     - Trailer container: `<video class="poster-image" controls src="assets/trailer.mp4" poster="assets/poster.jpg">` — native controls, uses poster image while video not playing.
     - Both containers have the class `.tilt-element` which wires up a mouse-based 3D tilt effect in `script.js`.

  2. `.reviews-section` — shows a `Critical Reviews` heading, a views counter, and a grid of review cards.
     - Views counter: `<strong id="views">0</strong>` — animated from `0` to `1.2M` by `script.js` after load.
     - `.reviews-grid` contains several `.review-card` nodes with headings, rating (stars as characters), review text, and `.reviewer` attribution.

  3. `.watch-section` — lists streaming platforms (OTT) with links to Netflix, Prime, Disney+, and Apple TV+.
     - Each platform is an anchor `.ott-link` containing an inline SVG icon and a label.
     - Links include `target="_blank" rel="noopener noreferrer"` for safe, cross-origin opening.

  4. `.ratings-section` — links to external rating pages (IMDb and Rotten Tomatoes) with small icon + score blocks (`.rating-card`).

Footer
- `.site-footer` contains owner/contact info and copyright.

JSON-LD
- `<script type="application/ld+json">` — structured data for search engines. Currently contains a `Person` object:
  - `@context`, `@type`, `name`, `email`, and `url`.
  - Note: `email` value uses `mailto:` in the example; search engines prefer a plain email string or omitted to avoid spam. This JSON-LD is optional.

Script include
- `<script src="script.js"></script>` — loads the behavior file at the end of the body so the DOM is available.

Accessibility notes in `index.html`
- Landmark elements (`header`, `main`, `footer`) help screen-reader navigation.
- The marquee is focusable and pauses on hover/focus to avoid motion sickness.
- `aria-live="polite"` is used on the views counter container so screen readers will announce the updated number politely.

---

## File: script.js — detailed explanation

Overall pattern
- The script waits for `DOMContentLoaded` before running, ensuring the DOM is present.

Tilt effect
- `const tiltElements = document.querySelectorAll('.tilt-element');` — selects elements that should tilt on mouse movement.
- For each element:
  - `mousemove` event computes the cursor position relative to the element's center and sets a `transform` style with `perspective`, `rotateX`, `rotateY`, and slight `scale3d(1.05)`.
  - `mouseleave` resets the transform to a neutral state with scale 1.

Why this approach?
- It provides a lightweight, JavaScript-based 3D hover effect. It's purely visual and degrades gracefully (no JS = no tilt).

Marquee behavior and accessibility
- The script reads the marquee text from `.marquee[data-scroll]` and duplicates it with a separator to create a continuous loop.
- It makes the marquee focusable (`tabIndex = 0`) and pauses animation on `mouseenter`, `mouseleave`, `focus`, and `blur` to respect users who need reduced motion.

Views counter (animateViews)
- Self-invoking `animateViews` function:
  - Targets element with `id="views"`.
  - `target = 1200000` and `duration = 10000` (10 seconds).
  - Uses `requestAnimationFrame` with an `easeOutCubic` easing (`1 - (1 - t)^3`) to animate from 0 to the target.
  - `formatNumber` converts numbers to `K`/`M` formats for compact display (e.g., `1.2M`).

Lightbox (modal) implementation
- `createLightbox()` creates a backdrop DOM node with `.lightbox-backdrop` and `.lightbox-content` containing a close button and `.iframe-wrap` container.
- `openLightbox(videoUrl)` accepts either a remote URL (assumed to be embeddable like YouTube) or a local video file. It checks `isLocalVideo` via regex:
  - For local video (`.mp4`, `.webm`) it injects an HTML5 `<video>` with `controls autoplay playsinline muted`.
  - For other URLs it injects an `<iframe>` with autoplay query params and `allow="autoplay; fullscreen"`.
- `closeLightbox()` clears the container and hides the backdrop, restoring body scrolling.

Event delegation
- A single `document.addEventListener('click', ...)` handler delegates clicks on elements with `.poster-link` or `.open-trailer` to open the lightbox, and closes it when clicking the backdrop or `.lightbox-close`.
- `keydown` listener closes the lightbox on `Escape`.

Notes and potential edge cases
- Autoplay with sound is blocked on many browsers; the implementation uses `muted` on local `<video>` and `mute=1` for iframe queries to improve autoplay chances. Users may need to manually unmute.
- If a remote URL isn't embeddable (CSP or X-Frame-Options deny), the iframe will fail to load. Consider opening such links in a new tab instead or offering a fallback play page.

---

## File: style.css — detailed explanation

CSS custom properties (variables)
- `--primary-color: #00f5ff;` — main accent color used for the title, glows, and links.
- `--secondary-color: #ff00c1;` — secondary accent used for reviewer names and scores.
- `--dark-bg`, `--card-bg`, `--glow-1` — background and card colors to build the neon / dark aesthetic.

Global rules
- `*{box-sizing:border-box;margin:0;padding:0}` — predictable box model and removal of default margins/padding.
- `body` uses `Orbitron`, dark background, and hides horizontal overflow.

Decorative star background
- Keyframes `move-twink-back` animate `background-position` to give parallax motion to three stacked background `div`s (`#stars`, `#stars2`, `#stars3`).
- Note: The images referenced in CSS come from an external CDN; if offline usage is needed, replace these URLs with local images and update `style.css`.

Layout
- `.container{max-width:1200px;margin:0 auto;padding:2rem}` — centers content and limits width.
- `.media-section` uses flex layout with gap and wrapping to be responsive.

Cards and reviews
- `.review-card` and `.ratings-card` are styled with semi-transparent `--card-bg`, subtle borders, and color accents.

Marquee
- `.marquee-wrap` hides overflow while `.marquee` is an inline-block element with `white-space:nowrap` and an `animation: marquee-linear 33s linear infinite`.
- The JS duplicates the text to form a continuous loop so the visual animation doesn't show abrupt gaps.

Where to watch (OTT)
- `.ott-link` is an inline-flex button-like anchor with a subtle gradient background and hover/ focus transform.

Lightbox styles
- `.lightbox-backdrop` is a full-screen fixed overlay that centers `.lightbox-content`.
- `.lightbox-content` uses `aspect-ratio:16/9` and `max-width:1100px` — this keeps the video framed nicely on desktop and scales on mobile.

Responsive rules
- `@media (max-width:768px)` adjusts widths and font sizes so the page works on smaller screens.

---

## Assets

- `assets/poster.jpg` — used in two places: as an `<img>` poster and as the `poster` attribute on the `<video>` element. Replace with a higher-resolution image if you need print-quality poster assets.
- `assets/trailer.mp4` — local video file used as the `src` of the `<video>` element and playable in the lightbox as a local video fallback.

Notes:
- Keep media files small enough to load reasonably on first visit. Consider serving large media through a CDN or adaptive bitrate streaming for production.

---

## Contract (tiny)

- Inputs: static HTML, CSS, video and image assets, and user interactions (mouse, keyboard) in a modern browser.
- Outputs: a responsive promotional page with animated UI (tilt, marquee, views counter) and a lightbox that plays media.
- Error modes: missing assets (404) will show broken image/video UI; remote iframe embeds may be blocked by X-Frame-Options.

---

## Edge cases and testing checklist

- Missing assets: open `index.html` in the browser DevTools Network tab to check 404s for `poster.jpg` or `trailer.mp4`.
- Autoplay blocked: test whether the trailer will autoplay muted; if not, verify fallback behavior.
- Non-embeddable remote trailers: test opening a third-party URL in the lightbox; check console for CSP or X-Frame-Options errors.
- Keyboard accessibility: tab to the marquee (it should pause) and confirm Escape closes the lightbox.

---

## Suggested small improvements (proactive extras)

- Replace external CSS background image URLs with local files (put into `assets/`) for offline reliability.
- Add `loading="lazy"` to the poster `<img>` for faster LCP on low-bandwidth connections.
- Make the lightbox focus-trap accessible (trap the tab focus inside the modal while open) and restore focus to the triggering element when closed.
- Add a small unit test (Playwright / Puppeteer) to assert that the views counter runs and the lightbox opens/closes.

---

## How to run / verify locally

1. Open `index.html` in your browser. For full video control, use a simple static server (recommended) to avoid some browser restrictions for local files. Example commands (PowerShell):

```powershell
# from the project folder
# Python 3.x (if installed):
python -m http.server 8000

# Then open http://localhost:8000/ in your browser
```

2. Verify:
- Poster displays and scales.
- Trailer plays in-place using native controls.
- Click the poster (or any configured `.open-trailer` element) to open the lightbox.
- The views counter animates to `1.2M` after load.

---

## Attribution / author

- Page owner metadata is present in `index.html` (`Page Owner Name`, `owner@example.com`). Update as appropriate.

---

If you'd like, I can:
- Add `loading="lazy"` to the poster image and update CSS to include a small fallback color while it loads.
- Implement focus-trap behavior for the lightbox and add a tiny test that exercises the views counter and the lightbox open/close.

If you want line-by-line comments inserted directly into the source files (e.g., commented HTML with explanations inline), tell me which file(s) and I will add them.

---

Requirements coverage
- Explain each file and major part: Done (README added).
- Create README and add explanation: Done (`README.md` created).

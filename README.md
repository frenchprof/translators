# french.translators.asia

Static site for Fr·En·Ch, an embassy-listed sworn translator (French · English · 中文) in Singapore.

- `index.html` — single page, English source content
- `assets/styles.css` — design tokens, light/dark themes, responsive layout
- `assets/i18n.js` — EN / FR / ZH dictionary (keys must match `data-i18n*` attributes)
- `assets/main.js` — language switch, theme toggle, reveal animations, quote form (Formspree + WhatsApp hand-off)

No build step. Serve the folder as-is (e.g. `python3 -m http.server`).

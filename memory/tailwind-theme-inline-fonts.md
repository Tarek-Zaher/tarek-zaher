---
name: tailwind-theme-inline-fonts
description: Why global.css must use `@theme inline` for the next/font CSS-variable font utilities
metadata:
  type: project
---

In `styles/global.css`, the font `@theme` block **must** be `@theme inline` (not plain `@theme`).

The `--font-*` utilities reference `next/font` variables (`--font-family-*`) that are defined on a wrapper `<div>` in `pages/_app.js`, not at `:root`. Plain `@theme` emits `--font-libre-baskerville: var(--font-family-libre-baskerville), …` at `:root`, where the next/font var is out of scope, so it collapses to the generic fallback and every `font-*` utility silently renders the system/serif fallback instead of the real font. `@theme inline` inlines the value into each utility so the `var()` resolves at the element (inside the wrapper), where the next/font var is in scope.

**Why:** a 2026-05 refactor (CSS-class-based fonts) broke all fonts this way. **How to apply:** keep `@theme inline`; keep the `fontVariables` wrapper div in `_app.js`; don't move font imports into `_document.js` (next/font's CSS side-effect isn't injected from there in the pages router).

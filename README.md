# DefiWay Pay Landing Page

Modern, responsive landing page for DefiWay Pay built with Vite, modular CSS, and vanilla JavaScript.

- Live reference for copy/IA and external links: [pay.defiway.com](https://pay.defiway.com/)

## Overview

- Modular CSS by section with a centralized design system (`design-system.css`)
- Semantic, responsive HTML aligned to Figma visuals (1920px desktop as source of truth)
- Glassmorphism effects (gradients + backdrop blur) implemented as utilities
- Smooth scrolling and form validation in lightweight vanilla JS
- Accessibility: focus-visible outlines and reduced-motion support

## Quick Start

``
# Install deps
npm install

# Start dev server (HMR)
npm run dev

# Build production assets to dist/
npm run build

# Preview local production build
npm run preview
```

Default dev server runs at http://localhost:3000 (see terminal output).

## Project Structure

```
defiway_pay/
├── src/
│   ├── index.html                    # Landing markup and section anchors
│   ├── js/
│   │   └── main.js                   # Smooth scroll, form validation, utilities
│   ├── styles/
│   │   ├── main.css                  # Imports all modular CSS
│   │   ├── design-system.css         # Tokens, gradients, utilities, typography
│   │   ├── base.css                  # Reset, base layout, a11y, containers
│   │   ├── header.css                # Header layout and interactions
│   │   ├── footer.css                # Footer grid/card
│   │   ├── buttons.css               # Button components, gradient borders
│   │   ├── forms.css                 # Reusable form styles and consent checkbox
│   │   └── sections/
│   │       ├── hero.css
│   │       ├── benefits.css
│   │       ├── crypto-device.css
│   │       ├── usdt.css
│   │       ├── additional-benefits.css
│   │       ├── partners.css
│   │       └── contact-us.css
│   └── assets/                       # Images, icons, logos (by section)
├── vite.config.js
└── package.json
```

## Design System (CSS Variables)

Defined in `src/styles/design-system.css` under `:root` as design tokens.

- Colors: `--color-*` (brand, glass layers)
- Gradients: `--gradient-*` and utilities: `.gradient-text-*`, `.bg-glass-*`
- Typography: weights/sizes/line-heights (`--font-*`, `--font-size-*`, `--line-height-*`)
- Spacing: `--space-*` (fine-grained 4..152px steps)
- Radius: `--radius-*` including `--radius-full` and `--radius-2xl`
- Effects: `--backdrop-blur*`
- Layout: `--container-*` widths per breakpoint
- Section-specific tokens: USDT/benefits widths, gaps, heights

Text gradient utilities reflect Figma:

```css
.gradient-text-primary {
  background: linear-gradient(90.51deg, rgba(0, 0, 0, 0.5) -11.04%, rgba(72, 197, 199, 0) 100.36%), #FFFFFF;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

Glass backgrounds (backdrop blur applied as needed):

```css
.bg-glass-secondary {
  background: linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(83,190,198,0.2) 100%);
  backdrop-filter: blur(100px);
}
```

## Sections and Anchors

`src/index.html` sections (each with an anchor for deep links and in-page nav):

- `#hero`
- `#benefits`
- `#crypto-device`
- `#usdt`
- `#additional-benefits`
- `#partners`
- `#contact`

Header external links map to live subdomains for parity with the Pay site:

- Bridge → `https://bridge.defiway.com`
- Wallet → `https://wallet.defiway.com`
- Pay → `https://pay.defiway.com/`
- PayRoll → `https://payroll.defiway.com`
- Treasury → `https://defiway.com/treasury`
- Company → `https://defiway.com`

“Get in touch” and “Get free consultation” buttons use `#contact` to scroll to the contact form.

## Scripts (src/js/main.js)

- DOM utilities: `$` and `$$`
- Debounce helper for perf-sensitive events
- MobileMenu (structure prepared; only activates if corresponding elements exist)
- ConsultationForm: field-level validation, basic submit simulation, accessible errors
- SmoothScroll: in-page anchor scrolling; centers target in viewport and focuses first field
- ScrollAnimations: intersection-based progressive reveal (if present)

Smooth scroll details:

```js
const targetRect = target.getBoundingClientRect();
const targetPosition = Math.max(
  0,
  Math.floor(targetRect.top + window.pageYOffset - window.innerHeight / 2 + targetRect.height / 2)
);
window.scrollTo({ top: targetPosition, behavior: 'smooth' });
```

## Styles

- `main.css` imports all modules: design system, components, base, layout, and sections
- `base.css` handles resets, containers, and accessibility (`:focus-visible`)
- `buttons.css` provides gradient borders via masked pseudo-elements and motion fallbacks
- `forms.css` standardizes inputs and the consent checkbox (visually hidden input + custom check)

Images use responsive-safe defaults:

```css
#defiway-landing img { max-width: 100%; height: auto; }
```

## Accessibility

- Visible focus indicators via `:focus-visible`
- Motion-safe defaults with `prefers-reduced-motion` in interactive components
- Keyboard-friendly form controls; labels and error messages programmatically added

## Performance

- Lightweight vanilla JS; debounce utility for scroll/resize
- IntersectionObserver for staged animations (gracefully ignored if unsupported)
- Vite bundling and minification for production builds

## SEO

- Descriptive `<title>`, `<meta name="description">`, OpenGraph/Twitter tags
- JSON-LD Organization schema in `<head>`

## Deployment

Build and deploy static files from `dist/` to any static host or CDN.

```bash
npm run build
# Upload dist/ to hosting/CDN
```


## Contributing

- Follow the modular structure; keep section-specific styles in `src/styles/sections/*`
- Prefer design tokens over hard-coded values (colors, spacing, typography, radii)
- Keep HTML semantic

## License

Proprietary. All rights reserved by DefiWay.

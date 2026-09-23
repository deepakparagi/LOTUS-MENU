# LOTUS HOTEL INN — Digital Menu

A refined QR-powered digital dining experience designed for **LOTUS HOTEL INN**.

━━━━━━━━━━━━━━━━━━━━

### OVERVIEW

This project is a premium, mobile-first digital menu system engineered for seamless table-side ordering and browsing. By scanning a bespoke QR code, guests are instantly immersed in a luxury digital environment that perfectly reflects the physical elegance of LOTUS HOTEL INN. 

The architecture is entirely static and lightweight, prioritizing ultra-fast loading over mobile networks without sacrificing a high-end visual aesthetic.

━━━━━━━━━━━━━━━━━━━━

### LIVE EXPERIENCE

**View the live digital menu here:**
[LOTUS HOTEL INN Menu](https://deepakparagi.github.io/LOTUS-MENU/)

**Generate a Tabletop QR Card:**
[QR Generator](https://deepakparagi.github.io/LOTUS-MENU/qr-card/)

━━━━━━━━━━━━━━━━━━━━

### FEATURES

- **QR-Based Access:** Instant load with no app downloads required.
- **Mobile-First Design:** Fluid layout optimized for all modern smartphones.
- **Premium Menu Viewer:** High-fidelity image gallery with smooth transitions.
- **Serial Card Navigation:** Effortlessly page through the curated menu sections.
- **Fullscreen Viewing:** Distraction-free, immersive full-bleed image display.
- **Graceful Fallbacks:** Intelligent loading logic handles missing images without breaking the UI.
- **Lightweight Architecture:** Zero-backend, pure HTML/CSS/JS deployed statically for maximum performance and security.

━━━━━━━━━━━━━━━━━━━━

### MENU STRUCTURE

The menu is designed to guide guests through a curated culinary journey:

* **00** — Welcome
* **01** — Beverages / Soups / Salads
* **02** — Snacks / Vegetarian Starters
* **03** — Non-Vegetarian Starters / Tandoor & Grill
* **04** — Vegetarian Main Course
* **05** — Non-Vegetarian Main Course
* **06** — Biryani / Rice / Indian Breads
* **07** — Global Favourites
* **08** — Desserts & Sweet Finishes
* **09** — Thank You

━━━━━━━━━━━━━━━━━━━━

### PROJECT STRUCTURE

```text
LOTUS-MENU/
├── index.html           # Main digital menu entry point
├── main.js              # Application logic (lazy loading, lightbox, animations)
├── style.css            # Luxury design system and responsive layout
├── package.json         # Project dependencies (Vite)
├── vite.config.js       # Vite configuration for GitHub Pages deployment
├── qr-card/
│   └── index.html       # Standalone QR card generation and print utility
└── LOTUS/
    ├── 00.jpg           # Menu images (dynamically loaded)
    ├── 1.jpg
    ├── 2.jpg
    └── ...
```

━━━━━━━━━━━━━━━━━━━━

### HOW IT WORKS

1. **Scan:** A guest scans the tabletop QR code.
2. **Land:** They arrive at the LOTUS landing page, greeted by the signature ambient particle effect.
3. **Browse:** The menu collection is presented as elegant, lazy-loaded cards.
4. **Select:** Tapping a section opens it.
5. **Immerse:** The fullscreen viewer allows for distraction-free reading, with intuitive left/right navigation to page through the menu.

━━━━━━━━━━━━━━━━━━━━

### ADDING NEW MENU CARDS

Menu images are loaded dynamically from the `/LOTUS/` directory.

**Naming Convention:**
Images must be named serially. The first and last images use zero-padding, while the interior pages are single digits:

```text
LOTUS/
  00.jpg
  1.jpg
  2.jpg
  3.jpg
  4.jpg
  5.jpg
  6.jpg
  7.jpg
  8.jpg
  09.jpg
```

**Supported Formats:**
The system automatically attempts to load `.jpg`, `.jpeg`, `.png`, and `.webp`. If an image is temporarily missing, the system gracefully hides that section rather than displaying broken links.

━━━━━━━━━━━━━━━━━━━━

### LOCAL DEVELOPMENT

To run this project locally:

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **View the app:**
   Open `http://localhost:5173` in your browser.

━━━━━━━━━━━━━━━━━━━━

### DEPLOYMENT

This project is configured for free static hosting via **GitHub Pages**.

Because the project is built with Vite, the `vite.config.js` is set up with a base path of `/LOTUS-MENU/` to ensure all relative asset paths resolve correctly on GitHub Pages.

To deploy updates, simply commit to the `main` branch. GitHub Pages will automatically serve the static content.

━━━━━━━━━━━━━━━━━━━━

### DESIGN SYSTEM

- **Typography:** *Playfair Display* for luxurious, editorial headings. *Inter* for highly legible, modern UI text.
- **Color Palette:** Deep Charcoal (`#0A0A0A`) layered with Champagne Gold (`#D4A574`, `#C49B5A`) and Warm Ivory (`#FFF8E7`).
- **Spacing:** Generous, airy padding to create a feeling of exclusivity and calm.
- **Animations:** Subtle particle floats, gentle hover lifts, and fluid modal transitions to make the interface feel alive but restrained.

━━━━━━━━━━━━━━━━━━━━

### TECHNOLOGY

- **HTML5:** Semantic structure.
- **Vanilla CSS:** Custom luxury design system (no generic frameworks like Tailwind or Bootstrap).
- **Vanilla JavaScript (ES6):** Lightweight DOM manipulation and Intersection Observers.
- **Vite:** Next-generation frontend tooling for fast local development.
- **qrcode:** Client-side QR generation for the printable card.

━━━━━━━━━━━━━━━━━━━━

### CLIENT

**LOTUS HOTEL INN**

━━━━━━━━━━━━━━━━━━━━

### DIGITAL EXPERIENCE

Designed & Developed by

**DEEP CIPHER**  
Digital Hospitality Experience  
+91 81971 74493

# heyoub.dev — Personal Brand Site

> Software Engineer & Systems Architect

## Stack

```
Astro + React 18 + TypeScript
├── Three.js + @react-three/fiber    → WebGL effects (pixelation reveal, orbs)
├── @react-three/drei                → Three.js helpers
├── Framer Motion                    → Declarative animations
├── Lenis                            → Buttery smooth scroll
├── Tailwind CSS                     → Utility styling
└── Vercel                           → Deployment
```

## Architecture

```
src/
├── pages/
│   └── index.astro                  # Entry page
├── layouts/
│   └── Layout.astro                 # Base layout
├── components/
│   ├── sections/                    # Page sections
│   │   ├── Hero.tsx
│   │   ├── CoreThesis.tsx
│   │   ├── GalleryScroll.tsx
│   │   ├── Path.tsx
│   │   ├── VideoInterlude.tsx
│   │   ├── OpenTo.tsx
│   │   └── ContactDecompile.tsx
│   ├── three/                       # WebGL components
│   │   ├── Scene.tsx                # Main R3F canvas
│   │   ├── ParallaxOrbs.tsx         # Floating gradient orbs
│   │   ├── GridPlane.tsx            # Animated grid background
│   │   └── PixelationReveal.tsx     # Diagonal dissolve shader
│   ├── effects/
│   │   └── ScrollProgress.tsx       # Scroll progress indicator
│   └── layout/
│       ├── Nav.tsx
│       └── MobileMenu.tsx
├── lib/
│   ├── animations.ts                # Shared Framer variants
│   └── responsive.ts                # Responsive utilities
├── data/
│   ├── content.ts                   # Site copy
│   ├── footer.ts                    # Contact config
│   ├── patterns.ts                  # Design principles
│   ├── projects.ts                  # Proof points
│   └── manifest.ts                  # Project links
├── styles/
│   └── globals.css                  # CSS variables, base styles
└── vite-env.d.ts
```

## Key Effects

### 1. Pixelation Reveal (WebGL Shader)
The diagonal cut that dissolves into the code editor. Uses a custom shader:
- Scroll-triggered activation
- Pixel size increases toward the edge
- Chromatic aberration on the boundary
- Reveals the code editor beneath

### 2. Parallax Orbs (Three.js)
Floating gradient spheres that respond to:
- Mouse position (subtle drift)
- Scroll position (vertical parallax)
- Time (gentle oscillation)

### 3. Smooth Scroll (Lenis)
- Momentum-based scrolling
- Custom easing curve
- Scroll velocity for animation timing

### 4. Scroll-Triggered Reveals (Framer Motion)
- Staggered children animations
- Viewport-based triggers
- Custom spring physics

### 5. Gallery Parallax Section
- Sticky sidebar (patterns/stack)
- Content scrolls with depth layers
- Different scroll speeds per layer

## Commands

```bash
# Development
npm run dev

# Build
npm run build

# Preview production build
npm run preview

# Deploy (Vercel CLI)
vercel --prod
```

## Performance Targets

- Lighthouse Performance: 90+
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- WebGL fallback for low-power devices

## Design Tokens

```css
:root {
  /* Backgrounds */
  --bg-primary: #0a0a0b;
  --bg-secondary: #111113;
  --bg-tertiary: #18181b;

  /* Text */
  --text-primary: #fafafa;
  --text-secondary: #a1a1aa;
  --text-muted: #52525b;

  /* Accents */
  --accent: #22d3ee;
  --purple: #a78bfa;
  --green: #22c55e;
  --orange: #fb923c;
  --warm: #fbbf24;
  --pink: #f472b6;

  /* Gradients */
  --gradient-start: #06b6d4;
  --gradient-end: #8b5cf6;

  /* Editor theme (GitHub Dark) */
  --editor-bg: #0d1117;
  --editor-chrome: #161b22;
  --editor-border: #30363d;
}
```

## Typography

- **Display:** Instrument Serif (variable)
- **Mono:** Space Mono
- **Body:** DM Sans

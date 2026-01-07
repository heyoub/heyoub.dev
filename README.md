# heyoub.dev — Personal Brand Site

> Research Engineer & Systems Architect | Semantic Computing Stack

## Stack

```
React 18 + Vite + TypeScript
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
├── components/
│   ├── sections/                    # Page sections
│   │   ├── Hero.tsx
│   │   ├── CoreThesis.tsx
│   │   ├── Patterns.tsx
│   │   ├── SemanticStack.tsx
│   │   ├── Portfolio.tsx
│   │   ├── Philosophy.tsx
│   │   ├── CrossDomain.tsx
│   │   ├── Path.tsx
│   │   ├── Signal.tsx
│   │   ├── OpenTo.tsx
│   │   └── Contact.tsx
│   ├── ui/                          # Reusable components
│   │   ├── SectionLabel.tsx
│   │   ├── TechTag.tsx
│   │   ├── PatternCard.tsx
│   │   ├── ProjectCard.tsx
│   │   ├── TimelineItem.tsx
│   │   └── CodeFooter.tsx
│   ├── three/                       # WebGL components
│   │   ├── Scene.tsx                # Main R3F canvas
│   │   ├── ParallaxOrbs.tsx         # Floating gradient orbs
│   │   ├── GridPlane.tsx            # Animated grid background
│   │   ├── PixelationReveal.tsx     # The diagonal dissolve shader
│   │   └── NoiseTexture.tsx         # Film grain overlay
│   ├── effects/                     # Animation wrappers
│   │   ├── SmoothScroll.tsx         # Lenis provider
│   │   ├── ScrollReveal.tsx         # Scroll-triggered animations
│   │   ├── StaggerChildren.tsx      # Staggered reveals
│   │   └── ParallaxLayer.tsx        # Scroll-linked transforms
│   └── layout/
│       ├── Nav.tsx
│       └── Footer.tsx               # Code-as-footer
├── hooks/
│   ├── useScrollProgress.ts         # Scroll position 0-1
│   ├── useSectionInView.ts          # Active section detection
│   ├── useMousePosition.ts          # For orb parallax
│   └── useLenis.ts                  # Lenis instance access
├── lib/
│   ├── animations.ts                # Shared Framer variants
│   ├── shaders/                     # GLSL shaders
│   │   ├── pixelation.vert
│   │   ├── pixelation.frag
│   │   └── noise.frag
│   └── constants.ts                 # Colors, breakpoints, etc.
├── data/
│   ├── projects.ts                  # Portfolio data
│   ├── patterns.ts                  # 6 architectural patterns
│   ├── timeline.ts                  # Career path
│   └── stack.ts                     # Semantic computing stack layers
├── styles/
│   └── globals.css                  # CSS variables, base styles
├── App.tsx
└── main.tsx
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
Adapted from ForgeStack:
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

## Credits

Built by Eassa Heyoub
Architecture: Semantic Computing Stack
Philosophy: "The receipts prove legitimacy"

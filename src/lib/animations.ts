import { Variants, Transition } from 'framer-motion'

// Easing curves
export const easeOutExpo = [0.16, 1, 0.3, 1]
export const easeOutQuart = [0.25, 1, 0.5, 1]
export const easeInOutCubic = [0.65, 0, 0.35, 1]

// Spring configs
export const springSmooth: Transition = {
  type: 'spring',
  stiffness: 100,
  damping: 20,
}

export const springBouncy: Transition = {
  type: 'spring',
  stiffness: 400,
  damping: 30,
}

export const springStiff: Transition = {
  type: 'spring',
  stiffness: 600,
  damping: 40,
}

// Fade up animation
export const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: easeOutExpo,
    },
  },
}

// Fade in animation
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: easeOutQuart,
    },
  },
}

// Scale up animation
export const scaleUp: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: easeOutExpo,
    },
  },
}

// Slide in from left
export const slideInLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -60,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: easeOutExpo,
    },
  },
}

// Slide in from right
export const slideInRight: Variants = {
  hidden: {
    opacity: 0,
    x: 60,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: easeOutExpo,
    },
  },
}

// Stagger container
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

// Stagger item (use with staggerContainer)
export const staggerItem: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: easeOutQuart,
    },
  },
}

// Fast stagger for many items
export const staggerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
}

// Hero animations (delayed sequence)
export const heroLabel: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay: 0.2, duration: 0.6, ease: easeOutExpo },
  },
}

export const heroName: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay: 0.4, duration: 0.8, ease: easeOutExpo },
  },
}

export const heroTagline: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay: 0.6, duration: 0.6, ease: easeOutExpo },
  },
}

export const heroStats: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay: 0.8, duration: 0.6, ease: easeOutExpo },
  },
}

export const heroPhoto: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { delay: 0.5, duration: 0.8, ease: easeOutExpo },
  },
}

// Scroll reveal (for whileInView)
export const scrollReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 60,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: easeOutExpo,
    },
  },
}

// Viewport config for scroll animations
export const viewportConfig = {
  once: true,
  margin: '-100px 0px',
}

// Hover animations
export const hoverLift = {
  y: -4,
  transition: springSmooth,
}

export const hoverScale = {
  scale: 1.02,
  transition: springSmooth,
}

export const hoverGlow = {
  boxShadow: '0 0 40px rgba(34, 211, 238, 0.2)',
  transition: { duration: 0.3 },
}

// Text reveal (letter by letter)
export const textRevealContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.02,
    },
  },
}

export const textRevealLetter: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: easeOutQuart,
    },
  },
}

// Line reveal (for underlines, borders)
export const lineReveal: Variants = {
  hidden: {
    scaleX: 0,
    originX: 0,
  },
  visible: {
    scaleX: 1,
    transition: {
      duration: 0.8,
      ease: easeOutExpo,
    },
  },
}

// Counter animation helper
export const counterTransition = {
  duration: 2,
  ease: easeOutExpo,
}

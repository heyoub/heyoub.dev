import { motion } from 'framer-motion'
import { useScrollTo } from '@/components/effects/SmoothScroll'
import { fadeIn } from '@/lib/animations'

const navItems = [
  { label: 'Thesis', href: '#thesis' },
  { label: 'Patterns', href: '#patterns' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Path', href: '#path' },
  { label: 'Connect', href: '#contact' },
]

export function Nav() {
  const scrollTo = useScrollTo()

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    scrollTo(href, { offset: -100 })
  }

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 px-8 py-6 flex justify-between items-center"
      style={{
        background: 'linear-gradient(to bottom, var(--bg-primary) 0%, transparent 100%)',
      }}
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <a 
        href="#"
        onClick={(e) => handleClick(e, '#')}
        className="font-mono text-sm tracking-widest text-text-secondary hover:text-accent transition-colors"
      >
        HEYOUB.DEV
      </a>

      <div className="hidden md:flex gap-10">
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            onClick={(e) => handleClick(e, item.href)}
            className="font-mono text-xs tracking-[0.15em] uppercase text-text-muted hover:text-accent transition-colors"
          >
            {item.label}
          </a>
        ))}
      </div>
    </motion.nav>
  )
}

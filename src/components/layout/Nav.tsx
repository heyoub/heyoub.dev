import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { fadeIn } from '@/lib/animations'

// Simple scroll utility that works with Lenis (initialized in Astro)
function useScrollTo() {
  return useCallback((target: string, options?: { offset?: number }) => {
    const element = target === '#' ? document.body : document.querySelector(target)
    if (element) {
      const offset = options?.offset ?? 0
      const top = element.getBoundingClientRect().top + window.scrollY + offset
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }, [])
}
import { projectManifest } from '@/data/manifest'
import { contactConfig } from '@/data/footer'
import { MobileMenu } from './MobileMenu'

interface DropdownProps {
  label: string
  children: React.ReactNode
}

function Dropdown({ label, children }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button className="font-mono text-xs tracking-[0.15em] uppercase text-text-muted hover:text-accent transition-colors">
        {label}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 min-w-[200px] bg-bg-tertiary border border-white/10 py-2 backdrop-blur-xl"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function Nav() {
  const scrollTo = useScrollTo()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    scrollTo(href, { offset: -100 })
  }

  const handleMobileNavigate = (href: string) => {
    scrollTo(href, { offset: -100 })
  }

  const gitProjects = projectManifest.filter((p) => p.gitUrl)
  const liveProjects = projectManifest.filter((p) => p.siteUrl)

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 px-6 md:px-8 py-4 md:py-6 flex justify-between items-center"
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
          className="font-mono text-xs md:text-sm tracking-widest text-text-secondary hover:text-accent transition-colors"
        >
          HEYOUB.DEV
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-10">
        {/* Git Dropdown */}
        <Dropdown label="Git">
          {gitProjects.map((project) => (
            <a
              key={project.gitUrl}
              href={project.gitUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-2 font-mono text-xs text-text-secondary hover:bg-accent/10 hover:text-accent transition-colors"
            >
              {project.name}
            </a>
          ))}
        </Dropdown>

        {/* Projects Dropdown */}
        <Dropdown label="Projects">
          {liveProjects.map((project) => (
            <a
              key={project.siteUrl}
              href={project.siteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-2 font-mono text-xs text-text-secondary hover:bg-accent/10 hover:text-accent transition-colors"
            >
              {project.name}
            </a>
          ))}
        </Dropdown>

        {/* Contact Dropdown */}
        <Dropdown label="Contact">
          {contactConfig.links.map((link) => (
            <a
              key={link.key}
              href={link.href}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noopener noreferrer' : undefined}
              className="block px-4 py-2 font-mono text-xs text-text-secondary hover:bg-accent/10 hover:text-accent transition-colors"
            >
              {link.label}
            </a>
          ))}
        </Dropdown>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="md:hidden w-12 h-12 flex flex-col items-center justify-center gap-1.5 text-text-secondary hover:text-accent transition-colors touch-target focus-ring press-effect tap-highlight"
          aria-label="Open menu"
        >
          <span className="w-6 h-0.5 bg-current transition-all" />
          <span className="w-6 h-0.5 bg-current transition-all" />
          <span className="w-6 h-0.5 bg-current transition-all" />
        </button>
      </motion.nav>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onNavigate={handleMobileNavigate}
      />
    </>
  )
}

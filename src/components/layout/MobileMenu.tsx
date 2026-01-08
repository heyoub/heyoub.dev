import { motion, AnimatePresence } from 'framer-motion'
import { projectManifest } from '@/data/manifest'
import { contactConfig } from '@/data/footer'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  onNavigate: (href: string) => void
}

export function MobileMenu({ isOpen, onClose, onNavigate }: MobileMenuProps) {
  const gitProjects = projectManifest.filter((p) => p.gitUrl)
  const liveProjects = projectManifest.filter((p) => p.siteUrl)

  const handleLinkClick = (href: string, external: boolean) => {
    if (!external) {
      onNavigate(href)
    }
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Menu Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 w-[85vw] max-w-sm bg-bg-tertiary border-l border-white/10 z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <span className="font-mono text-sm tracking-widest text-accent">MENU</span>
              <button
                onClick={onClose}
                className="w-12 h-12 flex items-center justify-center text-text-secondary hover:text-accent transition-colors touch-target"
                aria-label="Close menu"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Menu Sections */}
            <nav className="p-6 space-y-8">
              {/* Git Section */}
              {gitProjects.length > 0 && (
                <section>
                  <h3 className="font-mono text-xs tracking-[0.15em] uppercase text-text-muted mb-4">
                    Git Repositories
                  </h3>
                  <ul className="space-y-2">
                    {gitProjects.map((project) => (
                      <li key={project.gitUrl}>
                        <a
                          href={project.gitUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => handleLinkClick(project.gitUrl!, true)}
                          className="block py-3 px-4 text-text-primary hover:bg-accent/10 hover:text-accent transition-colors rounded touch-target"
                        >
                          {project.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Projects Section */}
              {liveProjects.length > 0 && (
                <section>
                  <h3 className="font-mono text-xs tracking-[0.15em] uppercase text-text-muted mb-4">
                    Live Projects
                  </h3>
                  <ul className="space-y-2">
                    {liveProjects.map((project) => (
                      <li key={project.siteUrl}>
                        <a
                          href={project.siteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => handleLinkClick(project.siteUrl!, true)}
                          className="block py-3 px-4 text-text-primary hover:bg-accent/10 hover:text-accent transition-colors rounded touch-target"
                        >
                          {project.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Contact Section */}
              <section>
                <h3 className="font-mono text-xs tracking-[0.15em] uppercase text-text-muted mb-4">
                  Contact
                </h3>
                <ul className="space-y-2">
                  {contactConfig.links.map((link) => (
                    <li key={link.key}>
                      <a
                        href={link.href}
                        target={link.external ? '_blank' : undefined}
                        rel={link.external ? 'noopener noreferrer' : undefined}
                        onClick={() => handleLinkClick(link.href, link.external ?? false)}
                        className="block py-3 px-4 text-text-primary hover:bg-accent/10 hover:text-accent transition-colors rounded touch-target"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { scrollReveal, viewportConfig } from '@/lib/animations'
import { contactConfig, getLinkDisplayValue } from '@/data/footer'
import { projectManifest } from '@/data/manifest'
import type { ProjectLink } from '@/data/manifest'

function ProjectTabContent({ project }: { project: ProjectLink }) {
  const { pitch } = project

  return (
    <>
      {/* File comment header */}
      <p className="code-line">
        <span className="code-comment code-comment--with-slashes">{pitch.filename}</span>
      </p>
      <p className="code-line">
        <span className="code-comment code-comment--with-slashes">{pitch.tagline}</span>
      </p>
      <p className="code-line">&nbsp;</p>

      {/* Blurb as comment */}
      <p className="code-line">
        <span className="code-comment code-comment--with-slashes">{pitch.blurb}</span>
      </p>
      <p className="code-line">&nbsp;</p>

      {/* Stack as array */}
      <p className="code-line">
        <span className="code-keyword">const</span>{' '}
        <span className="code-variable">stack</span>{' '}
        <span className="code-punctuation">=</span>{' '}
        <span className="code-punctuation">[</span>
      </p>
      {pitch.stack.map((tech, i) => (
        <p key={tech} className="code-line" style={{ paddingLeft: '1.5rem' }}>
          <span className="code-string">"{tech}"</span>
          <span className="code-punctuation" aria-hidden="true">
            {i < pitch.stack.length - 1 ? ',' : ''}
          </span>
        </p>
      ))}
      <p className="code-line">
        <span className="code-punctuation">{'];'}</span>
      </p>
      <p className="code-line">&nbsp;</p>

      {/* Links as object with clickable values */}
      <section aria-labelledby={`${pitch.filename}-links-heading`}>
        <h2 id={`${pitch.filename}-links-heading`} className="sr-only">
          {project.name} Links
        </h2>

        <p className="code-line">
          <span className="code-keyword">const</span>{' '}
          <span className="code-variable">links</span>{' '}
          <span className="code-punctuation">=</span>{' '}
          <span className="code-punctuation">{'{'}</span>
        </p>

        <nav aria-label={`${project.name} links`}>
          <dl className="code-object-body">
            {pitch.links.map((link, index) => (
              <div key={link.label} className="code-line code-property">
                <dt className="code-key">{link.label}</dt>
                <dd>
                  <a
                    href={link.url}
                    className="code-string code-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.display}
                  </a>
                  <span className="code-punctuation" aria-hidden="true">
                    {index < pitch.links.length - 1 ? ',' : ''}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </nav>

        <p className="code-line">
          <span className="code-punctuation">{'};'}</span>
        </p>
      </section>
    </>
  )
}

function ContactTabContent() {
  const { links, status, code } = contactConfig

  return (
    <>
      {/* File comment header */}
      <p className="code-line">
        <span className="code-comment code-comment--with-slashes">{code.filename}</span>
      </p>
      <p className="code-line">
        <span className="code-comment code-comment--with-slashes">{code.openComment}</span>
      </p>
      <p className="code-line">&nbsp;</p>

      {/* Links section */}
      <section aria-labelledby="footer-links-heading">
        <h2 id="footer-links-heading" className="sr-only">
          Contact Links
        </h2>

        <p className="code-line">
          <span className="code-keyword">const</span>{' '}
          <span className="code-variable">links</span>{' '}
          <span className="code-punctuation">=</span>{' '}
          <span className="code-punctuation">{'{'}</span>
        </p>

        <nav aria-label="Contact and social links">
          <dl className="code-object-body">
            {links.map((link, index) => (
              <div key={link.key} className="code-line code-property">
                <dt className="code-key">{link.key}</dt>
                <dd>
                  <a
                    href={link.href}
                    className="code-string code-link"
                    {...(link.external && {
                      target: '_blank',
                      rel: 'noopener noreferrer',
                    })}
                  >
                    {getLinkDisplayValue(link)}
                  </a>
                  <span className="code-punctuation" aria-hidden="true">
                    {index < links.length - 1 ? ',' : ''}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </nav>

        <p className="code-line">
          <span className="code-punctuation">{'};'}</span>
        </p>
      </section>

      <p className="code-line">&nbsp;</p>

      {/* Status section */}
      <section aria-labelledby="footer-status-heading">
        <h2 id="footer-status-heading" className="sr-only">
          Current Status
        </h2>

        <p className="code-line">
          <span className="code-keyword">const</span>{' '}
          <span className="code-variable">status</span>{' '}
          <span className="code-punctuation">=</span>{' '}
          <span className="code-punctuation">{'{'}</span>
        </p>

        <address className="code-object-body not-italic">
          <div className="code-line code-property">
            <span className="code-key">building</span>
            <span className="code-boolean">{String(status.building)}</span>
            <span className="code-punctuation" aria-hidden="true">
              ,
            </span>
          </div>
          <div className="code-line code-property">
            <span className="code-key">location</span>
            <span className="code-string">{status.location}</span>
            <span className="code-punctuation" aria-hidden="true">
              ,
            </span>
          </div>
          <div className="code-line code-property">
            <span className="code-key">year</span>
            <span className="code-number">{status.year}</span>
          </div>
        </address>

        <p className="code-line">
          <span className="code-punctuation">{'};'}</span>
        </p>
      </section>

      <p className="code-line">&nbsp;</p>

      <p className="code-line">
        <span className="code-comment code-comment--with-slashes">
          {code.closeComment}
        </span>
      </p>
    </>
  )
}

function getLineCount(activeTab: string): number {
  if (activeTab === 'contact') {
    return 14 + contactConfig.links.length * 2
  }
  const project = projectManifest.find((p) => p.pitch.filename === activeTab)
  if (!project) return 10
  // filename + tagline + blank + blurb + blank + const stack = [ + stack items + ]; + blank + const links = { + link items + };
  return 5 + project.pitch.stack.length + 4 + project.pitch.links.length * 2
}

export function ContactDecompile() {
  const { status, code } = contactConfig
  const [activeTab, setActiveTab] = useState('contact')

  // Cross-island event listener
  useEffect(() => {
    const handler = (e: CustomEvent<{ tab: string }>) => {
      setActiveTab(e.detail.tab)
    }
    window.addEventListener('editor-tab', handler as EventListener)
    return () => window.removeEventListener('editor-tab', handler as EventListener)
  }, [])

  const lineCount = getLineCount(activeTab)
  const activeProject = projectManifest.find((p) => p.pitch.filename === activeTab)

  return (
    <motion.footer
      id="footer"
      className="bg-editor-bg border-t border-editor-border flex flex-col"
      variants={scrollReveal}
      initial="hidden"
      whileInView="visible"
      viewport={viewportConfig}
    >
      {/* Editor header with tabs */}
      <div
        role="presentation"
        className="flex justify-between items-center px-4 py-3 bg-editor-chrome border-b border-editor-border"
      >
        <div className="flex gap-0 overflow-x-auto scrollbar-hide">
          {/* Project tabs */}
          {projectManifest.map((project) => (
            <button
              key={project.pitch.filename}
              className={`font-mono text-xs px-4 py-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
                activeTab === project.pitch.filename
                  ? 'text-text-primary bg-editor-bg border-b-2 border-accent'
                  : 'text-text-muted bg-editor-chrome hover:text-text-secondary hover:bg-editor-bg/50'
              }`}
              onClick={() => setActiveTab(project.pitch.filename)}
            >
              <span className="text-[0.65rem] opacity-60" aria-hidden="true">
                ⟨/⟩
              </span>
              {project.pitch.filename}
            </button>
          ))}
          {/* Contact tab */}
          <button
            className={`font-mono text-xs px-4 py-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'contact'
                ? 'text-text-primary bg-editor-bg border-b-2 border-accent'
                : 'text-text-muted bg-editor-chrome hover:text-text-secondary hover:bg-editor-bg/50'
            }`}
            onClick={() => setActiveTab('contact')}
          >
            <span className="text-[0.65rem] opacity-60" aria-hidden="true">
              ⟨/⟩
            </span>
            {code.filename}
          </button>
        </div>
        <div className="flex gap-2 shrink-0 ml-4" aria-hidden="true">
          <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
          <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
        </div>
      </div>

      {/* Code content */}
      <div className="flex-1 relative overflow-auto">
        {/* Line numbers - decorative */}
        <div
          aria-hidden="true"
          className="hidden md:block absolute left-0 top-0 bottom-0 w-12 bg-editor-bg border-r border-editor-border py-6 pr-4"
        >
          <div className="flex flex-col items-end font-mono text-xs text-[#484f58] leading-relaxed">
            {Array.from({ length: lineCount }).map((_, i) => (
              <span key={i}>{i + 1}</span>
            ))}
          </div>
        </div>

        {/* Tab content with animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="code-block py-4 md:py-6 px-4 md:px-8 md:pl-20 font-mono text-[clamp(0.7rem,1.5vw,0.875rem)] leading-relaxed"
          >
            {activeTab === 'contact' ? (
              <ContactTabContent />
            ) : activeProject ? (
              <ProjectTabContent project={activeProject} />
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Status bar */}
      <div
        role="contentinfo"
        className="flex justify-between items-center px-8 md:pl-20 py-3 bg-editor-chrome border-t border-editor-border"
      >
        <div className="flex items-center gap-3 text-[#8b949e]">
          <span
            className="w-2 h-2 rounded-full bg-green animate-pulse"
            aria-hidden="true"
          />
          <span className="font-mono text-xs">
            <span className="sr-only">Status: </span>
            building
          </span>
        </div>
        <small className="font-mono text-[0.65rem] tracking-wider text-[#484f58]">
          © {status.year} Eassa Ayoub · {status.location}
        </small>
      </div>
    </motion.footer>
  )
}

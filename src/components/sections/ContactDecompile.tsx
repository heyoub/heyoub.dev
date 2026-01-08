import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useMotionValue, animate } from 'framer-motion'
import { contactConfig, getLinkDisplayValue } from '@/data/footer'

export function ContactDecompile() {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const { heading, description, links, status, code } = contactConfig

  const [hasAutoPlayed, setHasAutoPlayed] = useState(false)
  const [isLocked, setIsLocked] = useState(false)
  const manualProgress = useMotionValue(0)

  const handleConnect = () => {
    if (containerRef.current) {
      const containerBottom = containerRef.current.offsetTop + containerRef.current.offsetHeight
      window.scrollTo({
        top: containerBottom - window.innerHeight,
        behavior: 'smooth'
      })
    }
  }

  // Track scroll progress through this section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  // Video roll up effect - starts below viewport and rolls up as user approaches
  const videoRollY = useTransform(scrollYProgress, [0, 0.15], [200, 0])
  const videoRollOpacity = useTransform(scrollYProgress, [0, 0.1, 0.15], [0, 0.5, 1])

  // Use manual progress after auto-play, otherwise use scroll progress
  const activeProgress = hasAutoPlayed ? scrollYProgress : manualProgress

  // Auto-play trigger when heading hits center
  useEffect(() => {
    if (hasAutoPlayed || !headingRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return

        // Check if heading is near center of viewport
        const rect = entry.boundingClientRect
        const viewportCenter = window.innerHeight / 2
        const elementCenter = rect.top + rect.height / 2
        const distanceFromCenter = Math.abs(elementCenter - viewportCenter)

        // If within 50px of center and not played yet
        if (distanceFromCenter < 50 && entry.isIntersecting && !hasAutoPlayed) {
          setIsLocked(true)

          // Lock body scroll
          document.body.style.overflow = 'hidden'

          // Animate progress from 0 to 1 over 3 seconds
          animate(manualProgress, 1, {
            duration: 3,
            ease: 'easeInOut',
            onComplete: () => {
              setHasAutoPlayed(true)
              setIsLocked(false)
              document.body.style.overflow = ''
            },
          })
        }
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] }
    )

    observer.observe(headingRef.current)
    return () => observer.disconnect()
  }, [hasAutoPlayed, manualProgress])

  // Sync manual progress with scroll progress on first render
  useEffect(() => {
    if (!hasAutoPlayed) {
      const unsubscribe = scrollYProgress.on('change', (latest) => {
        if (!isLocked) {
          manualProgress.set(latest)
        }
      })
      return unsubscribe
    }
  }, [hasAutoPlayed, isLocked, scrollYProgress, manualProgress])

  // EXPANDED SCROLL RANGES for smoother "slow-motion" transitions
  // Container: 380vh mobile, 450vh desktop - gives enough scroll room
  //
  // PHASE 1: Styled contact (0.08 - 0.70) - EXTENDED: stays through video, dramatic blur into code
  // PHASE 2: Video with effects (0.30 - 0.66) - SHORTER: text outlasts video
  // PHASE 3: Code view (0.50 - 0.72 - 1.0) - earlier start, LOCKS IN at bottom for stability

  // Styled view - EXTENDED: stays visible longer than video
  // Fades out earlier for cleaner handoff to code view
  const styledOpacity = useTransform(
    activeProgress,
    [0.08, 0.14, 0.58, 0.70],
    [0, 1, 1, 0]
  )

  // Styled view BLUR - starts subtle, becomes VERY dramatic making text illegible
  // Blur builds up as code footer starts appearing (focus handoff)
  const styledBlur = useTransform(
    activeProgress,
    [0.50, 0.58, 0.65, 0.70],
    [0, 10, 40, 70]
  )

  // Styled view BRIGHTNESS/SATURATION - enhanced through video phase
  const styledBrightness = useTransform(
    activeProgress,
    [0.14, 0.36, 0.56, 0.68],
    [1, 1.15, 1.25, 0.6]
  )
  const styledSaturation = useTransform(
    activeProgress,
    [0.14, 0.36, 0.56, 0.68],
    [1, 1.35, 1.5, 0.3]
  )

  // Styled view PIXELATION - subtle at first, dramatic with blur
  const styledPixelation = useTransform(
    activeProgress,
    [0.58, 0.66, 0.76],
    [0, 4, 15]
  )

  // Decompile teaser - subtle hint at bottom that something's coming
  const teaserOpacity = useTransform(
    activeProgress,
    [0.18, 0.22, 0.28],
    [0, 0.6, 0]
  )
  const teaserGlitch = useTransform(
    activeProgress,
    [0.20, 0.24, 0.28],
    [0, 1, 0]
  )

  // BACKGROUND LAYER - covers orbs from video phase through code phase
  // Fades in as video starts, stays solid through end of scroll
  const bgCoverOpacity = useTransform(
    activeProgress,
    [0.28, 0.34, 1.0],
    [0, 1, 1]
  )

  // Video content opacity - SHORTER: text stays visible longer
  const videoContentOpacity = useTransform(
    activeProgress,
    [0.30, 0.38, 0.48, 0.58, 0.66],
    [0, 0.7, 1, 0.85, 0]
  )

  // Pixelation: granular steps for that "25fps scroll" feel - adjusted for shorter video
  const videoPixelation = useTransform(
    activeProgress,
    [0.30, 0.38, 0.48, 0.56, 0.62, 0.66],
    [60, 22, 6, 2, 6, 35]
  )

  // Saturation: gradual reveal - adjusted for shorter video
  const videoSaturation = useTransform(
    activeProgress,
    [0.30, 0.42, 0.52, 0.60, 0.66],
    [0, 0.8, 1.4, 1.0, 0.1]
  )

  // Glitch effect - pulses during transitions (adjusted for shorter video)
  const glitchIntensity = useTransform(
    activeProgress,
    [0.30, 0.36, 0.42, 0.48, 0.60, 0.64, 0.70],
    [0, 0.8, 1, 0, 0, 1, 0]
  )

  // Code view - starts earlier to OVERLAP with styled text fade, dramatic handoff
  // Tightened ranges for mobile stability - reaches full opacity earlier and holds
  const codeOpacity = useTransform(
    activeProgress,
    [0.50, 0.60, 0.70, 1.0],
    [0, 0.5, 1, 1]
  )

  // Code BLUR - MORE dramatic blur at start, comes into focus as styled text becomes illegible
  // Fully sharp by 0.72 and holds through end of scroll
  const codeBlur = useTransform(
    activeProgress,
    [0.50, 0.58, 0.68, 0.72, 1.0],
    [50, 25, 8, 0, 0]
  )

  const lineCount = 14 + links.length * 2

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      video.play().catch(() => {})
    }
  }, [])

  return (
    <div ref={containerRef} className="relative min-h-[380vh] md:min-h-[450vh]">
      {/* Sticky container for the transition */}
      <motion.div
        className="sticky top-0 h-screen flex items-center justify-center overflow-hidden"
        style={{ y: videoRollY, opacity: videoRollOpacity }}
      >
        
        {/* PHASE 1: Styled View (Contact Section) - with blur/saturation handoff */}
        <motion.section
          id="contact"
          className="absolute inset-0 flex flex-col justify-center items-center gap-8 py-24 px-[8vw] z-[25] pointer-events-none"
          style={{
            opacity: styledOpacity,
            filter: useTransform(
              [styledBlur, styledBrightness, styledSaturation],
              (latest: number[]) =>
                `blur(${latest[0]}px) brightness(${latest[1]}) saturate(${latest[2]})`
            ),
          }}
        >
          {/* Pixelation overlay for styled text */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              opacity: useTransform(styledPixelation, [0, 2, 8], [0, 0.3, 0.7]),
              backgroundImage: `
                repeating-linear-gradient(
                  0deg,
                  transparent,
                  transparent 2px,
                  rgba(0,200,180,0.05) 2px,
                  rgba(0,200,180,0.05) 4px
                ),
                repeating-linear-gradient(
                  90deg,
                  transparent,
                  transparent 2px,
                  rgba(0,200,180,0.05) 2px,
                  rgba(0,200,180,0.05) 4px
                )
              `,
            }}
          />
          <div className="text-center max-w-2xl">
            <h3 ref={headingRef} className="font-serif text-[clamp(2rem,8vw,4rem)] mb-4 md:mb-6">
              Let's Build
            </h3>
            <p className="text-text-secondary font-light text-[clamp(1rem,2.5vw,1.25rem)]">
              Type systems that compile constraints. Event architectures that never forget.
              Interfaces where thought becomes action.
            </p>
          </div>

          <button
            onClick={handleConnect}
            className="font-mono text-[clamp(0.65rem,1.5vw,0.75rem)] tracking-[0.15em] uppercase text-text-secondary px-6 md:px-8 py-3 md:py-4 border border-white/10 hover:bg-accent hover:border-accent hover:text-bg-primary transition-all duration-300 cursor-pointer pointer-events-auto touch-target"
          >
            Connect
          </button>
          
          {/* Decompile teaser - subtle hint at bottom */}
          <motion.div
            className="absolute bottom-16 left-0 right-0 flex flex-col items-center gap-2"
            style={{ opacity: teaserOpacity }}
          >
            {/* Glitchy scanline */}
            <motion.div
              className="w-48 h-px bg-gradient-to-r from-transparent via-accent to-transparent"
              style={{
                scaleX: teaserGlitch,
                opacity: teaserGlitch,
                boxShadow: '0 0 8px rgba(34, 211, 238, 0.6)',
              }}
            />
            <motion.span
              className="font-mono text-[10px] tracking-[0.3em] uppercase text-accent"
              style={{
                opacity: teaserGlitch,
                textShadow: '0 0 12px rgba(34, 211, 238, 0.8), 0 0 24px rgba(34, 211, 238, 0.4)',
              }}
            >
              // decompiling
            </motion.span>
            {/* Subtle down arrow */}
            <motion.div
              className="text-accent text-lg"
              style={{
                opacity: teaserGlitch,
                y: useTransform(activeProgress, [0.20, 0.24], [0, 4]),
                filter: 'drop-shadow(0 0 6px rgba(34, 211, 238, 0.6))',
              }}
            >
              ↓
            </motion.div>
          </motion.div>
        </motion.section>

        {/* BACKGROUND COVER - hides orbs from video phase through code phase */}
        <motion.div
          className="absolute inset-0 z-[15] bg-bg-primary"
          style={{ opacity: bgCoverOpacity }}
        />

        {/* PHASE 2: Video with depixelation effect */}
        <motion.div
          className="absolute inset-0 z-20"
          style={{ opacity: videoContentOpacity }}
        >
          {/* Video with fallback gradient */}
          <motion.div
            className="absolute inset-0 overflow-hidden"
            style={{
              filter: useTransform(videoSaturation, (sat) => `saturate(${sat})`),
            }}
          >
            {/* Fallback animated gradient in case video doesn't load */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/30 via-[#0a1628] to-[#1a0a2e]/50" />
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              src="/assets/fs/3141208-uhd_3840_2160_25fps.mp4"
              muted
              loop
              playsInline
              autoPlay
              preload="auto"
            />
          </motion.div>
          
          {/* Pixelation overlay effect using CSS */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              backdropFilter: useTransform(videoPixelation, (px) =>
                px > 2 ? `blur(${px * 0.4}px)` : 'none'
              ),
            }}
          />
          
          {/* Scanline effect for that CRT/decompile feel */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              opacity: useTransform(videoPixelation, [1, 15, 60], [0, 0.2, 0.5]),
              backgroundImage: `
                repeating-linear-gradient(
                  0deg,
                  transparent,
                  transparent 2px,
                  rgba(0,255,200,0.04) 2px,
                  rgba(0,255,200,0.04) 4px
                )
              `,
            }}
          />
          
          {/* Vignette */}
          <div className="absolute inset-0 bg-gradient-to-b from-bg-primary/30 via-transparent to-bg-primary/50" />
        </motion.div>

        {/* Glitch/Transition Effect Layer */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-30"
          style={{ opacity: glitchIntensity }}
        >
          <div className="absolute inset-0 decompile-glitch" />
        </motion.div>

        {/* PHASE 3: Code View (Footer) - comes into focus as contact blurs out */}
        <motion.footer
          className="absolute inset-0 bg-editor-bg border-t border-editor-border flex flex-col z-40"
          style={{
            opacity: codeOpacity,
            filter: useTransform(codeBlur, (blur) => `blur(${blur}px)`),
          }}
        >
          {/* Editor header - decorative */}
          <div
            role="presentation"
            className="flex justify-between items-center px-4 py-3 bg-editor-chrome border-b border-editor-border"
          >
            <div className="flex gap-0">
              <div className="font-mono text-xs px-4 py-2 text-text-primary bg-editor-bg border-b-2 border-accent flex items-center gap-2">
                <span className="text-[0.65rem] opacity-60" aria-hidden="true">
                  ⟨/⟩
                </span>
                {code.filename}
              </div>
            </div>
            <div className="flex gap-2" aria-hidden="true">
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

            {/* Semantic content styled as code */}
            <div className="code-block py-4 md:py-6 px-4 md:px-8 md:pl-20 font-mono text-[clamp(0.7rem,1.5vw,0.875rem)] leading-relaxed">
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
            </div>
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
      </motion.div>
    </div>
  )
}

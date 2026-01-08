import { lazy, Suspense } from 'react'
import { SmoothScroll } from '@/components/effects/SmoothScroll'
import { Nav } from '@/components/layout/Nav'
import { Hero } from '@/components/sections/Hero'
import { VideoInterlude } from '@/components/sections/VideoInterlude'
import { CoreThesis } from '@/components/sections/CoreThesis'
import { Portfolio } from '@/components/sections/Portfolio'
import { Path } from '@/components/sections/Path'
import { OpenTo } from '@/components/sections/OpenTo'

// Lazy load heavy components
const Scene = lazy(() => import('@/components/three/Scene').then(m => ({ default: m.Scene })))
const ContactDecompile = lazy(() => import('@/components/sections/ContactDecompile').then(m => ({ default: m.ContactDecompile })))

function App() {
  return (
    <SmoothScroll>
      {/* WebGL Background - lazy loaded */}
      <Suspense fallback={<div className="fixed inset-0 bg-bg-primary" />}>
        <Scene />
      </Suspense>

      {/* Noise overlay */}
      <div className="noise-overlay" />

      {/* Navigation */}
      <Nav />

      {/* Main Content */}
      <main>
        <Hero />
        {/* Video interlude after hero */}
        <VideoInterlude
          src="/assets/fs/3130182-hd_1280_720_30fps.mp4"
          height="50vh"
          overlay="gradient"
        />
        <CoreThesis />
        <Portfolio />
        <Path />
        <OpenTo />
        {/* Contact + Footer with scroll-driven decompile transition - lazy loaded */}
        <Suspense fallback={<div className="min-h-screen bg-bg-primary" />}>
          <ContactDecompile />
        </Suspense>
      </main>
    </SmoothScroll>
  )
}

export default App

import { SmoothScroll } from '@/components/effects/SmoothScroll'
import { Scene } from '@/components/three/Scene'
import { Nav } from '@/components/layout/Nav'
import { Hero } from '@/components/sections/Hero'
import { VideoInterlude } from '@/components/sections/VideoInterlude'
import { CoreThesis } from '@/components/sections/CoreThesis'
import { Patterns } from '@/components/sections/Patterns'
import { SemanticStack } from '@/components/sections/SemanticStack'
import { Portfolio } from '@/components/sections/Portfolio'
import { CrossDomain } from '@/components/sections/CrossDomain'
import { Path } from '@/components/sections/Path'
import { OpenTo } from '@/components/sections/OpenTo'
import { ContactDecompile } from '@/components/sections/ContactDecompile'

function App() {
  return (
    <SmoothScroll>
      {/* WebGL Background */}
      <Scene />

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
        <Patterns />
        <SemanticStack />
        <Portfolio />
        <CrossDomain />
        <Path />
        <OpenTo />
        {/* Contact + Footer with scroll-driven decompile transition */}
        <ContactDecompile />
      </main>
    </SmoothScroll>
  )
}

export default App

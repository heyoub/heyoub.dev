import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { useScroll, useTransform, useMotionValueEvent } from 'framer-motion'
import { useState } from 'react'
import { ParallaxOrbs } from './ParallaxOrbs'
import { GridPlane } from './GridPlane'
import { PixelationReveal } from './PixelationReveal'
import { useIsMobile, zIndex } from '@/lib/responsive'

export function Scene() {
  const isMobile = useIsMobile()
  const { scrollYProgress } = useScroll()
  const [pixelProgress, setPixelProgress] = useState(0)

  // Map the last 15% of scroll to pixelation (approaching footer)
  const pixelMotion = useTransform(scrollYProgress, [0.85, 1], [0, 1])

  useMotionValueEvent(pixelMotion, 'change', (v) => {
    setPixelProgress(v)
  })

  return (
    <div className="fixed inset-0" style={{ zIndex: zIndex.behind }}>
      <Canvas
        camera={{
          position: [0, 0, 5],
          fov: isMobile ? 85 : 75,
        }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[5, 5, 5]} intensity={0.5} />
          <directionalLight position={[-5, -5, -5]} intensity={0.3} />
          <ParallaxOrbs />
          <GridPlane />
          {pixelProgress > 0.01 && <PixelationReveal progress={pixelProgress} />}
        </Suspense>
      </Canvas>
    </div>
  )
}

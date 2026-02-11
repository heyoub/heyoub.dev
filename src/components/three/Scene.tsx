import { Canvas } from '@react-three/fiber'
import { Suspense, useRef } from 'react'
import { useScroll, useTransform, useMotionValueEvent } from 'framer-motion'
import { ParallaxOrbs } from './ParallaxOrbs'
import { GridPlane } from './GridPlane'
import { PixelationReveal } from './PixelationReveal'
import { useIsMobile, zIndex } from '@/lib/responsive'

export function Scene() {
  const isMobile = useIsMobile()
  const { scrollYProgress } = useScroll()
  const pixelProgressRef = useRef(0)

  // Map the last 15% of scroll to pixelation (approaching footer)
  const pixelMotion = useTransform(scrollYProgress, [0.85, 1], [0, 1])

  // Write to ref — no React re-render, PixelationReveal reads it in useFrame
  useMotionValueEvent(pixelMotion, 'change', (v) => {
    pixelProgressRef.current = v
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
          <PixelationReveal progressRef={pixelProgressRef} />
        </Suspense>
      </Canvas>
    </div>
  )
}

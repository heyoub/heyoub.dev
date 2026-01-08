import { Canvas } from '@react-three/fiber'
import { Suspense, useState, useEffect } from 'react'
import { ParallaxOrbs } from './ParallaxOrbs'
import { GridPlane } from './GridPlane'

export function Scene() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <div className="fixed inset-0" style={{ zIndex: -100 }}>
      <Canvas
        camera={{
          position: [0, 0, 5],
          fov: isMobile ? 85 : 75 // Wider FOV on mobile to see vertical stack
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
        </Suspense>
      </Canvas>
    </div>
  )
}

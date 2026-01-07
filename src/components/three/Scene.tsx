import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { ParallaxOrbs } from './ParallaxOrbs'
import { GridPlane } from './GridPlane'

export function Scene() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        dpr={[1, 2]}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <ParallaxOrbs />
          <GridPlane />
        </Suspense>
      </Canvas>
    </div>
  )
}

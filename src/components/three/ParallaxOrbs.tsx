import { useRef, useMemo, useState, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial } from '@react-three/drei'
import { Vector3, type Mesh } from 'three'

interface OrbConfig {
  position: [number, number, number]
  mobilePosition: [number, number, number] // Vertical stack for mobile
  color: string
  size: number
  mobileSize: number // Smaller on mobile
  speed: number
  distort: number
}

// Desktop: scattered horizontal/diagonal layout
// Mobile: vertical stack (same X, varied Y and Z depth)
const orbs: OrbConfig[] = [
  {
    position: [3, 2, -2],              // Desktop: top right
    mobilePosition: [0, 3, -5],        // Mobile: top center
    color: '#06b6d4',
    size: 2.5,
    mobileSize: 1.8,
    speed: 0.5,
    distort: 0.3
  },
  {
    position: [-3, -1.5, -3],          // Desktop: bottom left
    mobilePosition: [0, 0, -7],        // Mobile: middle center
    color: '#8b5cf6',
    size: 2,
    mobileSize: 1.5,
    speed: 0.7,
    distort: 0.4
  },
  {
    position: [0, 0, -4],              // Desktop: center
    mobilePosition: [0, -3, -9],       // Mobile: bottom center
    color: '#fbbf24',
    size: 1.5,
    mobileSize: 1.2,
    speed: 0.3,
    distort: 0.2
  },
]

function Orb({ position, mobilePosition, color, size, mobileSize, speed, distort }: OrbConfig) {
  const meshRef = useRef<Mesh>(null)
  const { pointer, viewport } = useThree()
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768) // md breakpoint
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Use mobile or desktop position/size
  const activePosition = isMobile ? mobilePosition : position
  const activeSize = isMobile ? mobileSize : size
  const initialPosition = useMemo(() => new Vector3(...activePosition), [activePosition])

  useFrame((state) => {
    if (!meshRef.current) return

    const time = state.clock.elapsedTime

    // Base floating animation
    meshRef.current.position.x = initialPosition.x + Math.sin(time * speed) * 0.3
    meshRef.current.position.y = initialPosition.y + Math.cos(time * speed * 0.8) * 0.2

    // Pointer parallax effect (reduced on mobile)
    const parallaxStrength = isMobile ? 0.02 : 0.05
    const pointerX = (pointer.x * viewport.width) / 2
    const pointerY = (pointer.y * viewport.height) / 2

    meshRef.current.position.x += pointerX * parallaxStrength
    meshRef.current.position.y += pointerY * parallaxStrength

    // Gentle rotation
    meshRef.current.rotation.x = time * 0.1
    meshRef.current.rotation.y = time * 0.15
  })

  return (
    <Sphere ref={meshRef} args={[activeSize, 64, 64]} position={activePosition}>
      <MeshDistortMaterial
        color={color}
        transparent
        opacity={0.25}
        distort={distort}
        speed={2}
        roughness={0.2}
        metalness={0.1}
      />
    </Sphere>
  )
}

export function ParallaxOrbs() {
  return (
    <group>
      {orbs.map((orb, index) => (
        <Orb key={index} {...orb} />
      ))}
    </group>
  )
}

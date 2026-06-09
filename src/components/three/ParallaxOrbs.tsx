import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial } from '@react-three/drei'
import { Vector3, type Mesh } from 'three'

interface OrbConfig {
  position: [number, number, number]
  mobilePosition: [number, number, number]
  color: string
  size: number
  mobileSize: number
  speed: number
  distort: number
}

interface OrbProps extends OrbConfig {
  isMobile: boolean
}

// Desktop: scattered horizontal/diagonal layout
// Mobile: vertical stack (same X, varied Y and Z depth)
const orbs: OrbConfig[] = [
  {
    position: [3, 2, -2],
    mobilePosition: [0, 3, -5],
    color: '#06b6d4',
    size: 2.5,
    mobileSize: 1.8,
    speed: 0.5,
    distort: 0.3
  },
  {
    position: [-3, -1.5, -3],
    mobilePosition: [0, 0, -7],
    color: '#8b5cf6',
    size: 2,
    mobileSize: 1.5,
    speed: 0.7,
    distort: 0.4
  },
  {
    position: [0, 0, -4],
    mobilePosition: [0, -3, -9],
    color: '#fbbf24',
    size: 1.5,
    mobileSize: 1.2,
    speed: 0.3,
    distort: 0.2
  },
]

function Orb({ position, mobilePosition, color, size, mobileSize, speed, distort, isMobile }: OrbProps) {
  const meshRef = useRef<Mesh>(null)
  const { pointer, viewport } = useThree()

  const activeSize = isMobile ? mobileSize : size

  const initialPosition = useMemo(
    () => new Vector3(...(isMobile ? mobilePosition : position)),
    [isMobile, mobilePosition[0], mobilePosition[1], mobilePosition[2], position[0], position[1], position[2]]
  )

  const activePosition: [number, number, number] = isMobile ? mobilePosition : position

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

interface ParallaxOrbsProps {
  isMobile: boolean
}

export function ParallaxOrbs({ isMobile }: ParallaxOrbsProps) {
  return (
    <group>
      {orbs.map((orb, index) => (
        <Orb key={index} {...orb} isMobile={isMobile} />
      ))}
    </group>
  )
}

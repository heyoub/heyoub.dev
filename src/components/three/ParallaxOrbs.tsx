import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

interface OrbConfig {
  position: [number, number, number]
  color: string
  size: number
  speed: number
  distort: number
}

const orbs: OrbConfig[] = [
  { position: [3, 2, -2], color: '#06b6d4', size: 2.5, speed: 0.5, distort: 0.3 },
  { position: [-3, -1.5, -3], color: '#8b5cf6', size: 2, speed: 0.7, distort: 0.4 },
  { position: [0, 0, -4], color: '#fbbf24', size: 1.5, speed: 0.3, distort: 0.2 },
]

function Orb({ position, color, size, speed, distort }: OrbConfig) {
  const meshRef = useRef<THREE.Mesh>(null)
  const { mouse, viewport } = useThree()
  
  const initialPosition = useMemo(() => new THREE.Vector3(...position), [position])

  useFrame((state) => {
    if (!meshRef.current) return

    const time = state.clock.elapsedTime

    // Base floating animation
    meshRef.current.position.x = initialPosition.x + Math.sin(time * speed) * 0.3
    meshRef.current.position.y = initialPosition.y + Math.cos(time * speed * 0.8) * 0.2

    // Mouse parallax effect
    const mouseX = (mouse.x * viewport.width) / 2
    const mouseY = (mouse.y * viewport.height) / 2
    
    meshRef.current.position.x += mouseX * 0.05
    meshRef.current.position.y += mouseY * 0.05

    // Gentle rotation
    meshRef.current.rotation.x = time * 0.1
    meshRef.current.rotation.y = time * 0.15
  })

  return (
    <Sphere ref={meshRef} args={[size, 64, 64]} position={position}>
      <MeshDistortMaterial
        color={color}
        transparent
        opacity={0.4}
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

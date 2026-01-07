import { useRef, useEffect } from 'react'
import { useFrame, useThree, extend, Object3DNode } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'

// Custom shader material for pixelation effect
const PixelationMaterial = shaderMaterial(
  {
    uTime: 0,
    uProgress: 0,
    uResolution: new THREE.Vector2(1, 1),
    uDiagonalAngle: Math.PI / 6, // 30 degrees
  },
  // Vertex shader
  `
    varying vec2 vUv;
    
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment shader
  `
    uniform float uTime;
    uniform float uProgress;
    uniform vec2 uResolution;
    uniform float uDiagonalAngle;
    
    varying vec2 vUv;
    
    // Hash function for pseudo-random
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }
    
    void main() {
      vec2 uv = vUv;
      
      // Calculate diagonal progress
      float diagonal = uv.x * cos(uDiagonalAngle) + uv.y * sin(uDiagonalAngle);
      float diagonalProgress = smoothstep(uProgress - 0.3, uProgress + 0.1, diagonal);
      
      // Pixelation amount based on progress
      float pixelSize = mix(1.0, 64.0, pow(diagonalProgress, 2.0));
      
      // Apply pixelation
      vec2 pixelatedUV = floor(uv * uResolution / pixelSize) * pixelSize / uResolution;
      
      // Calculate grid cell for glitch effect
      vec2 gridCell = floor(uv * uResolution / 8.0);
      float glitch = hash(gridCell + floor(uTime * 10.0));
      
      // RGB shift based on progress
      float rgbShift = diagonalProgress * 0.02;
      
      // Output color (we'll sample from a texture in the full implementation)
      // For now, create a gradient to visualize the effect
      vec3 baseColor = vec3(0.04, 0.04, 0.05); // bg-primary
      vec3 accentColor = vec3(0.13, 0.83, 0.93); // accent cyan
      
      // Add pixelation noise
      float noise = hash(pixelatedUV * 100.0) * diagonalProgress * 0.5;
      
      // Chromatic aberration simulation
      vec3 color = baseColor;
      color.r += rgbShift * accentColor.r;
      color.b -= rgbShift * 0.5;
      
      // Add scan lines in pixelated area
      float scanLine = sin(pixelatedUV.y * uResolution.y * 3.14159) * 0.5 + 0.5;
      color += scanLine * diagonalProgress * 0.05;
      
      // Add glitch blocks
      if (glitch > 0.98 && diagonalProgress > 0.1) {
        color = accentColor * 0.5;
      }
      
      // Fade out at the boundary
      float alpha = 1.0 - smoothstep(0.9, 1.0, diagonalProgress);
      
      gl_FragColor = vec4(color + noise, alpha * (1.0 - diagonalProgress * 0.3));
    }
  `
)

// Extend for use in JSX
extend({ PixelationMaterial })

// Type declaration
declare module '@react-three/fiber' {
  interface ThreeElements {
    pixelationMaterial: Object3DNode<
      InstanceType<typeof PixelationMaterial>,
      typeof PixelationMaterial
    >
  }
}

interface PixelationRevealProps {
  progress: number // 0 to 1
}

export function PixelationReveal({ progress }: PixelationRevealProps) {
  const materialRef = useRef<any>(null)
  const { viewport } = useThree()

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uResolution.set(viewport.width * 100, viewport.height * 100)
    }
  }, [viewport])

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uTime = state.clock.elapsedTime
      materialRef.current.uProgress = progress
    }
  })

  return (
    <mesh position={[0, 0, 1]}>
      <planeGeometry args={[viewport.width, viewport.height]} />
      <pixelationMaterial ref={materialRef} transparent />
    </mesh>
  )
}

// Standalone component for use outside R3F
export function PixelationRevealSection({ scrollProgress }: { scrollProgress: number }) {
  return (
    <div className="relative h-[200px] overflow-hidden">
      {/* CSS fallback for the diagonal effect */}
      <div 
        className="absolute inset-0"
        style={{
          background: `linear-gradient(
            165deg,
            var(--bg-primary) 0%,
            var(--bg-primary) ${45 + scrollProgress * 30}%,
            transparent ${45 + scrollProgress * 30}%
          )`,
        }}
      />
      
      {/* Pixel rows */}
      <div className="absolute inset-0 flex flex-col">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 relative"
            style={{
              background: `linear-gradient(
                90deg,
                var(--bg-primary) ${i * 12}%,
                transparent ${i * 12}%
              )`,
            }}
          >
            <div
              className="absolute top-0 bottom-0"
              style={{
                left: `${i * 12}%`,
                width: `${30 + i * 8}px`,
                background: `repeating-linear-gradient(
                  90deg,
                  rgba(34, 211, 238, 0.1) 0px,
                  rgba(34, 211, 238, 0.1) 4px,
                  transparent 4px,
                  transparent ${8 + i * 2}px
                )`,
                filter: `blur(${i * 0.3}px)`,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

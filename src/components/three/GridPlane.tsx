import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Color, type Mesh } from 'three'

export function GridPlane() {
  const meshRef = useRef<Mesh>(null)

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new Color('#22d3ee') },
      uOpacity: { value: 0.03 },
    }),
    []
  )

  const vertexShader = `
    varying vec2 vUv;
    
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `

  const fragmentShader = `
    uniform float uTime;
    uniform vec3 uColor;
    uniform float uOpacity;
    varying vec2 vUv;
    
    void main() {
      // Grid pattern
      vec2 grid = abs(fract(vUv * 30.0 - 0.5) - 0.5) / fwidth(vUv * 30.0);
      float line = min(grid.x, grid.y);
      float gridPattern = 1.0 - min(line, 1.0);
      
      // Fade towards edges
      float fade = smoothstep(0.0, 0.3, vUv.x) * smoothstep(1.0, 0.7, vUv.x) *
                   smoothstep(0.0, 0.3, vUv.y) * smoothstep(1.0, 0.7, vUv.y);
      
      // Subtle pulse
      float pulse = sin(uTime * 0.5) * 0.1 + 0.9;
      
      float alpha = gridPattern * uOpacity * fade * pulse;
      
      gl_FragColor = vec4(uColor, alpha);
    }
  `

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime
  })

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
      <planeGeometry args={[50, 50, 1, 1]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
      />
    </mesh>
  )
}

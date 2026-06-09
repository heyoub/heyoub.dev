// The OG WebGL scene, in vanilla Three.js (no React) — 3 distorted parallax
// orbs + a shader grid plane. Faithful port of the v2 ParallaxOrbs + GridPlane.
// Adaptive behaviour (orb layout, quality, motion) is driven by LiteShip:
// Scene.astro passes the heroLayout boundary state + device tier in here.
import * as THREE from 'three'

interface OrbConfig {
  position: [number, number, number]
  mobilePosition: [number, number, number]
  color: string
  size: number
  mobileSize: number
  speed: number
  distort: number
}

const ORBS: OrbConfig[] = [
  { position: [3, 2, -2], mobilePosition: [0, 3, -5], color: '#06b6d4', size: 2.5, mobileSize: 1.8, speed: 0.5, distort: 0.3 },
  { position: [-3, -1.5, -3], mobilePosition: [0, 0, -7], color: '#8b5cf6', size: 2, mobileSize: 1.5, speed: 0.7, distort: 0.4 },
  { position: [0, 0, -4], mobilePosition: [0, -3, -9], color: '#fbbf24', size: 1.5, mobileSize: 1.2, speed: 0.3, distort: 0.2 },
]

// Ashima 3D simplex noise — drives the organic vertex distortion (the
// MeshDistortMaterial look) injected into the physical material.
const SNOISE = /* glsl */ `
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x,289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0); const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy)); vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz); vec3 l=1.0-g; vec3 i1=min(g.xyz,l.zxy); vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+1.0*C.xxx; vec3 x2=x0-i2+2.0*C.xxx; vec3 x3=x0-1.0+3.0*C.xxx;
  i=mod(i,289.0);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=1.0/7.0; vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z); vec4 x_=floor(j*ns.z); vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy; vec4 y=y_*ns.x+ns.yyyy; vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy); vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0; vec4 s1=floor(b1)*2.0+1.0; vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy; vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x); vec3 p1=vec3(a0.zw,h.y); vec3 p2=vec3(a1.xy,h.z); vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0); m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`

export interface SceneHandle {
  setMobile(isMobile: boolean): void
  setPointer(x: number, y: number): void
  dispose(): void
}

export function initScene(
  canvas: HTMLCanvasElement,
  opts: { isMobile: boolean; segments?: number; maxDpr?: number },
): SceneHandle {
  const segments = opts.segments ?? 64
  const maxDpr = opts.maxDpr ?? 2
  let isMobile = opts.isMobile

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr))

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(isMobile ? 85 : 75, 1, 0.1, 100)
  camera.position.set(0, 0, 5)

  scene.add(new THREE.AmbientLight(0xffffff, 0.8))
  const d1 = new THREE.DirectionalLight(0xffffff, 0.5); d1.position.set(5, 5, 5); scene.add(d1)
  const d2 = new THREE.DirectionalLight(0xffffff, 0.3); d2.position.set(-5, -5, -5); scene.add(d2)

  // Orbs — MeshPhysicalMaterial + injected simplex distortion (≈ drei MeshDistortMaterial)
  const orbs = ORBS.map((cfg) => {
    const geo = new THREE.SphereGeometry(1, segments, segments)
    const c = new THREE.Color(cfg.color)
    const mat = new THREE.MeshPhysicalMaterial({
      color: c,
      // Self-glow so the orbs read as soft colored light over the dark bg
      // (not dark glass), like the v2 MeshDistortMaterial look.
      emissive: c,
      emissiveIntensity: 0.55,
      transparent: true,
      opacity: 0.32,
      roughness: 0.45,
      metalness: 0.0,
      depthWrite: false,
    })
    const shaderRef: { current: THREE.WebGLProgramParametersWithUniforms | null } = { current: null }
    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = { value: 0 }
      shader.uniforms.uDistort = { value: cfg.distort }
      shader.vertexShader = `uniform float uTime; uniform float uDistort;\n${SNOISE}\n` + shader.vertexShader
      // Low-frequency, slow noise → smooth broad wobble (not spikes).
      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>\n  float czapN = snoise(position * 0.55 + uTime * 0.5);\n  transformed += normal * czapN * uDistort;`,
      )
      shaderRef.current = shader
    }
    const mesh = new THREE.Mesh(geo, mat)
    scene.add(mesh)
    return { mesh, cfg, shaderRef }
  })

  // Grid plane (the v2 GridPlane shader)
  const gridMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false,
    uniforms: { uTime: { value: 0 }, uColor: { value: new THREE.Color('#22d3ee') }, uOpacity: { value: 0.03 } },
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: `uniform float uTime; uniform vec3 uColor; uniform float uOpacity; varying vec2 vUv;
      void main(){
        vec2 grid = abs(fract(vUv*30.0-0.5)-0.5)/fwidth(vUv*30.0);
        float line = min(grid.x, grid.y);
        float g = 1.0 - min(line, 1.0);
        float fade = smoothstep(0.0,0.3,vUv.x)*smoothstep(1.0,0.7,vUv.x)*smoothstep(0.0,0.3,vUv.y)*smoothstep(1.0,0.7,vUv.y);
        float pulse = sin(uTime*0.5)*0.1+0.9;
        gl_FragColor = vec4(uColor, g*uOpacity*fade*pulse);
      }`,
  })
  const grid = new THREE.Mesh(new THREE.PlaneGeometry(50, 50, 1, 1), gridMat)
  grid.rotation.x = -Math.PI / 2; grid.position.y = -2
  scene.add(grid)

  const resize = () => {
    const w = canvas.clientWidth || window.innerWidth
    const h = canvas.clientHeight || window.innerHeight
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.fov = isMobile ? 85 : 75
    camera.updateProjectionMatrix()
  }
  resize()
  window.addEventListener('resize', resize, { passive: true })

  let px = 0, py = 0, tx = 0, ty = 0
  const clock = new THREE.Clock()
  let raf = 0
  const tick = () => {
    const t = clock.getElapsedTime()
    px += (tx - px) * 0.05; py += (ty - py) * 0.05
    const strength = isMobile ? 0.4 : 1.0
    for (const { mesh, cfg, shaderRef } of orbs) {
      const base = isMobile ? cfg.mobilePosition : cfg.position
      const size = isMobile ? cfg.mobileSize : cfg.size
      mesh.scale.setScalar(size)
      mesh.position.x = base[0] + Math.sin(t * cfg.speed) * 0.3 + px * strength
      mesh.position.y = base[1] + Math.cos(t * cfg.speed * 0.8) * 0.2 + py * strength
      mesh.position.z = base[2]
      mesh.rotation.x = t * 0.1
      mesh.rotation.y = t * 0.15
      if (shaderRef.current) shaderRef.current.uniforms.uTime.value = t
    }
    gridMat.uniforms.uTime.value = t
    renderer.render(scene, camera)
    raf = requestAnimationFrame(tick)
  }
  tick()

  return {
    setMobile(m) { isMobile = m; resize() },
    setPointer(x, y) { tx = x; ty = y },
    dispose() {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      orbs.forEach((o) => { o.mesh.geometry.dispose(); ;(o.mesh.material as THREE.Material).dispose() })
      grid.geometry.dispose(); gridMat.dispose()
      renderer.dispose()
    },
  }
}

// Audio-reactive field.
//
// A gesture-gated generative ambient bed (drone + breathing LFO + a loose
// pentatonic arp) routed through an AnalyserNode. Each frame the measured
// level is pushed to the shader as u_audio via the SAME czap:uniform-update
// channel the scroll bridge uses, and to CSS as --czap-audio. The WebGL
// field blooms and quickens with the sound.
//
// Self-contained on purpose: no audio asset, no autoplay fight — the field
// reacts to real audio output, unlocked by a click.

interface AudioField {
  toggle: () => Promise<boolean>
  running: () => boolean
}

const PENTATONIC = [220, 247.5, 293.66, 329.63, 392, 440, 587.33] // A pentatonic-ish

export function createAudioField(): AudioField {
  let ctx: AudioContext | null = null
  let master: GainNode | null = null
  let analyser: AnalyserNode | null = null
  let bins: Uint8Array | null = null
  let running = false
  let raf = 0
  let arpTimer: number | null = null
  let level = 0
  const drones: OscillatorNode[] = []

  const buildGraph = (): void => {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    ctx = new AC()
    master = ctx.createGain()
    master.gain.value = 0.0001
    analyser = ctx.createAnalyser()
    analyser.fftSize = 256
    analyser.smoothingTimeConstant = 0.8
    bins = new Uint8Array(analyser.frequencyBinCount)
    master.connect(analyser)
    analyser.connect(ctx.destination)

    // Drone: two detuned sines through a gentle lowpass.
    const lp = ctx.createBiquadFilter()
    lp.type = 'lowpass'
    lp.frequency.value = 520
    const droneGain = ctx.createGain()
    droneGain.gain.value = 0.5
    lp.connect(droneGain)
    droneGain.connect(master)
    for (const f of [110, 110.6, 73.4]) {
      const o = ctx.createOscillator()
      o.type = 'sine'
      o.frequency.value = f
      o.connect(lp)
      o.start()
      drones.push(o)
    }
    // Breathing LFO on the drone gain.
    const lfo = ctx.createOscillator()
    const lfoGain = ctx.createGain()
    lfo.frequency.value = 0.07
    lfoGain.gain.value = 0.25
    lfo.connect(lfoGain)
    lfoGain.connect(droneGain.gain)
    lfo.start()
    drones.push(lfo)
  }

  // One soft bell note with an ADSR envelope — these drive the reactivity.
  const pluck = (): void => {
    if (!ctx || !master) return
    const now = ctx.currentTime
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = Math.random() < 0.5 ? 'sine' : 'triangle'
    o.frequency.value = PENTATONIC[(Math.random() * PENTATONIC.length) | 0]! * (Math.random() < 0.3 ? 2 : 1)
    g.gain.setValueAtTime(0.0001, now)
    g.gain.exponentialRampToValueAtTime(0.5, now + 0.02)
    g.gain.exponentialRampToValueAtTime(0.0001, now + 1.6)
    o.connect(g)
    g.connect(master)
    o.start(now)
    o.stop(now + 1.7)
  }

  const scheduleArp = (): void => {
    pluck()
    arpTimer = window.setTimeout(scheduleArp, 400 + Math.random() * 1400)
  }

  const tick = (): void => {
    if (!analyser || !bins) return
    analyser.getByteFrequencyData(bins)
    let sum = 0
    for (let i = 0; i < bins.length; i++) sum += bins[i]!
    const raw = sum / (bins.length * 255) // 0..1
    level += (raw - level) * 0.2 // smooth
    const v = Math.min(1, level * 2.2)
    document.documentElement.style.setProperty('--czap-audio', v.toFixed(3))
    document.dispatchEvent(new CustomEvent('czap:uniform-update', { detail: { uniform: 'u_audio', value: v } }))
    raf = requestAnimationFrame(tick)
  }

  const start = async (): Promise<void> => {
    if (!ctx) buildGraph()
    await ctx!.resume()
    const now = ctx!.currentTime
    master!.gain.cancelScheduledValues(now)
    master!.gain.setValueAtTime(Math.max(0.0001, master!.gain.value), now)
    master!.gain.exponentialRampToValueAtTime(0.16, now + 1.5)
    scheduleArp()
    running = true
    tick()
  }

  const stop = (): void => {
    if (!ctx || !master) return
    const now = ctx.currentTime
    master.gain.cancelScheduledValues(now)
    master.gain.setValueAtTime(master.gain.value, now)
    master.gain.exponentialRampToValueAtTime(0.0001, now + 0.8)
    if (arpTimer !== null) { clearTimeout(arpTimer); arpTimer = null }
    cancelAnimationFrame(raf)
    running = false
    // ease the uniform back to calm
    let f = level
    const decay = (): void => {
      f *= 0.85
      document.documentElement.style.setProperty('--czap-audio', f.toFixed(3))
      document.dispatchEvent(new CustomEvent('czap:uniform-update', { detail: { uniform: 'u_audio', value: f } }))
      if (f > 0.005) requestAnimationFrame(decay)
    }
    decay()
  }

  return {
    running: () => running,
    toggle: async () => {
      if (running) { stop(); return false }
      await start()
      return true
    },
  }
}

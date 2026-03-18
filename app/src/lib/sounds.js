const STORAGE_KEY = 'aible_sounds'

let audioCtx = null
let soundsEnabled = null

function getSoundsEnabled() {
  if (soundsEnabled !== null) return soundsEnabled
  try {
    soundsEnabled = localStorage.getItem(STORAGE_KEY) === 'true'
  } catch {
    soundsEnabled = false
  }
  return soundsEnabled
}

export function setSoundsEnabled(enabled) {
  soundsEnabled = enabled
  try {
    localStorage.setItem(STORAGE_KEY, enabled ? 'true' : 'false')
  } catch {}
}

export function isSoundsEnabled() {
  return getSoundsEnabled()
}

function getContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

function playTone(frequency, duration, type = 'sine', volume = 0.15) {
  if (!getSoundsEnabled()) return
  try {
    const ctx = getContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(frequency, ctx.currentTime)
    gain.gain.setValueAtTime(volume, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + duration)
  } catch {}
}

export function playXpSound() {
  if (!getSoundsEnabled()) return
  try {
    const ctx = getContext()
    const now = ctx.currentTime
    // Rising two-note chime
    ;[523.25, 659.25].forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now + i * 0.12)
      gain.gain.setValueAtTime(0.12, now + i * 0.12)
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.3)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now + i * 0.12)
      osc.stop(now + i * 0.12 + 0.3)
    })
  } catch {}
}

export function playSessionComplete() {
  if (!getSoundsEnabled()) return
  try {
    const ctx = getContext()
    const now = ctx.currentTime
    // Triumphant 3-note ascending
    ;[523.25, 659.25, 783.99].forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now + i * 0.15)
      gain.gain.setValueAtTime(0.12, now + i * 0.15)
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.15 + 0.4)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now + i * 0.15)
      osc.stop(now + i * 0.15 + 0.4)
    })
  } catch {}
}

export function playMessageSent() {
  playTone(880, 0.08, 'sine', 0.06)
}

export function playError() {
  playTone(220, 0.2, 'triangle', 0.08)
}

export function playHaptic(pattern = 50) {
  try {
    if (navigator.vibrate) {
      navigator.vibrate(typeof pattern === 'number' ? pattern : pattern)
    }
  } catch {}
}

let audioCtx: AudioContext | null = null

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null

  if (!audioCtx) {
    audioCtx = new AudioContext()
  }

  if (audioCtx.state === 'suspended') {
    void audioCtx.resume()
  }

  return audioCtx
}

export function initAudio() {
  getAudioContext()
}

function playTone(
  frequency: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume = 0.25,
  delay = 0,
) {
  const ctx = getAudioContext()
  if (!ctx) return

  const startAt = ctx.currentTime + delay
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.type = type
  osc.frequency.value = frequency
  gain.gain.setValueAtTime(volume, startAt)
  gain.gain.exponentialRampToValueAtTime(0.001, startAt + duration)

  osc.connect(gain)
  gain.connect(ctx.destination)

  osc.start(startAt)
  osc.stop(startAt + duration + 0.05)
}

export function playWorkCompleteSound(enabled: boolean) {
  if (!enabled) return

  initAudio()
  playTone(523.25, 0.18, 'sine', 0.28, 0)
  playTone(659.25, 0.18, 'sine', 0.28, 0.16)
  playTone(783.99, 0.35, 'sine', 0.3, 0.32)
}

export function playRestStartSound(enabled: boolean) {
  if (!enabled) return

  initAudio()
  playTone(392, 0.22, 'triangle', 0.22, 0)
  playTone(329.63, 0.35, 'triangle', 0.2, 0.18)
}

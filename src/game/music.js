// Muzyka w stylu SID (C64): trzy głosy – melodia (fala prostokątna), bas (trójkątna), perkusja (szum).
// Wszystkie melodie są oryginalnymi kompozycjami do Kolony Vibe.
// Zapis: jeden krok = ósemka; nuta np. 'A4', 'C#5'; '.' – cisza; '-' – przedłużenie poprzedniej nuty.
// Perkusja: k – bęben basowy, s – werbel, h – hi-hat.
import { audioCtx } from './audio.js'

const bars = (...b) => b.join(' ').split(/\s+/).filter(Boolean)

export const THEMES = {
  calm: {
    n: 'Spokojny poranek na kolonii', bpm: 108, loop: true,
    lead: bars('A4 - C5 - E5 - D5 C5', 'B4 - G4 - B4 - D5 -', 'A4 - C5 - E5 - G5 E5', 'F5 - E5 - D5 - C5 -',
      'A4 - C5 - E5 - D5 C5', 'B4 - D5 - G5 - F5 E5', 'D5 - C5 - B4 - G4 -', 'A4 - - - . . . .'),
    bass: bars('A2 . . . A2 . E2 .', 'G2 . . . G2 . D3 .', 'F2 . . . F2 . C3 .', 'E2 . . . E2 . B2 .',
      'A2 . . . A2 . E2 .', 'G2 . . . G2 . D3 .', 'F2 . . . E2 . . .', 'A2 . . . A2 . . .'),
    drum: bars('k . h . s . h .', 'k . h . s . h h', 'k . h . s . h .', 'k . h . s . h h',
      'k . h . s . h .', 'k . h . s . h h', 'k . h . s . h .', 'k . . . s . . .')
  },
  crisis: {
    n: 'Alarm w kopule', bpm: 140, loop: true,
    lead: bars('D5 - D5 - F5 - E5 -', 'C#5 - - - A4 - - -', 'D5 - F5 - A5 - G5 F5', 'E5 - C#5 - A4 - - -',
      'D5 - D5 - F5 - E5 -', 'C#5 - E5 - G5 - F5 E5', 'D5 - A4 - F4 - E4 -', 'D4 - - - . . . .'),
    bass: bars('D2 D2 . D2 D2 . D2 .', 'A1 A1 . A1 A1 . A1 .', 'D2 D2 . D2 D2 . D2 .', 'A1 A1 . A1 C#2 . E2 .',
      'D2 D2 . D2 D2 . D2 .', 'A1 A1 . A1 A1 . A1 .', 'Bb1 Bb1 . Bb1 A1 . A1 .', 'D2 . . . D2 . . .'),
    drum: bars('k h k h s h k h', 'k h k h s h s s', 'k h k h s h k h', 'k h k h s h s s',
      'k h k h s h k h', 'k h k h s h s s', 'k h k h s h k h', 'k . k . s s s s')
  },
  victory: {
    n: 'Order Pioniera', bpm: 126, loop: false,
    lead: bars('C5 - E5 - G5 - C6 -', '- - G5 - C6 - - -', 'A5 - F5 - A5 - C6 -', 'B5 - G5 - B5 - D6 -', 'C6 - - - - - - -'),
    bass: bars('C3 . . . C3 . G2 .', 'C3 . . . E3 . G3 .', 'F2 . . . F2 . A2 .', 'G2 . . . G2 . B2 .', 'C3 . . . . . . .'),
    drum: bars('k . h . s . h .', 'k . h . s . h .', 'k . h . s . h .', 'k . s . s . s s', 'k . . . . . . .')
  },
  defeat: {
    n: 'Puste korytarze', bpm: 72, loop: false,
    lead: bars('E4 - - - D4 - - -', 'C4 - - - B3 - - -', 'A3 - - - - - - -'),
    bass: bars('A2 . . . G2 . . .', 'F2 . . . E2 . . .', 'A1 . . . . . . .'),
    drum: bars('k . . . . . . .', 'k . . . . . . .', 'k . . . . . . .')
  }
}

const NOTE = { C: 0, 'C#': 1, Db: 1, D: 2, 'D#': 3, Eb: 3, E: 4, F: 5, 'F#': 6, Gb: 6, G: 7, 'G#': 8, Ab: 8, A: 9, 'A#': 10, Bb: 10, B: 11 }
// częstotliwość nuty, np. 'A4' → 440 Hz
export function freq(note) {
  const m = /^([A-G][#b]?)(\d)$/.exec(note)
  if (!m) return null
  return 440 * Math.pow(2, (NOTE[m[1]] + (+m[2] + 1) * 12 - 69) / 12)
}

// ile kroków trwa nuta zaczynająca się na kroku i (razem z przedłużeniami '-')
export function noteLen(track, i) {
  let n = 1
  while (track[(i + n) % track.length] === '-' && n < track.length) n++
  return n
}

// który motyw grać: koniec gry > kryzys > spokój
export function themeFor(s, c) {
  if (!s) return 'calm'
  if (s.over) return s.over.win ? 'victory' : 'defeat'
  if ((s.hungerDays || 0) > 0 || (c && c.f < 1) || s.cr < 0 || s.mor < 25) return 'crisis'
  return 'calm'
}

// ---- odtwarzanie ----
let current = null, step = 0, nextAt = 0, timer = null, master = null, noise = null, finished = false

function voice(ctx, type, f, t, dur, vol) {
  const o = ctx.createOscillator(), g = ctx.createGain()
  o.type = type; o.frequency.value = f
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur * 0.95)
  o.connect(g); g.connect(master); o.start(t); o.stop(t + dur)
}
function drum(ctx, kind, t) {
  if (kind === 'k') {
    const o = ctx.createOscillator(), g = ctx.createGain()
    o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(40, t + 0.12)
    g.gain.setValueAtTime(0.5, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.15)
    o.connect(g); g.connect(master); o.start(t); o.stop(t + 0.16)
    return
  }
  if (!noise) { noise = ctx.createBuffer(1, ctx.sampleRate * 0.2, ctx.sampleRate); const d = noise.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1 }
  const src = ctx.createBufferSource(), flt = ctx.createBiquadFilter(), g = ctx.createGain(), len = kind === 's' ? 0.12 : 0.04
  src.buffer = noise; flt.type = kind === 's' ? 'bandpass' : 'highpass'; flt.frequency.value = kind === 's' ? 1800 : 7000
  g.gain.setValueAtTime(kind === 's' ? 0.25 : 0.1, t); g.gain.exponentialRampToValueAtTime(0.0001, t + len)
  src.connect(flt); flt.connect(g); g.connect(master); src.start(t); src.stop(t + len)
}

function schedule() {
  const ctx = audioCtx()
  if (!ctx || !current || finished) return
  const th = THEMES[current], dt = 60 / th.bpm / 2
  while (nextAt < ctx.currentTime + 0.2) {
    const i = step % th.lead.length
    if (!th.loop && step >= th.lead.length) { finished = true; return }
    const L = th.lead[i], B = th.bass[i % th.bass.length], D = th.drum[i % th.drum.length]
    if (freq(L)) voice(ctx, 'square', freq(L), nextAt, dt * noteLen(th.lead, i), 0.06)
    if (freq(B)) voice(ctx, 'triangle', freq(B), nextAt, dt * noteLen(th.bass, i % th.bass.length) * 0.9, 0.18)
    if ('ksh'.includes(D)) drum(ctx, D, nextAt)
    step++; nextAt += dt
  }
}

// włącza dany motyw (albo wyłącza muzykę dla null); ten sam motyw gra dalej bez restartu
export function playTheme(name) {
  const ctx = audioCtx()
  if (!ctx) return
  if (!master) { master = ctx.createGain(); master.gain.value = 0.35; master.connect(ctx.destination) }
  if (name === current) return
  current = name; step = 0; finished = false; nextAt = ctx.currentTime + 0.05
  if (!timer) timer = setInterval(schedule, 50)
  if (!name) { clearInterval(timer); timer = null }
}
export const playingTheme = () => current

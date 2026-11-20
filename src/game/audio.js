import { reactive } from 'vue'

export const audio = reactive({ sound: true })
let actx = null

// kontekst dźwięku powstaje przy pierwszym kliknięciu (wymóg przeglądarek); używają go efekty i muzyka
export function initAudio() {
  if (actx) { if (actx.state === 'suspended') actx.resume(); return }
  try { actx = new (window.AudioContext || window.webkitAudioContext)() } catch (e) { /* brak dźwięku */ }
}
export const audioCtx = () => actx

// zgaszony ekran, przełączona karta albo zminimalizowana przeglądarka: wstrzymaj dźwięk (muzykę i efekty);
// po powrocie gra dalej od miejsca, w którym przerwała (zatrzymany kontekst zatrzymuje też czas muzyki)
export function onVisibility(hidden) {
  if (!actx) return
  if (hidden) { if (actx.state === 'running') actx.suspend() }
  else if (actx.state === 'suspended') actx.resume()
}
if (typeof document !== 'undefined') document.addEventListener('visibilitychange', () => onVisibility(document.hidden))

export function beep(f, d) {
  if (!audio.sound || !actx) return
  try {
    const o = actx.createOscillator(), g = actx.createGain()
    o.type = 'square'; o.frequency.value = f; g.gain.value = 0.04
    o.connect(g); g.connect(actx.destination); o.start()
    g.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + d)
    o.stop(actx.currentTime + d + 0.02)
  } catch (e) { /* ignoruj */ }
}

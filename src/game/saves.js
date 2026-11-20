import { migrate } from './state.js'

// Ręczne sloty zapisu (obok autozapisu bieżącej gry) oraz eksport/import gry jako kod tekstowy albo plik.
export const SLOTS = 3
const slotKey = i => 'kolony-vibe-slot-' + i

// { i, at – data zapisu (ISO), sc, m, pop, over } albo null dla pustego slotu
export function slotInfo(i) {
  try {
    const v = JSON.parse(localStorage.getItem(slotKey(i)) || 'null')
    return v && v.s ? { i, at: v.at, sc: v.s.sc || 'moon', m: v.s.m, pop: Math.round(v.s.pop), over: !!v.s.over } : null
  } catch (e) { return null }
}
export const listSlots = () => Array.from({ length: SLOTS }, (_, i) => slotInfo(i + 1))

export function saveSlot(i, s) {
  try { localStorage.setItem(slotKey(i), JSON.stringify({ at: new Date().toISOString(), s })); return true } catch (e) { return false }
}
// zwraca stan gry (uzupełniony do obecnej wersji) albo null
export function loadSlot(i) {
  try { const v = JSON.parse(localStorage.getItem(slotKey(i)) || 'null'); return v ? migrate(v.s).s : null } catch (e) { return null }
}
export function deleteSlot(i) { try { localStorage.removeItem(slotKey(i)) } catch (e) { /* brak zapisu */ } }

// --- kod gry: "KV1:" + base64(gzip(JSON)), bez kompresji (starsze przeglądarki): "KV0:" + base64(JSON) ---
const toB64 = bytes => { let s = ''; for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000)); return btoa(s) }
const fromB64 = b64 => Uint8Array.from(atob(b64), ch => ch.charCodeAt(0))
async function pipe(bytes, stream) { return new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(stream)).arrayBuffer()) }

export async function exportCode(s) {
  const raw = new TextEncoder().encode(JSON.stringify(s))
  if (typeof CompressionStream !== 'undefined') return 'KV1:' + toB64(await pipe(raw, new CompressionStream('gzip')))
  return 'KV0:' + toB64(raw)
}

// przyjmuje kod gry albo zawartość pliku (kod lub czysty JSON); zwraca stan gry albo null
export async function importText(text) {
  try {
    text = String(text || '').trim()
    let json
    if (text.startsWith('KV1:')) json = new TextDecoder().decode(await pipe(fromB64(text.slice(4)), new DecompressionStream('gzip')))
    else if (text.startsWith('KV0:')) json = new TextDecoder().decode(fromB64(text.slice(4)))
    else json = text
    return migrate(JSON.parse(json)).s
  } catch (e) { return null }
}

// plik do pobrania: czytelny JSON stanu gry
export function downloadSave(s, name) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(s)], { type: 'application/json' }))
  const a = document.createElement('a')
  a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

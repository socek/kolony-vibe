import { t } from './i18n.js'
import { scenarioOf, diffOf } from './game/scenarios.js'
import { score } from './game/state.js'
import { BADGES } from './game/badges.js'
import { pixels } from './game/icons.js'
import { fmt } from './game/format.js'
import { DAYS } from './game/constants.js'

// Udostępnianie wyniku po końcu gry: tekst (systemowe udostępnianie albo schowek) i obrazek w stylu C64.
export const GAME_URL = 'https://socek.github.io/kolony-vibe/'

const facts = s => {
  const sc = scenarioOf(s), free = !!sc.noScore
  return {
    scen: sc.n, diff: diffOf(s).n.toLowerCase(), end: s.over ? s.over.t : '', free,
    score: free ? null : score(s), day: sc.endless ? s.m : Math.min(s.m, DAYS), pop: fmt(s.pop),
    badges: (s.earned || []).map(k => (BADGES.find(b => b.k === k) || {}).n).filter(Boolean)
  }
}

export function shareText(s) {
  const f = facts(s)
  return t('share.text', f) + (f.badges.length ? ' ' + t('share.badges', { b: f.badges.join(', ') }) : '') + ' ' + t('share.play') + ' ' + GAME_URL
}

// obrazek 1200×630 (proporcje kart w serwisach społecznościowych)
export async function drawCard(s) {
  const f = facts(s), W = 1200, H = 630
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H
  const g = cv.getContext('2d')
  try { await document.fonts.ready } catch (e) { /* czcionki systemowe */ }
  const C = { border: '#6C5EB5', screen: '#352879', text: '#B3ADFF', white: '#ffffff', yellow: '#E3EA9A', green: '#A6E08F', red: '#FF9F90', cyan: '#9ADCE8' }
  g.fillStyle = C.border; g.fillRect(0, 0, W, H)
  g.fillStyle = C.screen; g.fillRect(40, 40, W - 80, H - 80)
  const icon = (name, x, y, size) => { const px = size / 8; for (const p of pixels(name)) { g.fillStyle = p.fill; g.fillRect(x + p.x * px, y + p.y * px, px, px) } }
  const text = (str, x, y, font, color) => { g.font = font; g.fillStyle = color; g.fillText(str, x, y) }
  icon('pop', 80, 78, 48)
  text('KOLONY', 150, 120, '40px "Press Start 2P", monospace', C.white)
  text('VIBE', 150 + g.measureText('KOLONY ').width, 120, '40px "Press Start 2P", monospace', C.cyan)
  text(f.scen.toUpperCase() + ' · ' + f.diff, 80, 190, '40px VT323, monospace', C.text)
  text(f.end, 80, 270, '36px "Press Start 2P", monospace', s.over && s.over.win ? C.green : C.red)
  text(f.free ? t('share.daysBig', { n: f.day }) : t('share.scoreBig', { n: f.score }), 80, 360, '64px "Press Start 2P", monospace', C.yellow)
  text(t('share.stats', f), 80, 430, '40px VT323, monospace', C.white)
  if (f.badges.length) text('★ ' + f.badges.join(' · ').slice(0, 70), 80, 485, '34px VT323, monospace', C.green)
  text(GAME_URL.replace('https://', ''), 80, 555, '34px VT323, monospace', C.cyan)
  return new Promise(res => cv.toBlob(res, 'image/png'))
}

const fileName = s => 'kolony-vibe-' + (s.sc || 'moon') + '.png'

// systemowe udostępnianie (z obrazkiem, jeśli się da), inaczej kopiowanie tekstu; zwraca 'shared' | 'copied' | 'failed' | 'cancel'
export async function shareResult(s) {
  const text = shareText(s)
  try {
    if (navigator.share) {
      const blob = await drawCard(s), file = blob && new File([blob], fileName(s), { type: 'image/png' })
      const data = file && navigator.canShare && navigator.canShare({ files: [file] }) ? { text, files: [file] } : { text }
      await navigator.share(data)
      return 'shared'
    }
  } catch (e) { if (e && e.name === 'AbortError') return 'cancel' }
  try { await navigator.clipboard.writeText(text); return 'copied' } catch (e) { return 'failed' }
}

export async function downloadCard(s) {
  const blob = await drawCard(s)
  if (!blob) return false
  const url = URL.createObjectURL(blob), a = document.createElement('a')
  a.href = url; a.download = fileName(s); document.body.appendChild(a); a.click(); a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
  return true
}

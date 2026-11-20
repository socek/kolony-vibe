import { TABS } from './game/constants.js'

// Skróty klawiszowe (komputer): spacja – koniec dnia (albo decyzja), W – 7 dni, 1–8 – zakładki,
// Esc – menu gry (albo zamknięcie otwartego ekranu). Nie działają podczas pisania w polach formularzy.
export function setupKeys({ ui, game, advance, setTab, showScreen, closeScreen, goBack, closeHint }) {
  window.addEventListener('keydown', e => {
    if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey) return
    const el = e.target
    if (el && (el.isContentEditable || /^(INPUT|SELECT|TEXTAREA)$/.test(el.tagName))) return
    const k = e.key, s = game.s
    if (k === 'Escape') {
      e.preventDefault()
      if (!ui.screen) return showScreen('menu')
      if (ui.screen === 'menu' || ui.screen === 'choice' || ui.screen === 'end') return closeScreen()
      if (ui.screen === 'hint') return closeHint(false)
      if (ui.screen === 'settings' || ui.screen === 'scores') return showScreen('menu')
      if (['help', 'about', 'log'].includes(ui.screen)) return goBack()
      return
    }
    // pozostałe skróty tylko w samej grze (bez otwartego ekranu i animacji)
    if (ui.screen || ui.busy || !s || s.over) return
    if (k === ' ' || k === 'Spacebar') {
      e.preventDefault()
      if (s.pending) showScreen('choice'); else advance(1)
    } else if ((k === 'w' || k === 'W') && !s.pending) advance(7)
    else if (/^[1-9]$/.test(k) && TABS[+k - 1]) setTab(TABS[+k - 1][0])
  })
}

// Podpowiedzi kontekstowe: pokazują się, gdy coś dzieje się w grze pierwszy raz.
// Klucze to powody zatrzymania przewijania zwracane przez endTurn.
import { localize } from '../i18n.js'

export const HINTS = {
  short: {},
  hunger: {},
  black: {},
  depleted: {},
  nodep: {},
  nores: {},
  choice: {},
  broke: {},
  order: {},
  crowd: {},
  debt: {},
  build: {},
  exp: {}
}

// tytuły i treści ze słowników (hint.<k>.t, hint.<k>.d)
localize(HINTS, 'hint', ['t', 'd'])

// wybiera pierwszą podpowiedź, która pasuje do powodów, nie była pokazana w tej grze i nie została wyłączona
export function pickHint(reasons, shown, disabled) {
  return Object.keys(HINTS).find(k => reasons.includes(k) && !shown.includes(k) && !disabled[k]) || null
}

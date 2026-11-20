import { t } from '../i18n.js'
import { BLD, TECH } from './constants.js'
import { calc } from './calc.js'
import { addSick } from './workforce.js'
import { bumpStat } from './badges.js'

// Zdarzenia z wyborem. Każda opcja: n – nazwa, d – podpowiedź (znane skutki),
// need(s) – powód, dla którego opcja jest niedostępna (albo ''), run(s) – skutek, zwraca opis.
// Ostatnia opcja każdego zdarzenia jest zawsze dostępna, więc decyzję zawsze da się podjąć.
const R = Math.round
const rnd = () => Math.random()
const lack = (s, cr, min) => s.cr < cr ? t('ch.lackCr') : (min && s.min < min ? t('ch.lackMin') : '')
const randomBuilding = s => { const ks = Object.keys(BLD).filter(k => s.b[k] > 0); return ks.length ? ks[Math.floor(rnd() * ks.length)] : null }
// skutki opcji: kredyty i morale, np. „−150 kr, +3 morale” (jednostka zależy od języka)
// tekst opcji: ch.<zdarzenie>.<nr opcji>.<pole>
const o = (k, i, f, p) => t('ch.' + k + '.' + i + '.' + f, p)

// Teksty zdarzeń są w słownikach: tytuł ch.<k>.t, opis ch.<k>.d, opcje ch.<k>.<i>.n / .d (skutki) / .r… (wynik)
export const CHOICES = {
  // ---------- 2 opcje ----------
  ransom: {
    d: s => t('ch.ransom.d', { n: ransomOf(s) }),
    opts: [
      { d: s => o('ransom', 0, 'd', { n: ransomOf(s) }), need: s => lack(s, ransomOf(s)), run: s => { const n = ransomOf(s); s.cr -= n; return o('ransom', 0, 'r', { n }) } },
      {
        d: () => o('ransom', 1, 'd'),
        run: s => {
          const red = calc(s).defRed, loot = R(Math.max(80, s.cr * 0.25) * (1 - red))
          s.cr -= Math.min(Math.max(s.cr, 0), loot); s.mor -= 4 * (1 - red)
          if (red > 0) bumpStat(s, 'repelled')
          return o('ransom', 1, red > 0 ? 'r' : 'r2', { n: loot })
        }
      }
    ]
  },
  sick: {
    d: () => t('ch.sick.d'),
    opts: [
      {
        d: () => o('sick', 0, 'd'),
        run: s => {
          const n = R(Math.min(15, Math.max(0, calc(s).cap - s.pop))); s.pop += n
          if (rnd() < 0.5) { const d = R(s.pop * (s.tech.med ? 0.02 : 0.05) * (1 - 0.5 * calc(s).hospRed)); s.pop -= d; addSick(s, 10); return o('sick', 0, 'r2', { n, d }) }
          return o('sick', 0, 'r', { n })
        }
      },
      { d: () => t('ch.fx', { mor: -3 }), run: s => { s.mor -= 3; return o('sick', 1, 'r') } }
    ]
  },
  trader: {
    d: () => t('ch.trader.d'),
    opts: [
      { d: () => o('trader', 0, 'd'), need: s => lack(s, 300), run: s => { s.cr -= 300; s.min += 150; return o('trader', 0, 'r') } },
      { d: () => t('ch.noEffect'), run: () => o('trader', 1, 'r') }
    ]
  },
  strike: {
    d: () => t('ch.strike.d'),
    opts: [
      { d: () => t('ch.fx', { cr: -150, mor: +3 }), need: s => lack(s, 150), run: s => { s.cr -= 150; s.mor += 3; return o('strike', 0, 'r') } },
      { d: () => t('ch.fx', { mor: -6 }), run: s => { s.mor -= 6; return o('strike', 1, 'r') } }
    ]
  },
  beacon: {
    d: () => t('ch.beacon.d'),
    opts: [
      {
        d: () => o('beacon', 0, 'd'),
        run: s => {
          if (rnd() < 0.6) { s.min += 200; s.cr += 100; return o('beacon', 0, 'r') }
          const d = Math.min(3, R(s.pop)); s.pop -= d; return o('beacon', 0, 'r2', { d })
        }
      },
      { d: () => t('ch.noEffect'), run: () => o('beacon', 1, 'r') }
    ]
  },
  // ---------- 3 opcje ----------
  swarm: {
    d: () => t('ch.swarm.d'),
    opts: [
      { d: () => o('swarm', 0, 'd'), run: s => { s.mor -= 5; return o('swarm', 0, 'r') } },
      { d: () => o('swarm', 1, 'd'), need: s => lack(s, 0, 150), run: s => { s.min -= 150; return o('swarm', 1, 'r') } },
      {
        d: () => o('swarm', 2, 'd'),
        run: s => {
          if (rnd() < 0.5) return o('swarm', 2, 'r')
          const k = randomBuilding(s); if (!k) return o('swarm', 2, 'r2')
          s.b[k]--; return o('swarm', 2, 'r3', { n: BLD[k].n })
        }
      }
    ]
  },
  festival: {
    d: () => t('ch.festival.d'),
    opts: [
      { d: () => t('ch.fx', { cr: -200, mor: +12 }), need: s => lack(s, 200), run: s => { s.cr -= 200; s.mor += 12; return o('festival', 0, 'r') } },
      { d: () => t('ch.fx', { cr: -60, mor: +5 }), need: s => lack(s, 60), run: s => { s.cr -= 60; s.mor += 5; return o('festival', 1, 'r') } },
      { d: () => t('ch.fx', { mor: -4 }), run: s => { s.mor -= 4; return o('festival', 2, 'r') } }
    ]
  },
  journalist: {
    d: () => t('ch.journalist.d'),
    opts: [
      {
        d: () => o('journalist', 0, 'd'),
        need: s => lack(s, 50),
        run: s => {
          s.cr -= 50
          if (rnd() < 0.5) { const n = R(Math.min(15, Math.max(0, calc(s).cap - s.pop))); s.pop += n; return o('journalist', 0, 'r', { n }) }
          return o('journalist', 0, 'r2')
        }
      },
      { d: () => t('ch.fx', { cr: -150, mor: +6 }), need: s => lack(s, 150), run: s => { s.cr -= 150; s.mor += 6; return o('journalist', 1, 'r') } },
      { d: () => t('ch.fx', { mor: -3 }), run: s => { s.mor -= 3; return o('journalist', 2, 'r') } }
    ]
  },
  // ---------- 4 opcje ----------
  plague: {
    d: () => t('ch.plague.d'),
    opts: [
      { d: () => o('plague', 0, 'd'), run: s => { const d = R(s.pop * 0.02); s.pop -= d; s.mor -= 6; addSick(s, 7); return o('plague', 0, 'r', { d }) } },
      { d: () => o('plague', 1, 'd'), need: s => lack(s, 300), run: s => { s.cr -= 300; const d = R(s.pop * 0.01); s.pop -= d; addSick(s, 4); return o('plague', 1, 'r', { d }) } },
      {
        d: () => o('plague', 2, 'd'),
        run: s => { if (rnd() < 0.5) return o('plague', 2, 'r'); const d = R(s.pop * 0.08); s.pop -= d; addSick(s); return o('plague', 2, 'r2', { d }) }
      },
      { d: () => o('plague', 3, 'd'), run: s => { const d = R(s.pop * (s.tech.med ? 0.03 : 0.08) * (1 - 0.5 * calc(s).hospRed)); s.pop -= d; s.mor -= 5; addSick(s); return o('plague', 3, 'r', { d }) } }
    ]
  },
  smugglers: {
    d: () => t('ch.smugglers.d'),
    opts: [
      { d: () => o('smugglers', 0, 'd'), need: s => lack(s, 250), run: s => { s.cr -= 250; s.b.gun = (s.b.gun || 0) + 1; return o('smugglers', 0, 'r') } },
      { d: () => o('smugglers', 1, 'd'), need: s => lack(s, 150), run: s => { s.cr -= 150; s.food += 120; return o('smugglers', 1, 'r') } },
      {
        d: () => o('smugglers', 2, 'd'), need: s => s.rs ? lack(s, 200) : t('ch.noResearch'),
        run: s => { s.cr -= 200; s.rp[s.rs] = (s.rp[s.rs] || 0) + 30; return o('smugglers', 2, 'r', { n: TECH[s.rs].n }) }
      },
      { d: () => t('ch.noEffect'), run: () => o('smugglers', 3, 'r') }
    ]
  },
  // ---------- 5 opcji ----------
  gift: {
    d: () => t('ch.gift.d'),
    opts: [
      { d: () => t('ch.fx', { cr: -50, mor: +3 }), need: s => lack(s, 50), run: s => { s.cr -= 50; s.mor += 3; return o('gift', 0, 'r') } },
      { d: () => o('gift', 1, 'd'), need: s => lack(s, 0, 200), run: s => { s.min -= 200; s.cr += 400; return o('gift', 1, 'r') } },
      { d: () => o('gift', 2, 'd'), need: s => s.pop < 40 ? t('ch.fewPop') : '', run: s => { s.pop -= 10; s.cr += 600; return o('gift', 2, 'r') } },
      {
        d: () => o('gift', 3, 'd'),
        run: s => { if (rnd() < 0.5) { s.mor += 10; return o('gift', 3, 'r') } s.mor -= 5; return o('gift', 3, 'r2') }
      },
      { d: () => t('ch.fx', { mor: -8 }), run: s => { s.mor -= 8; return o('gift', 4, 'r') } }
    ]
  }
}

// tytuły zdarzeń i nazwy opcji jako gettery ze słownika
for (const k in CHOICES) {
  Object.defineProperty(CHOICES[k], 't', { get: () => t('ch.' + k + '.t'), enumerable: true })
  CHOICES[k].opts.forEach((x, i) => Object.defineProperty(x, 'n', { get: () => o(k, i, 'n'), enumerable: true }))
}

export const ransomOf = s => Math.max(100, R(Math.max(s.cr, 0) * 0.2))
export const CHOICE_KEYS = Object.keys(CHOICES)

// Wywołuje wybraną opcję; zwraca opis skutku albo null, jeśli opcja jest niedostępna.
export function resolveChoice(s, k, i) {
  const o = CHOICES[k].opts[i]
  if (!o || (o.need && o.need(s))) return null
  const txt = o.run(s)
  s.mor = Math.max(0, Math.min(100, s.mor)); s.pop = Math.max(0, s.pop)
  return CHOICES[k].t + ' – ' + o.n.toLowerCase() + ': ' + txt
}

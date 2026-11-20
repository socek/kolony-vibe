import { plForm } from '../../plural.js'

// Interfejs: formaty, pasek stanu, kafelki zasobów, dolny pasek
export default {
  'fmt.days': p => p.n + ' ' + plForm(p.n, 'dzień', 'dni', 'dni'),
  'fmt.DAYS': p => plForm(p.n, 'DZIEŃ', 'DNI', 'DNI'),
  'fmt.month.0': 'STY', 'fmt.month.1': 'LUT', 'fmt.month.2': 'MAR', 'fmt.month.3': 'KWI', 'fmt.month.4': 'MAJ', 'fmt.month.5': 'CZE',
  'fmt.month.6': 'LIP', 'fmt.month.7': 'SIE', 'fmt.month.8': 'WRZ', 'fmt.month.9': 'PAŹ', 'fmt.month.10': 'LIS', 'fmt.month.11': 'GRU',

  'top.day': 'DZIEŃ {d}/{max}',
  'top.season': 'PORA ROKU: {n}',
  'top.seasonNext': p => 'za ' + p.n + ' ' + plForm(p.n, 'dzień', 'dni', 'dni') + ': ' + p.next,
  'top.term': 'KADENCJA GUBERNATORA',
  'top.lastDay': 'OSTATNI DZIEŃ!',
  'top.left': p => 'ZOSTAŁO ' + p.n + ' ' + plForm(p.n, 'DZIEŃ', 'DNI', 'DNI'),

  'tile.pop': 'Koloniści', 'tile.mor': 'Morale', 'tile.food': 'Żywność', 'tile.energy': 'Energia', 'tile.min': 'Minerały',
  'tile.cr': 'Kredyty', 'tile.res': 'Badania', 'tile.work': 'Pracownicy',
  'tile.depNone': 'złoża: brak',
  'tile.dep': p => 'złoża: ' + p.t + ' t' + (p.days != null ? ' · ' + p.days : ''),
  'tile.hunger': 'głód: dzień {d}/{max}',
  'tile.hungerTomorrow': 'jutro zacznie się głód',

  'bar.decide': '⚠ DECYZJA!',
  'bar.endDay': '▶ KONIEC DNIA',
  'bar.week': '▶▶ 7 DNI',
  'bar.weekTitle': 'Przewiń do 7 dni – zatrzymuje się przy ważnych wydarzeniach (klawisz W)',
  'bar.endTitle': 'Klawisz: spacja',
  'bar.devTitle': 'Menu deweloperskie',
  'bar.menuTitle': 'Menu',
  'turn.day': 'DZIEŃ {d}'
}

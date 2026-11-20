import { enForm } from '../../plural.js'

// UI: formats, status bar, resource tiles, bottom bar
export default {
  'fmt.days': p => p.n + ' ' + enForm(p.n, 'day', 'days'),
  'fmt.DAYS': p => enForm(p.n, 'DAY', 'DAYS'),
  'fmt.month.0': 'JAN', 'fmt.month.1': 'FEB', 'fmt.month.2': 'MAR', 'fmt.month.3': 'APR', 'fmt.month.4': 'MAY', 'fmt.month.5': 'JUN',
  'fmt.month.6': 'JUL', 'fmt.month.7': 'AUG', 'fmt.month.8': 'SEP', 'fmt.month.9': 'OCT', 'fmt.month.10': 'NOV', 'fmt.month.11': 'DEC',

  'top.day': 'DAY {d}/{max}',
  'top.season': 'SEASON: {n}',
  'top.seasonNext': p => 'in ' + p.n + ' ' + enForm(p.n, 'day', 'days') + ': ' + p.next,
  'top.term': "GOVERNOR'S TERM",
  'top.lastDay': 'LAST DAY!',
  'top.left': p => p.n + ' ' + enForm(p.n, 'DAY', 'DAYS') + ' LEFT',

  'tile.pop': 'Colonists', 'tile.mor': 'Morale', 'tile.food': 'Food', 'tile.energy': 'Energy', 'tile.min': 'Minerals',
  'tile.cr': 'Credits', 'tile.res': 'Research', 'tile.work': 'Workers',
  'tile.depNone': 'deposits: none',
  'tile.dep': p => 'deposits: ' + p.t + ' t' + (p.days != null ? ' · ' + p.days : ''),
  'tile.hunger': 'famine: day {d}/{max}',
  'tile.hungerTomorrow': 'famine starts tomorrow',

  'bar.decide': '⚠ DECISION!',
  'bar.endDay': '▶ END DAY',
  'bar.week': '▶▶ 7 DAYS',
  'bar.weekTitle': 'Fast-forward up to 7 days – stops at important events (key: W)',
  'bar.endTitle': 'Key: Space',
  'bar.devTitle': 'Developer menu',
  'bar.menuTitle': 'Menu',
  'turn.day': 'DAY {d}'
}

// Screens: menu, settings, scenario choice, intro, decision
export default {
  'common.back': 'BACK', 'common.backMenu': 'BACK TO MENU', 'common.close': 'CLOSE',
  'menu.title': 'MENU', 'menu.back': 'BACK TO GAME', 'menu.settings': 'SETTINGS', 'menu.scores': 'SCORES AND BADGES',
  'menu.sound': 'SOUND', 'menu.music': 'MUSIC', 'menu.on': 'ON', 'menu.off': 'OFF',
  'menu.help': 'RULES', 'menu.about': 'ABOUT', 'menu.log': 'CHANGELOG', 'menu.newGame': 'NEW GAME',
  'menu.continue': 'CONTINUE (day {d})',

  'set.access': 'ACCESSIBILITY', 'set.size': 'Text and button size', 'set.size.m': 'NORMAL', 'set.size.l': 'LARGE', 'set.size.xl': 'EXTRA LARGE',
  'set.contrast': 'High contrast (black background, brighter colours)',
  'set.lang': 'LANGUAGE', 'set.sound': 'SOUND',
  'set.music': 'Background music (changes with the situation in the colony)',
  'set.sfx': 'Sound effects',
  'set.tutorial': 'TUTORIAL AND MESSAGES',
  'set.hints': 'Tutorial: hint pop-ups when something happens for the first time',
  'set.short': 'Short report messages – only what happened, no advice on what to do (for advanced players)',
  'set.hintsOff': 'Turned off individually: {n}', 'set.hintsRestore': 'RESTORE ALL',
  'set.stats': 'STATISTICS',
  'set.analytics': 'Anonymous game statistics (Google Analytics) – help the author improve the game',
  'set.analyticsNote': 'Once turned off, the game stops sending events right away; the Google script is gone completely on the next launch.',
  'set.stops': 'FAST-FORWARD STOPS',
  'set.stopsInfo': 'Choose which events stop fast-forwarding with ▶▶ 7 DAYS. Lasting states (famine, blackout, labour shortage…) only stop it on the day they begin. The end of the game always stops it. These settings apply to all games.',
  'set.all': 'ALL', 'set.defaults': 'DEFAULTS', 'set.none': 'NONE',
  'set.auto': 'AUTOMATIC ANSWERS',
  'set.autoInfo': 'Events with a choice always wait for your decision – unless you set an automatic answer here. If the chosen answer cannot be carried out (e.g. not enough credits), the game will ask anyway.',
  'set.askMe': 'ask me',

  'scen.pick': 'CHOOSE A SCENARIO', 'scen.mult': 'score ×{m}', 'scen.goal': 'Goal: {g}', 'scen.noScore': 'no score', 'scen.wip': 'IN PREPARATION', 'scen.start': 'START',
  'intro.diff': 'Difficulty: {d}', 'intro.patron': 'COMMISSIONED BY', 'intro.task': 'YOUR TASK',
  'intro.taskText': '{g} within {n} days.', 'intro.taskFree': 'Build your colony for as long as you like – no goal and no deadline. Just watch out for famine, revolt and bankruptcy.', 'intro.go': "LET'S GO!",
  'choice.look': 'LOOK AT THE COLONY (THE DECISION WILL WAIT)'
}
export const end = {
  'end.scen': 'Scenario: {n} ({d})', 'end.stats1': 'Colonists: {pop} · Morale: {mor}%', 'end.stats2': 'Day: {day} · Technologies: {tech}',
  'end.score': 'SCORE: {n}', 'end.mult': '{base} pts × {m} for difficulty',
  'end.place': p => 'Your score is #' + p.p + ' out of ' + p.n + ' ' + (p.n === 1 ? 'game' : 'games') + '.',
  'end.noScore': 'The Sandbox has no score – what counts is how long the colony lasted.', 'end.badges': 'Badges earned in this game:', 'end.stats': 'STATISTICS', 'end.look': 'VIEW THE COLONY',
  'sc.title': 'SCORES', 'sc.best': 'BEST GAMES', 'sc.none': 'No game has been finished yet.', 'sc.scen': 'scenario', 'sc.score': 'score',
  'sc.win': 'won', 'sc.lose': 'lost',
  'sc.det': 'colonists {pop} · day {day} · morale {mor}% · credits {cr} · technologies {tech}',
  'sc.points': 'points {base} × {m} = {score}', 'sc.badgesOf': 'badges:', 'sc.badges': 'BADGES ({n}/{max})',
  'log.version': 'VERSION {v}', 'log.empty': 'No changes yet.'
}

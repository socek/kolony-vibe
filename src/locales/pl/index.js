// Słownik polski: łączy pliki z tekstami poszczególnych części gry
import ui from './ui.js'
import screens, { end } from './screens.js'
import help from './help.js'
import story from './story.js'
import misc from './misc.js'
import data from './data.js'
import tabs from './tabs.js'
import game from './game.js'
import events from './events.js'
import choices from './choices.js'
import expeditions from './expeditions.js'
import empire from './empire.js'
export default { ...ui, ...screens, ...end, ...help, ...story, ...misc, ...data, ...tabs, ...game, ...events, ...choices, ...expeditions, ...empire }

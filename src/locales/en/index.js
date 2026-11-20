// English dictionary: merges the text files of each part of the game
import ui from './ui.js'
import screens, { end } from './screens.js'
import help from './help.js'
import story from './story.js'
import misc from './misc.js'
export default { ...ui, ...screens, ...end, ...help, ...story, ...misc }

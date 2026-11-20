// Scenarios: names, patrons, stories, goals, victories, scenario events; difficulty levels and seasons
export default {
  'diff.easy': 'EASY', 'diff.normal': 'NORMAL', 'diff.hard': 'HARD',
  'season.winter': 'WINTER', 'season.spring': 'SPRING', 'season.summer': 'SUMMER', 'season.autumn': 'AUTUMN', 'season.eternal': 'ETERNAL WINTER',
  'sc.goal.pop': '{n} colonists', 'sc.goal.popShort': 'GOAL: {n} PEOPLE', 'sc.st.pop': 'colonists {a}/{n}',
  'sc.na': 'Not available in this scenario.', 'sc.noSlotsSplash': 'No building slots left – build a floating platform.', 'sc.noSlotsSill': 'No building slots left – build a station module.',
  'sc.and': ' and ',

  'diff.free': 'FREE PLAY',
  'sc.sandbox.n': "The Emperor's Sandbox",
  'sc.sandbox.patron': 'Keeper of the Imperial Sandbox, Guardian of the Bucket and Curator of the Fish-Shaped Moulds',
  'sc.sandbox.story': [
    'As a child, Emperor Gory spent whole days on this planet building sandcastles. Nobody uses it any more, and His Majesty decided it would be a shame to waste so much good sand.',
    "You can build here as much as you like and for as long as you like – nobody holds you to a goal or a deadline. Famine, revolt and bankruptcy are still real, though. And do not touch the Emperor's favourite spade."
  ],
  'sc.sandbox.goal': 'no goal – build as much as you like', 'sc.sandbox.short': 'FREE PLAY', 'sc.sandbox.status': 'the colony has existed for {n} days',
  'sc.sandbox.win': '', 'sc.sandbox.features': 'No goal and no day limit, no score in the table. You can still lose.',
  'sc.moon.n': 'Moon Jupiter-67',
  'sc.moon.patron': "Special Advisor to the Emperor for Spreading Book Reading among Citizens Reluctant to Read",
  'sc.moon.story': [
    'Billions of guests will fly in for the Jubilee, and the Emperor cannot bear the thought of them having nothing to read while queuing for the toilet.',
    'Moon Jupiter-67 is to become the Great Jubilee Library. Every book of mankind has to be copied out by hand – because “it is more solemn that way” – and that takes a great many colonists.'
  ],
  'sc.moon.win': 'The Jubilee Library is bustling: a thousand scribes copy books day and night. The Special Advisor weeps with emotion over the first volume of “Toaster Operating Instructions” copied out in calligraphy.',
  'sc.moon.features': 'Classic gameplay: no seasons and no fauna.',

  'sc.purr.n': 'Planet Purrburg',
  'sc.purr.patron': "Extraordinary Plenipotentiary of the Emperor for Fluffy Animals, Less Fluffy Animals and Those Whose Fluffiness Is Subject to Scientific Dispute",
  'sc.purr.story': [
    'For his birthday the Emperor has asked for a mini zoo with “something that purrs but is not a cat”. Purrburg is home to purrlings – nobody knows if they are dangerous, because nobody has got close enough yet.',
    'The planet has seasons, and its fauna can pollinate your crops or eat them. Build pens, tame the purrlings and do not get trampled by the herd that is just setting off on its spring migration.'
  ],
  'sc.purr.goal': '600 colonists and 50 tame purrlings', 'sc.purr.short': 'GOAL: 600 PEOPLE, 50 PURRLINGS', 'sc.purr.status': 'colonists {a}/600 · purrlings {b}/50',
  'sc.purr.win': 'Fifty purrlings are travelling to the Jubilee in luxury containers. The Extraordinary Plenipotentiary announces that the scientific dispute over their fluffiness has been settled: they are fluffy. Very.',
  'sc.purr.features': 'Seasons, local fauna, pens and hunters.',
  'sc.purr.f.bugs': '★ Fauna: a swarm of fireflies pollinated the crops – +60 t of food.', 'sc.purr.f.trail': 'by the purrling trail',
  'sc.purr.f.dep': '★ Fauna: purrlings trampled a path to a new deposit – {n}, {a} t.',
  'sc.purr.f.stray': '★ Fauna: a stray purrling walked into a pen all by itself!',
  'sc.purr.f.purr': '★ Fauna: a herd of purrlings purred all night under the dome – the colonists are delighted (+2 morale).',
  'sc.purr.b': 'Fauna: {txt}.', 'sc.purr.b.food': 'a herd raided the stores – {l} t of food lost', 'sc.purr.b.mine': 'purrlings built a nest in a mine – breakdown',
  'sc.purr.b.exp': 'fauna attacked an expedition in the field – {l} members died', 'sc.purr.b.bld': 'a herd trampled a building: {n}',
  'sc.purr.b.empty': 'a herd ran through the empty colony', 'sc.purr.b.fence': 'a herd charged the colony, but the sonic fence scared it off',
  'sc.purr.b.fenceLost': '; a sonic fence was destroyed',

  'sc.ticktock.n': 'Asteroid Tick-Tock',
  'sc.ticktock.patron': 'Chief Court Chronometrist for Punctuality, Excused Lateness and Wall Calendars with Pretty Pictures',
  'sc.ticktock.story': [
    'The Emperor fears that one day will not be enough to receive the wishes of all his guests. He has demanded a technology that stretches the Jubilee day to 48 hours.',
    'Asteroid Tick-Tock is full of time anomalies – the perfect place for a laboratory. Or the worst. The scientists are still arguing, because a different amount of time has passed for each of them.'
  ],
  'sc.ticktock.goal': 'research the Day Stretcher and have 300 colonists', 'sc.ticktock.short': 'GOAL: DAY STRETCHER',
  'sc.ticktock.status': p => 'Day Stretcher: ' + (p.done ? 'researched' : 'no') + ' · colonists ' + p.a + '/300',
  'sc.ticktock.win': 'The Day Stretcher works! The Jubilee day will last 48 hours. The Chief Chronometrist accidentally stretched his holiday too – forever.',
  'sc.ticktock.features': 'A research scenario: time anomalies, few deposits, weak farms.',
  'sc.ticktock.a.repeat': '★ Time anomaly: the day repeated itself – you gain an extra day in office!',
  'sc.ticktock.a.future': '★ Time anomaly: the lab received research results from the future – {n} +{p} pts.',
  'sc.ticktock.a.lost': 'Time anomaly: a whole day was lost in a loop – your term is one day shorter.',
  'sc.ticktock.a.back': 'Time anomaly: the lab went back in time – {n} −{p} pts.',

  'sc.splash.n': 'Planet Splashy',
  'sc.splash.patron': "His Majesty's Grand Master of Recreational and Sporting Ceremonies, Knight of the Order of the Golden Club",
  'sc.splash.story': [
    'The Emperor wants to play golf at the Jubilee – but on water, because “everyone plays on grass”. Splashy has plenty of water and almost nothing else.',
    'There is hardly any land, so every building counts – and only floating platforms will give you new space. There are almost no deposits on land, but the sea gives you kelp. And storms.'
  ],
  'sc.splash.goal': '18 floating golf holes and 400 colonists', 'sc.splash.short': 'GOAL: 18 HOLES', 'sc.splash.status': 'holes {a}/18 · colonists {b}/400',
  'sc.splash.win': 'The Emperor got a hole in one – the ball floated in by itself. The Grand Master of Ceremonies received the Order of the Golden Club with Kelp.',
  'sc.splash.features': 'Little land, kelp farms, storms, floating platforms.',
  'sc.splash.storm': 'STORM! The waves damaged: {n}', 'sc.splash.stormNone': 'STORM! Luckily the waves damaged nothing',
  'sc.splash.golfLost': '; one golf hole drifted off into the blue',

  'sc.sill.n': 'Station Windowsill-3',
  'sc.sill.patron': 'First Deputy Vice-Chancellor for Window Views and the General Picturesqueness of the Horizon',
  'sc.sill.story': [
    'The Emperor wants to watch the jubilee fireworks from a place where all of them can be seen at once. Such a place exists only in orbit – a station with the best windowsill in the galaxy has to be built there.',
    'There is no ground on the station, so there are no mines either – minerals will only come from expeditions to asteroids or from the market. Space is scarce, and every hull breach is real trouble.'
  ],
  'sc.sill.goal': 'the Imperial Viewing Gallery and 500 colonists', 'sc.sill.short': 'GOAL: VIEWING GALLERY',
  'sc.sill.status': p => 'gallery: ' + { done: 'ready', build: 'under construction', no: 'no' }[p.st] + ' · colonists ' + p.a + '/500',
  'sc.sill.win': 'All the fireworks can be seen at once from the Viewing Gallery. The Emperor is delighted – only the First Deputy Vice-Chancellor complains that the windowsill is a tad too narrow for his elbows.',
  'sc.sill.features': 'Orbital station: no mines, hull breaches, little space.',
  'sc.sill.breach': p => 'HULL BREACH! One of the modules lost its air' + (p.n ? ' – ' + p.n + ' colonists died' : ' – the engineers sealed it in time') + '.',

  'sc.ice.n': 'Globe Icecube',
  'sc.ice.patron': 'Secretary of State for Chilled Drinks, Ceremonial Ice and Commemorative Straws',
  'sc.ice.story': [
    'At the Jubilee the Emperor will raise a toast, and his drink must be chilled with ice “from the purest frozen world in the galaxy”.',
    'The trouble is that Icecube is so cold that the ice first has to be thawed, purified and frozen again. The eternal winter devours energy for heating and the sun barely shines – but rich deposits lie beneath the ice.'
  ],
  'sc.ice.goal': 'ship 2000 t of Ceremonial Ice', 'sc.ice.short': 'GOAL: 2000 T OF ICE', 'sc.ice.status': 'Ceremonial Ice {a}/2000 t',
  'sc.ice.win': 'The Emperor raised a toast, and the ice chimed against the crystal like little bells. The Secretary of State for Chilled Drinks was promoted to Secretary of State for All Drinks.',
  'sc.ice.features': 'Eternal winter, costly heating, weak sun, rich deposits.'
}

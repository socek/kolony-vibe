import { enForm } from '../../i18n.js'

// Tabs: report (forecast)
export default {
  'rp.title': p => !p.d ? 'REPORT' : p.d === 1 ? 'REPORT FOR THE LAST DAY' : 'REPORT FOR THE LAST ' + p.d + ' DAYS',
  'rp.forecast': 'FORECAST FOR THE NEXT DAY', 'rp.eff': 'Efficiency', 'rp.build': 'Construction', 'rp.stalled': 'stalled',
  'rp.eta': '{d} to go', 'rp.sites': 'construction sites: {n}',
  'rp.famine': 'FAMINE', 'rp.famineDeaths': p => 'day ' + p.d + '/' + p.max + ' – about ' + p.n + ' ' + enForm(p.n, 'person', 'people') + ' will die',
  'rp.famineEnds': 'ends tomorrow', 'rp.famineHeld': 'held off by starvation rations (day {d}/{max})',
  'rp.prodUse': '{p} prod. / {u} used', 'rp.season': 'Season: {n}', 'rp.sun': 'sun ×{x}', 'rp.crops': 'crops ×{x}', 'rp.heat': 'heating {n} kWh',
  'rp.battery': 'Energy storage', 'rp.noBat': 'no batteries', 'rp.charged': 'charged',
  'rp.deps': p => p.t + ' t in deposits' + (p.d ? ', for ' + p.d : ''), 'rp.noDeps': 'no deposits',
  'rp.exp': '{n} in the field', 'rp.expBack': 'next return in {d}',
  'rp.fridges': 'Cold stores', 'rp.stores': 'Mineral warehouses', 'rp.lossFood': '{n} t of food lost', 'rp.lossMin': '{n} t of minerals lost',
  'rp.money': p => 'taxes ' + p.tax + (p.trade != null ? ', trade ' + p.trade : '') + ', upkeep −' + p.maint,
  'rp.noProject': 'no project', 'rp.defence': 'Defence',
  'rp.defOn': 'losses from pirates and meteorites −{n}%', 'rp.defOff': 'guns unstaffed – not working', 'rp.guns': 'working guns: {n}/{max}',
  'rp.cond': 'Building condition', 'rp.avg': 'average {n}%', 'rp.broken': 'breakdowns: {n}', 'rp.repairs': 'repairs {n} pts/day',
  'rp.morale': '{a}% → {b}%; under current conditions it will settle at {c}%',
  // build
  'bt.info': 'Paid-for buildings go to a construction site (list at the bottom). The more builders, the faster they rise – set their number with the priority in the WORKERS tab. Free builders go to the first site in the queue first. Upkeep: {m} cr/day per building.',
  'bt.slots': 'Building slots', 'bt.inBuild': '+{n} under construction', 'bt.demolish': 'Demolish', 'bt.build': 'BUILD',
  'bt.cost': 'cost {cr} cr, {mi} t min.', 'bt.workers': '{n} workers', 'bt.workersPer': '1 worker per {n} buildings', 'bt.energy': '{n} kWh/day',
  'bt.time': 'build time {d} with {n} builders', 'bt.max': 'max. {n}', 'bt.cond': 'condition: {n}%', 'bt.eff': 'efficiency {n}%',
  'bt.needTech': 'Requires technology: {n} (TECHNOLOGIES tab)', 'bt.credits': 'credits {a}/{b}', 'bt.minerals': 'minerals {a}/{b} t',
  'bt.sites': 'CONSTRUCTION SITES', 'bt.builders': 'builders: {a}/{b}', 'bt.first': 'FIRST', 'bt.cancel': 'CANCEL', 'bt.cancelTitle': 'Refunds half the cost',
  // workers
  'wt.able': 'Able to work ({n}% of colonists)', 'wt.pp': '{v} pts',
  'wt.range': 'The share always stays between {a}% and {b}%. High morale, hospitals and the Automated Nurseries technology raise it; low morale and epidemics lower it.',
  'wt.employed': 'Employed', 'wt.unemployed': 'Unemployed', 'wt.missing': 'Labour shortage',
  'wt.info': 'Workers go to high-priority jobs first. With equal priority they are split evenly. STOP switches a building off or pauses construction: nothing is produced, no energy is used, and its people are left without work.',
  'wt.spec': 'SPECIALISTS',
  'wt.specInfo': 'A specialist at their post works 50% more efficiently. Labs and hospitals are staffed by scientists only. Schools automatically train the type most below its target, and once all targets are met they take no one away from work. AUTO: target equal to the number of posts in buildings.',
  'wt.target': 'target {n}', 'wt.manual': 'manual', 'wt.posts': 'posts: {n}', 'wt.lack': '{n} short',
  'wt.lower': 'Lower the target', 'wt.raise': 'Raise the target', 'wt.dismiss': 'DISMISS 1', 'wt.dismissTitle': 'Dismiss one specialist (the {one} goes back to ordinary work)',
  'wt.schools': p => 'Schools: ' + (p.rate ? '1 person every ' + p.rate + ' days' : 'no staffed school') + (p.now ? ', now training: ' + p.now : p.done ? ' – targets met, training paused' : '') + '.',
  'wt.warn': p => '⚠ Specialists short: ' + p.n + (p.sci > 0 ? ' (including ' + p.sci + ' scientists – without them labs and hospitals do not work fully)' : '') + '. ' + (p.days ? 'At the current pace schools will catch up in about ' + p.days + ' days – build another school or raise its priority.' : 'Build a school (or staff an existing one) to train specialists.'),
  'wt.toTarget': p => p.n + ' specialists short of the target' + (p.days ? ' – schools will catch up in about ' + p.days + ' days.' : ' – a school will let you train them.'),
  'wt.infra': 'Infrastructure', 'wt.infraInfo': 'Housing, cold stores, warehouses, batteries and shields are always staffed first.',
  'wt.repairs': 'repairs: {n} pts/day', 'wt.hunt': '+{n} t of food, but the fauna gets more aggressive',
  'wt.staff': '{a}/{b} workers', 'wt.paused': 'PAUSED', 'wt.stopped': 'STOPPED'
}

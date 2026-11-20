// Events with a choice: title (t), description (d), options <no>.n (name), .d (known effects), .r/.r2/.r3 (outcome)
export default {
  'ch.lackCr': 'Not enough credits.', 'ch.lackMin': 'Not enough minerals.', 'ch.noResearch': 'Nothing is being researched.', 'ch.fewPop': 'Too few colonists.',
  'ch.fx': p => (p.cr ? '−' + Math.abs(p.cr) + ' cr, ' : '') + (p.mor > 0 ? '+' : '−') + Math.abs(p.mor) + ' morale',
  'ch.noEffect': 'No effect',

  'ch.ransom.t': 'Pirates demand a ransom',
  'ch.ransom.d': 'A pirate ship is hovering over the colony. The captain demands {n} cr for “protection”. Refusing means an attack.',
  'ch.ransom.0.n': 'Pay the ransom', 'ch.ransom.0.d': '−{n} cr', 'ch.ransom.0.r': 'A ransom of {n} cr was paid. The pirates flew off.',
  'ch.ransom.1.n': 'Fight', 'ch.ransom.1.d': 'Guns reduce the losses – without them the pirates will take more than the ransom.',
  'ch.ransom.1.r': 'The guns repelled part of the attack – the pirates looted {n} cr.', 'ch.ransom.1.r2': 'With no defences the pirates plundered the colony – they looted {n} cr.',

  'ch.sick.t': 'Refugees with a fever',
  'ch.sick.d': 'A group of refugees has flown into the colony. Some of them have a high fever.',
  'ch.sick.0.n': 'Take them in', 'ch.sick.0.d': 'New colonists (if there is room), but the disease may spread.',
  'ch.sick.0.r': '{n} refugees were taken in. The fever soon passed.', 'ch.sick.0.r2': '{n} refugees were taken in, but the disease spread – {d} people died.',
  'ch.sick.1.n': 'Send them away', 'ch.sick.1.r': 'The refugees were sent away. The colonists feel bad about it.',

  'ch.trader.t': 'Wandering trader',
  'ch.trader.d': 'A trader from the asteroid belt offers 150 t of minerals for 300 cr – cheaper than the market.',
  'ch.trader.0.n': 'Buy', 'ch.trader.0.d': '−300 cr, +150 t of minerals', 'ch.trader.0.r': '150 t of minerals were bought from the wandering trader.',
  'ch.trader.1.n': 'Decline', 'ch.trader.1.r': 'The trader flew off to look for other customers.',

  'ch.strike.t': "Miners' strike",
  'ch.strike.d': 'The miners have put down their picks and demand a bonus for working in the dust.',
  'ch.strike.0.n': 'Pay a bonus', 'ch.strike.0.r': 'The miners got their bonus and went back to work in good spirits.',
  'ch.strike.1.n': 'Refuse', 'ch.strike.1.r': 'The miners went back to work, but discontent is growing.',

  'ch.beacon.t': 'Signal from a wreck',
  'ch.beacon.d': 'The radar has picked up a distress signal from a crashed ship near the colony.',
  'ch.beacon.0.n': 'Investigate the wreck', 'ch.beacon.0.d': 'It may pay off, but wrecks can be dangerous.',
  'ch.beacon.0.r': 'The team came back from the wreck with 200 t of minerals and equipment worth 100 cr.', 'ch.beacon.0.r2': 'The wreck exploded during the search – {d} colonists died.',
  'ch.beacon.1.n': 'Ignore it', 'ch.beacon.1.r': 'The signal from the wreck went silent after a few days.',

  'ch.swarm.t': 'Meteor swarm warning',
  'ch.swarm.d': "Astronomers have spotted a meteor swarm that will cross the colony's orbit tomorrow.",
  'ch.swarm.0.n': 'Evacuate people to the shelters', 'ch.swarm.0.d': '−5 morale, no damage to buildings', 'ch.swarm.0.r': 'The colonists spent the night in the shelters. The swarm passed the colony by.',
  'ch.swarm.1.n': 'Reinforce the buildings', 'ch.swarm.1.d': '−150 t of minerals', 'ch.swarm.1.r': 'The reinforced buildings withstood the impacts.',
  'ch.swarm.2.n': 'Take the risk', 'ch.swarm.2.d': 'Maybe nothing will happen… or maybe something will be destroyed.',
  'ch.swarm.2.r': 'The meteor swarm flew past. Lucky!', 'ch.swarm.2.r2': 'The meteors fell on an empty field.', 'ch.swarm.2.r3': 'The meteors destroyed a building: {n}.',

  'ch.festival.t': 'The colonists want a holiday',
  'ch.festival.d': "The colonists' council asks for a Pioneer Day to be organised.",
  'ch.festival.0.n': 'Lavishly', 'ch.festival.0.r': 'This lavish Pioneer Day will go down in colony history.',
  'ch.festival.1.n': 'Modestly', 'ch.festival.1.r': 'A modest but pleasant holiday lifted the mood.',
  'ch.festival.2.n': 'Refuse', 'ch.festival.2.r': 'There will be no holiday. The colonists are disappointed.',

  'ch.journalist.t': 'A journalist from the Human Union of Unity',
  'ch.journalist.d': 'A reporter from imperial television wants to shoot a story about the colony.',
  'ch.journalist.0.n': 'Show them around', 'ch.journalist.0.d': '−50 cr; a good story may attract settlers',
  'ch.journalist.0.r': 'The story was great – {n} new colonists arrived.', 'ch.journalist.0.r2': 'The story aired at three in the morning. Nobody saw it.',
  'ch.journalist.1.n': 'Bribe them to write only good things', 'ch.journalist.1.r': "An enthusiastic article lifted the colonists' morale.",
  'ch.journalist.2.n': 'Throw them out', 'ch.journalist.2.r': 'The journalist left in a huff. There is talk of censorship in the colony.',

  'ch.plague.t': 'Epidemic outbreak',
  'ch.plague.d': 'A dangerous disease is spreading in the colony. The doctors are waiting for a decision.',
  'ch.plague.0.n': 'Quarantine', 'ch.plague.0.d': 'Small loss of life, −6 morale', 'ch.plague.0.r': 'The quarantine stopped the disease. {d} people died.',
  'ch.plague.1.n': 'Treatment for credits', 'ch.plague.1.d': '−300 cr, minimal losses', 'ch.plague.1.r': 'Expensive medicine saved most of the sick. {d} people died.',
  'ch.plague.2.n': 'Experimental vaccine', 'ch.plague.2.d': 'It may work perfectly… or not at all.',
  'ch.plague.2.r': 'The vaccine worked! Nobody died.', 'ch.plague.2.r2': 'The vaccine did not work. {d} people died.',
  'ch.plague.3.n': 'Do nothing', 'ch.plague.3.d': 'Heavy loss of life', 'ch.plague.3.r': 'The epidemic swept through the colony. {d} people died.',

  'ch.smugglers.t': 'Smugglers',
  'ch.smugglers.d': 'A suspicious freighter offers goods “with no questions asked”.',
  'ch.smugglers.0.n': 'Buy a gun', 'ch.smugglers.0.d': '−250 cr, +1 magnetic gun', 'ch.smugglers.0.r': 'The smugglers left a ready-to-use magnetic gun.',
  'ch.smugglers.1.n': 'Buy seeds', 'ch.smugglers.1.d': '−150 cr, +120 t of food', 'ch.smugglers.1.r': 'The smuggled seeds gave a quick harvest: +120 t of food.',
  'ch.smugglers.2.n': 'Buy research data', 'ch.smugglers.2.d': '−200 cr, +30 pts for the current research', 'ch.smugglers.2.r': 'The stolen data sped up research: {n} +30 pts.',
  'ch.smugglers.3.n': 'Chase them off', 'ch.smugglers.3.r': 'The smugglers flew off, cursing under their breath.',

  'ch.gift.t': 'A letter from the Emperor',
  'ch.gift.d': "Emperor Gory's chancellery reminds you that every colony sends a gift for the Jubilee. Deadline: yesterday.",
  'ch.gift.0.n': 'A hand-copied book', 'ch.gift.0.r': 'The scribes copied out “The Union Highway Code”. The Emperor was reportedly moved.',
  'ch.gift.1.n': 'A crate of minerals', 'ch.gift.1.d': '−200 t of minerals, 400 cr reward', 'ch.gift.1.r': 'The Emperor appreciated the crate of minerals and sent back a 400 cr reward.',
  'ch.gift.2.n': 'A delegation of colonists', 'ch.gift.2.d': '−10 colonists, 600 cr reward', 'ch.gift.2.r': 'The delegation will stay at court forever. The chancellery sent 600 cr “to dry your tears”.',
  'ch.gift.3.n': 'A poem written by the children', 'ch.gift.3.d': "Free – but the Emperor's taste is unpredictable.",
  'ch.gift.3.r': 'The Emperor recited the poem at a ball! The colonists are bursting with pride.', 'ch.gift.3.r2': 'The Emperor found the poem “too avant-garde”. A disgrace across the galaxy.',
  'ch.gift.4.n': 'Send nothing', 'ch.gift.4.r': 'The colony sent no gift. Rumours about it are spreading across the Union.'
}

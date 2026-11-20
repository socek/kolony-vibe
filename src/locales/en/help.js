// Game rules (RULES screen)
export default {
  'help.keys': 'KEYBOARD SHORTCUTS', 'help.keyList': ['Space – end the day (or the decision to make)', 'W – fast-forward 7 days', '1–9 – tabs', 'Esc – game menu or close the open window'],
  'help.intro': 'You are the governor of a colony on a distant planet. Each turn is one day. The game offers several scenarios – each with its own goal, story and difficulty (a harder scenario multiplies your score). In the current scenario ({scen}) you have {days} days to reach the goal: {goal}.',
  'help.introFree': 'You are the governor of a colony on a distant planet. Each turn is one day. In the current scenario ({scen}) there is no goal and no day limit – you build as much as you like, but famine, revolt and bankruptcy still end the game.',
  'help.rules': p => [
    'Usually 60% of colonists can work (the rest are children, the elderly and their carers). High morale adds up to 10 points, low morale takes away as much; hospitals and the Automated Nurseries technology add 5 points each, and after an epidemic the sick cannot work for a few days. The share always stays between 40% and 80%. Housing, cold stores, warehouses, batteries and shields are staffed first, then the remaining jobs (buildings and builders) by the priorities in the WORKERS tab. A stopped building neither produces nor uses energy, and its workers are unemployed.',
    'Construction takes time. Each building needs a certain amount of work – the bigger it is, the more. More builders finish faster but take people away from production. A cancelled construction refunds half the cost.',
    'Mines extract minerals from deposits that run out. Expeditions find new deposits (EXPEDITIONS tab) – members leave the colony for the duration.',
    'An expedition searches for the chosen target (deposits, ruins, wrecks, settlers) – it will most likely find exactly that, occasionally something else. Soldiers in the team lower the risk, engineers increase the gain.',
    'Specialists (scientists, engineers, soldiers) work 50% more efficiently at their posts. Schools train them – always the type most below its target. The target is set automatically (AUTO: as many as there are posts in buildings) or by hand in the WORKERS tab; you can also dismiss a surplus specialist there.',
    'Buildings wear out: they lose efficiency, break down more and more often, and collapse when worn down to zero. Maintenance crews repair them (WORKERS tab).',
    'Buildings use energy. When there is not enough, production drops and people get angry.',
    'Energy cannot be bought or sold. You can only store the surplus in batteries (' + p.bat + ' kWh each); the rest is lost.',
    'Food is kept in cold stores and minerals in mineral warehouses – each resource has ' + p.base + ' t of base space + ' + p.cap + ' t per building. Any excess is lost.',
    'The population only grows when people have somewhere to live and something to eat.',
    'Famine: each day without food kills more and more people, and on the 12th day of famine everyone dies. A day of full food on at least normal rations ends the famine. Starvation rations only stop the dying.',
    'Magnetic guns (after researching the technology) reduce losses from pirates and meteorites – only when staffed and powered. They can be destroyed during an attack.',
    'Some events require a decision – time stands still until you make it. You can set automatic answers in the settings.',
    'The Human Union of Unity gives the colony tasks (EMPIRE tab): deliveries, sending people or researching a technology. An accepted task has a deadline and a penalty, while a completed one brings a reward and reputation.',
    'Advertising campaigns (POLICY tab) can attract new colonists. You only know their cost and duration – you have to find out how well they work yourself.',
    'High taxes and starvation rations lower morale. At 5% morale the colonists revolt.',
    'Labs advance research every day. In the TECHNOLOGIES tab you add technologies to a queue – scientists research them one by one. Technologies form a tree: some require others first. They unlock new buildings, bonuses and new options (expedition targets, campaigns, trade).',
    'A debt of more than 500 cr means bankruptcy.',
    'The ▶▶ 7 DAYS button fast-forwards a week and stops at important events – choose which ones in the menu (≡) → SETTINGS.',
    'Sell surplus food and minerals on the market (EMPIRE tab); prices change every day.'
  ]
}

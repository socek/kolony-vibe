import { enForm } from '../../plural.js'

// Random events
export default {
  'ev.gunLoss': p => p.n + ' ' + enForm(p.n, 'gun was', 'guns were') + ' destroyed.',
  'ev.meteorShield': 'Meteor shower! An orbital shield intercepted the impact and was destroyed. Shields left: {n}.',
  'ev.meteorGuns': 'Meteor shower! The guns shot down the fragments – nothing was destroyed.',
  'ev.meteor': 'METEOR SHOWER! Building destroyed: {n}.', 'ev.meteorGunsFail': 'The guns failed to shoot down the fragments.',
  'ev.epidemic': 'EPIDEMIC! {n} colonists died, and many are sick and cannot work.',
  'ev.supply': 'A supply ship from Earth: +100 t of food, +60 t of minerals.',
  'ev.flare': 'Solar flare! {n} kWh of energy lost.',
  'ev.nearby': 'right next to the colony', 'ev.deposit': 'Geologists stumbled upon a new deposit: {n} – {a} t.',
  'ev.piratesGuns': 'PIRATE ATTACK! The guns repelled part of the attack – {l} credits were looted instead of {base}.',
  'ev.pirates': 'PIRATE ATTACK! {l} credits were looted.', 'ev.gunsIdle': 'The guns were not staffed!',
  'ev.holiday': 'Colony Founding Day – morale rises.',
  'ev.comet': 'An ice comet was captured: +120 t of food.',
  'ev.refugees': 'Refugees from a fallen station have arrived: +{n} colonists.', 'ev.refugeesLeft': 'There was no room for {n} of them – they flew on.',
  'ev.power': 'Power failure: −60 kWh of energy.',
  'ev.name.0': 'Meteor shower', 'ev.name.1': 'Epidemic', 'ev.name.2': 'Supply ship', 'ev.name.3': 'Solar flare', 'ev.name.4': 'New deposit',
  'ev.name.5': 'Pirate attack', 'ev.name.6': 'Founding Day', 'ev.name.7': 'Ice comet', 'ev.name.8': 'Refugees', 'ev.name.9': 'Power failure'
}

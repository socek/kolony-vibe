import { plForm } from '../../plural.js'

// Zdarzenia losowe
export default {
  'ev.gunLoss': p => p.n === 1 ? 'Zniszczone zostało 1 działo.' : 'Zniszczone zostały ' + p.n + ' ' + plForm(p.n, 'działo', 'działa', 'dział') + '.',
  'ev.meteorShield': 'Deszcz meteorytów! Osłona orbitalna przechwyciła uderzenie i uległa zniszczeniu. Pozostało osłon: {n}.',
  'ev.meteorGuns': 'Deszcz meteorytów! Działa zestrzeliły odłamki – nic nie zostało zniszczone.',
  'ev.meteor': 'DESZCZ METEORYTÓW! Zniszczony budynek: {n}.', 'ev.meteorGunsFail': 'Działa nie zdołały zestrzelić odłamków.',
  'ev.epidemic': 'EPIDEMIA! Zmarło {n} kolonistów, wielu choruje i nie może pracować.',
  'ev.supply': 'Statek zaopatrzeniowy z Ziemi: +100 t żywności, +60 t minerałów.',
  'ev.flare': 'Rozbłysk słoneczny! Utracono {n} kWh energii.',
  'ev.nearby': 'tuż obok kolonii', 'ev.deposit': 'Geolodzy przypadkiem odkryli nowe złoże: {n} – {a} t.',
  'ev.piratesGuns': 'ATAK PIRATÓW! Działa odparły część ataku – zrabowano {l} kredytów zamiast {base}.',
  'ev.pirates': 'ATAK PIRATÓW! Zrabowano {l} kredytów.', 'ev.gunsIdle': 'Działa nie były obsadzone!',
  'ev.holiday': 'Święto Założenia Kolonii – morale rośnie.',
  'ev.comet': 'Przechwycono lodową kometę: +120 t żywności.',
  'ev.refugees': 'Przybyli uchodźcy z upadłej stacji: +{n} kolonistów.', 'ev.refugeesLeft': 'Dla {n} zabrakło miejsca – polecieli dalej.',
  'ev.power': 'Awaria zasilania: −60 kWh energii.',
  'ev.name.0': 'Deszcz meteorytów', 'ev.name.1': 'Epidemia', 'ev.name.2': 'Statek zaopatrzeniowy', 'ev.name.3': 'Rozbłysk słoneczny', 'ev.name.4': 'Nowe złoże',
  'ev.name.5': 'Atak piratów', 'ev.name.6': 'Święto Założenia', 'ev.name.7': 'Lodowa kometa', 'ev.name.8': 'Uchodźcy', 'ev.name.9': 'Awaria zasilania'
}

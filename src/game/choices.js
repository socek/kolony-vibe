import { BLD, TECH } from './constants.js'
import { calc } from './calc.js'

// Zdarzenia z wyborem. Każda opcja: n – nazwa, d – podpowiedź (znane skutki),
// need(s) – powód, dla którego opcja jest niedostępna (albo ''), run(s) – skutek, zwraca opis.
// Ostatnia opcja każdego zdarzenia jest zawsze dostępna, więc decyzję zawsze da się podjąć.
const R = Math.round
const rnd = () => Math.random()
const lack = (s, cr, min) => s.cr < cr ? 'Brakuje kredytów.' : (min && s.min < min ? 'Brakuje minerałów.' : '')
const randomBuilding = s => { const ks = Object.keys(BLD).filter(k => s.b[k] > 0); return ks.length ? ks[Math.floor(rnd() * ks.length)] : null }

export const CHOICES = {
  // ---------- 2 opcje ----------
  ransom: {
    t: 'Piraci żądają okupu',
    d: s => 'Statek piracki zawisł nad kolonią. Kapitan żąda ' + ransomOf(s) + ' kr za „ochronę”. Odmowa oznacza atak.',
    opts: [
      { n: 'Zapłać okup', d: s => '−' + ransomOf(s) + ' kr', need: s => lack(s, ransomOf(s)), run: s => { s.cr -= ransomOf(s); return 'Zapłacono ' + ransomOf(s) + ' kr okupu. Piraci odlecieli.' } },
      {
        n: 'Walcz', d: () => 'Działa zmniejszają straty – bez nich piraci zabiorą więcej niż okup.',
        run: s => {
          const red = calc(s).defRed, loot = R(Math.max(80, s.cr * 0.25) * (1 - red))
          s.cr -= Math.min(Math.max(s.cr, 0), loot); s.mor -= 4 * (1 - red)
          return red > 0 ? 'Działa odparły część ataku – piraci zrabowali ' + loot + ' kr.' : 'Bez obrony piraci splądrowali kolonię – zrabowali ' + loot + ' kr.'
        }
      }
    ]
  },
  sick: {
    t: 'Uchodźcy z gorączką',
    d: () => 'Do kolonii przyleciała grupa uchodźców. Część z nich ma wysoką gorączkę.',
    opts: [
      {
        n: 'Przyjmij', d: () => 'Nowi koloniści (jeśli jest miejsce), ale choroba może się rozprzestrzenić.',
        run: s => {
          const n = R(Math.min(15, Math.max(0, calc(s).cap - s.pop))); s.pop += n
          if (rnd() < 0.5) { const d = R(s.pop * (s.tech.med ? 0.02 : 0.05)); s.pop -= d; return 'Przyjęto ' + n + ' uchodźców, ale choroba się rozprzestrzeniła – zmarło ' + d + ' osób.' }
          return 'Przyjęto ' + n + ' uchodźców. Gorączka szybko minęła.'
        }
      },
      { n: 'Odeślij', d: () => '−3 morale', run: s => { s.mor -= 3; return 'Uchodźców odesłano. Koloniści czują się z tym źle.' } }
    ]
  },
  trader: {
    t: 'Wędrowny kupiec',
    d: () => 'Kupiec z pasa asteroid oferuje 150 t minerałów za 300 kr – taniej niż na rynku.',
    opts: [
      { n: 'Kup', d: () => '−300 kr, +150 t minerałów', need: s => lack(s, 300), run: s => { s.cr -= 300; s.min += 150; return 'Kupiono 150 t minerałów od wędrownego kupca.' } },
      { n: 'Odmów', d: () => 'Bez skutków', run: () => 'Kupiec odleciał szukać innych klientów.' }
    ]
  },
  strike: {
    t: 'Strajk górników',
    d: () => 'Górnicy odłożyli kilofy i żądają premii za pracę w pyle.',
    opts: [
      { n: 'Wypłać premię', d: () => '−150 kr, +3 morale', need: s => lack(s, 150), run: s => { s.cr -= 150; s.mor += 3; return 'Górnicy dostali premię i wrócili do pracy w dobrych humorach.' } },
      { n: 'Odmów', d: () => '−6 morale', run: s => { s.mor -= 6; return 'Górnicy wrócili do pracy, ale niezadowolenie rośnie.' } }
    ]
  },
  beacon: {
    t: 'Sygnał z wraku',
    d: () => 'Radar wykrył sygnał alarmowy z rozbitego statku niedaleko kolonii.',
    opts: [
      {
        n: 'Zbadaj wrak', d: () => 'Może się opłacić, ale wrak bywa niebezpieczny.',
        run: s => {
          if (rnd() < 0.6) { s.min += 200; s.cr += 100; return 'Ekipa wróciła z wraku z 200 t minerałów i sprzętem wartym 100 kr.' }
          const d = Math.min(3, R(s.pop)); s.pop -= d; return 'Wrak eksplodował podczas badania – zginęło ' + d + ' kolonistów.'
        }
      },
      { n: 'Zignoruj', d: () => 'Bez skutków', run: () => 'Sygnał z wraku po kilku dniach ucichł.' }
    ]
  },
  // ---------- 3 opcje ----------
  swarm: {
    t: 'Ostrzeżenie przed rojem meteorów',
    d: () => 'Astronomowie wykryli rój meteorów, który jutro przetnie orbitę kolonii.',
    opts: [
      { n: 'Ewakuuj ludzi do schronów', d: () => '−5 morale, budynki bez strat', run: s => { s.mor -= 5; return 'Koloniści przesiedzieli noc w schronach. Rój minął kolonię bokiem.' } },
      { n: 'Wzmocnij budynki', d: () => '−150 t minerałów', need: s => lack(s, 0, 150), run: s => { s.min -= 150; return 'Wzmocnione budynki wytrzymały uderzenia odłamków.' } },
      {
        n: 'Zaryzykuj', d: () => 'Może nic się nie stanie… a może coś zostanie zniszczone.',
        run: s => {
          if (rnd() < 0.5) return 'Rój meteorów przeleciał bokiem. Udało się!'
          const k = randomBuilding(s); if (!k) return 'Meteory spadły na puste pole.'
          s.b[k]--; return 'Meteory zniszczyły budynek: ' + BLD[k].n + '.'
        }
      }
    ]
  },
  festival: {
    t: 'Koloniści chcą święta',
    d: () => 'Rada kolonistów prosi o zorganizowanie Dnia Pioniera.',
    opts: [
      { n: 'Hucznie', d: () => '−200 kr, +12 morale', need: s => lack(s, 200), run: s => { s.cr -= 200; s.mor += 12; return 'Huczny Dzień Pioniera przejdzie do historii kolonii.' } },
      { n: 'Skromnie', d: () => '−60 kr, +5 morale', need: s => lack(s, 60), run: s => { s.cr -= 60; s.mor += 5; return 'Skromne, ale miłe święto poprawiło nastroje.' } },
      { n: 'Odmów', d: () => '−4 morale', run: s => { s.mor -= 4; return 'Święta nie będzie. Koloniści są zawiedzeni.' } }
    ]
  },
  journalist: {
    t: 'Dziennikarz z Ludzkiej Unii Jedności',
    d: () => 'Reporter imperialnej telewizji chce nakręcić materiał o kolonii.',
    opts: [
      {
        n: 'Oprowadź po kolonii', d: () => '−50 kr; dobry materiał może przyciągnąć osadników',
        need: s => lack(s, 50),
        run: s => {
          s.cr -= 50
          if (rnd() < 0.5) { const n = R(Math.min(15, Math.max(0, calc(s).cap - s.pop))); s.pop += n; return 'Reportaż był świetny – przybyło ' + n + ' nowych kolonistów.' }
          return 'Reportaż wyemitowano o trzeciej w nocy. Nikt go nie widział.'
        }
      },
      { n: 'Przekup, żeby pisał same dobre rzeczy', d: () => '−150 kr, +6 morale', need: s => lack(s, 150), run: s => { s.cr -= 150; s.mor += 6; return 'Entuzjastyczny artykuł podniósł kolonistom morale.' } },
      { n: 'Wyrzuć go', d: () => '−3 morale', run: s => { s.mor -= 3; return 'Dziennikarz odleciał obrażony. W kolonii mówi się o cenzurze.' } }
    ]
  },
  // ---------- 4 opcje ----------
  plague: {
    t: 'Wybuch epidemii',
    d: () => 'W kolonii szerzy się groźna choroba. Lekarze czekają na decyzję.',
    opts: [
      { n: 'Kwarantanna', d: () => 'Niewielkie straty w ludziach, −6 morale', run: s => { const d = R(s.pop * 0.02); s.pop -= d; s.mor -= 6; return 'Kwarantanna zatrzymała chorobę. Zmarło ' + d + ' osób.' } },
      { n: 'Leczenie za kredyty', d: () => '−300 kr, minimalne straty', need: s => lack(s, 300), run: s => { s.cr -= 300; const d = R(s.pop * 0.01); s.pop -= d; return 'Drogie leki uratowały większość chorych. Zmarło ' + d + ' osób.' } },
      {
        n: 'Szczepionka eksperymentalna', d: () => 'Może zadziałać idealnie… albo wcale.',
        run: s => { if (rnd() < 0.5) return 'Szczepionka zadziałała! Nikt nie zmarł.'; const d = R(s.pop * 0.08); s.pop -= d; return 'Szczepionka nie zadziałała. Zmarło ' + d + ' osób.' }
      },
      { n: 'Nic nie rób', d: () => 'Duże straty w ludziach', run: s => { const d = R(s.pop * (s.tech.med ? 0.03 : 0.08)); s.pop -= d; s.mor -= 5; return 'Epidemia przeszła przez kolonię. Zmarło ' + d + ' osób.' } }
    ]
  },
  smugglers: {
    t: 'Przemytnicy',
    d: () => 'Podejrzany frachtowiec proponuje towary „bez zbędnych pytań”.',
    opts: [
      { n: 'Kup działo', d: () => '−250 kr, +1 działo magnetyczne', need: s => lack(s, 250), run: s => { s.cr -= 250; s.b.gun = (s.b.gun || 0) + 1; return 'Przemytnicy zostawili gotowe działo magnetyczne.' } },
      { n: 'Kup nasiona', d: () => '−150 kr, +120 t żywności', need: s => lack(s, 150), run: s => { s.cr -= 150; s.food += 120; return 'Przemycone nasiona dały szybki plon: +120 t żywności.' } },
      {
        n: 'Kup dane naukowe', d: () => '−200 kr, +30 pkt do bieżących badań', need: s => s.rs ? lack(s, 200) : 'Nic nie jest badane.',
        run: s => { s.cr -= 200; s.rp[s.rs] = (s.rp[s.rs] || 0) + 30; return 'Wykradzione dane przyspieszyły badania: ' + TECH[s.rs].n + ' +30 pkt.' }
      },
      { n: 'Przegoń ich', d: () => 'Bez skutków', run: () => 'Przemytnicy odlecieli, przeklinając pod nosem.' }
    ]
  },
  // ---------- 5 opcji ----------
  gift: {
    t: 'List od Imperatora',
    d: () => 'Kancelaria Imperatora przypomina, że każda kolonia przysyła prezent na Jubileusz. Termin: wczoraj.',
    opts: [
      { n: 'Ręcznie przepisana książka', d: () => '−50 kr, +3 morale', need: s => lack(s, 50), run: s => { s.cr -= 50; s.mor += 3; return 'Kopiści przepisali „Kodeks drogowy Unii”. Imperator podobno się wzruszył.' } },
      { n: 'Skrzynia minerałów', d: () => '−200 t minerałów, nagroda 400 kr', need: s => lack(s, 0, 200), run: s => { s.min -= 200; s.cr += 400; return 'Imperator docenił skrzynię minerałów i odesłał 400 kr nagrody.' } },
      { n: 'Delegacja kolonistów', d: () => '−10 kolonistów, nagroda 600 kr', need: s => s.pop < 40 ? 'Za mało kolonistów.' : '', run: s => { s.pop -= 10; s.cr += 600; return 'Delegacja zostanie na dworze na zawsze. Kancelaria przysłała 600 kr „na otarcie łez”.' } },
      {
        n: 'Wiersz napisany przez dzieci', d: () => 'Za darmo – ale gust Imperatora jest nieprzewidywalny.',
        run: s => { if (rnd() < 0.5) { s.mor += 10; return 'Imperator recytował wiersz na balu! Koloniści pękają z dumy.' } s.mor -= 5; return 'Imperator uznał wiersz za „zbyt awangardowy”. Wstyd na całą galaktykę.' }
      },
      { n: 'Nic nie wysyłaj', d: () => '−8 morale', run: s => { s.mor -= 8; return 'Kolonia nie wysłała prezentu. Plotki o tym krążą po całej Unii.' } }
    ]
  }
}

export const ransomOf = s => Math.max(100, R(Math.max(s.cr, 0) * 0.2))
export const CHOICE_KEYS = Object.keys(CHOICES)

// Wywołuje wybraną opcję; zwraca opis skutku albo null, jeśli opcja jest niedostępna.
export function resolveChoice(s, k, i) {
  const o = CHOICES[k].opts[i]
  if (!o || (o.need && o.need(s))) return null
  const txt = o.run(s)
  s.mor = Math.max(0, Math.min(100, s.mor)); s.pop = Math.max(0, s.pop)
  return CHOICES[k].t + ' – ' + o.n.toLowerCase() + ': ' + txt
}

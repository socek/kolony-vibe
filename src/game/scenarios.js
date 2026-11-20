// Scenariusze: każdy ma własny cel, historię, stały poziom trudności (mnożnik wyniku) i może zmieniać zasady.
// Wspólna fabuła: przygotowania do setnych urodzin Imperatora Gały, władcy Ludzkiej Unii Jedności.
import { BLD, TECH, DAYS } from './constants.js'
import { addDeposit, depositName } from './expeditions.js'

export const DIFF = {
  easy: { n: 'ŁATWY', mult: 1, color: 'var(--green)' },
  normal: { n: 'NORMALNY', mult: 1.5, color: 'var(--yellow)' },
  hard: { n: 'TRUDNY', mult: 2, color: 'var(--red)' }
}

// Początek fabuły pokazywany na ekranie startowym (pod „RUN”)
export const BOOT_STORY = [
  'Imperator Gała – ojciec Jego Wysokości chciał dać mu na imię Chwała, ale wypełniając akt urodzenia był pijany jak bela, a że słowo imperatora jest świętością, tak już zostało – właśnie awansował ciebie, skromnego Doradcę Uprzejmości Pomiędzy Ambasadami, na stanowisko Gubernatora Ósmego Wielkiego Nowego Obszaru.',
  'Od dziś zamiast siedzieć w ciepłym pałacu, między złoconymi kolumnami a bufetem z ciasteczkami, dostajesz zaszczytną możliwość zarządzania wspaniałymi, nowymi koloniami. Bez ogrzewania i bez ciepłych dań, za to z prawem do korzystania z Sanitariatów Rzeczywiście Antycznych, Cudownie Zachowanych – dumy całego obszaru.',
  'Imperator Gała ogłosił, że najtrudniejsze zadania powierza swoim najsilniejszym wojownikom. To, że podjął tę decyzję zaraz po tym, jak wypiłeś z jego lodówki mleko przeznaczone na imperatorskie śniadanie, jest oczywiście totalnym przypadkiem. Podobnie jak to, że karton był podpisany „NIE RUSZAĆ – IMPERATOR”.',
  'Pakuj walizkę, gubernatorze. Prom odlatuje o świcie. I pamiętaj motto obszaru: Spokojnie, Przetrwasz! Ambitnie Działaj, Awansujesz Jutro!'
]

export const PROLOGUE = 'Imperator Gała zjadł swoje ulubione śniadanie – jajecznicę z trzech strusich jaj, popitą świeżym mlekiem z nowej lodówki zamykanej na szyfr – i wyraźnie złagodniał. W przypływie łaskawości pozwolił ci samemu wybrać kolonię, którą pokierujesz. Wybieraj rozważnie: Jego Wysokość obchodzi wkrótce setne urodziny, a każda kolonia Ósmego Wielkiego Nowego Obszaru ma przygotować coś wyjątkowego na „Najwspanialszy Jubileusz w Dziejach Ludzkości”. Dobry humor Imperatora trwa zwykle do obiadu.'

const R = Math.round, rnd = () => Math.random()
const pct = (v, n) => Math.min(100, v / n * 100)
const popGoal = n => ({
  text: n + ' kolonistów', short: 'CEL: ' + n + ' OSÓB',
  progress: s => pct(s.pop, n), done: s => s.pop >= n, status: s => 'koloniści ' + R(s.pop) + '/' + n
})
const instances = s => { const out = []; for (const k in s.cond || {}) for (const x of s.cond[k]) out.push([k, x]); return out }

// pory roku (dzień roku → pora); wpływają na elektrownie słoneczne, plony i ogrzewanie
export const SEASONS = {
  winter: { n: 'ZIMA', solar: 0.7, food: 0.8, heat: 0.02 },
  spring: { n: 'WIOSNA', solar: 1, food: 1, heat: 0 },
  summer: { n: 'LATO', solar: 1.2, food: 1.1, heat: 0 },
  autumn: { n: 'JESIEŃ', solar: 0.9, food: 1.3, heat: 0 }
}
const SEASON_STARTS = [[1, 'winter'], [60, 'spring'], [152, 'summer'], [244, 'autumn'], [335, 'winter']]
export function yearSeason(day) {
  const d = ((day - 1) % DAYS) + 1
  let cur = 'winter'
  for (const [from, k] of SEASON_STARTS) if (d >= from) cur = k
  const nxt = SEASON_STARTS.find(([from, k]) => from > d && k !== cur) || [DAYS + 60, 'spring']
  return { k: cur, ...SEASONS[cur], next: SEASONS[nxt[1]].n, inDays: nxt[0] - d }
}

export const SCENARIOS = [
  {
    k: 'moon', n: 'Księżyc Jowisz-67', diff: 'easy', ready: true,
    patron: 'Specjalny Doradca Imperatora do spraw Rozpowszechniania Czytania Książek wśród Obywateli Niechętnych Czytaniu',
    story: [
      'Na Jubileusz przylecą miliardy gości, a Imperator nie zniesie myśli, że w kolejce do toalety nie będą mieli czego czytać.',
      'Księżyc Jowisz-67 ma się stać Wielką Biblioteką Jubileuszową. Wszystkie książki ludzkości trzeba przepisać ręcznie – bo „tak jest bardziej uroczyście” – a do tego potrzeba mnóstwa kolonistów.'
    ],
    goal: popGoal(1000),
    win: 'Biblioteka Jubileuszowa tętni życiem: tysiąc kopistów przepisuje książki dzień i noc. Specjalny Doradca płacze ze wzruszenia nad pierwszym tomem „Instrukcji obsługi tostera” przepisanym kaligrafią.',
    features: 'Klasyczna rozgrywka: bez pór roku i bez fauny.'
  },
  {
    k: 'purr', n: 'Planeta Mruczysko', diff: 'normal', ready: true,
    patron: 'Nadzwyczajny Pełnomocnik Imperatora do spraw Zwierząt Puszystych, Mniej Puszystych oraz Tych, Co do Których Puszystości Trwa Spór Naukowy',
    story: [
      'Imperator zażyczył sobie na urodziny mini zoo z „czymś, co mruczy, ale nie jest kotem”. Na Mruczysku żyją mruczki – nikt nie wie, czy są groźne, bo jeszcze nikt nie podszedł bliżej.',
      'Planeta ma pory roku, a jej fauna potrafi zapylić twoje uprawy albo je zjeść. Zbuduj zagrody, oswój mruczki i nie daj się stadu, które właśnie wybiera się na wiosenną migrację.'
    ],
    goal: {
      text: '600 kolonistów i 50 oswojonych mruczków', short: 'CEL: 600 OSÓB, 50 MRUCZKÓW',
      progress: s => (pct(s.pop, 600) + pct(s.tamed || 0, 50)) / 2,
      done: s => s.pop >= 600 && (s.tamed || 0) >= 50,
      status: s => 'koloniści ' + R(s.pop) + '/600 · mruczki ' + (s.tamed || 0) + '/50'
    },
    win: 'Pięćdziesiąt mruczków jedzie w luksusowych kontenerach na Jubileusz. Nadzwyczajny Pełnomocnik ogłasza, że spór naukowy o ich puszystość rozstrzygnięto: są puszyste. Bardzo.',
    features: 'Pory roku, fauna lokalna, zagrody i myśliwi.',
    season: s => yearSeason(s.m),
    hunt: true,
    // gra zaczyna się zimą: więcej farm i zapasów, żeby przetrwać do wiosny
    start: s => { s.tamed = 0; s.tameProg = 0; s.prio.hunt = 0; s.b.farm = 4; s.b.power = 3; s.b.fridge = 2; s.food = 600; s.b.house = 3; s.pop = 130 },
    tick: (s, c, note, add) => {
      const stops = []
      // oswajanie w zagrodach
      s.tameProg = (s.tameProg || 0) + c.tameRate
      while (s.tameProg >= 1 && (s.tamed || 0) < (s.b.pen || 0) * 20) { s.tameProg -= 1; s.tamed = (s.tamed || 0) + 1; add('tamed', { a: 1 }) }
      if (s.tameProg > 1) s.tameProg = 1
      // fauna: wiosną dwa razy częściej, myśliwi ją rozdrażniają
      const sea = yearSeason(s.m), hunting = c.E.hunt > 0 && c.wNeed.hunt > 0
      if (rnd() < 0.06 * (sea.k === 'spring' ? 2 : 1) * (hunting ? 1.5 : 1)) {
        const good = rnd() < ({ spring: 0.5, summer: 0.5, autumn: 0.4, winter: 0.3 }[sea.k]) * (hunting ? 0.7 : 1)
        const red = c.faunaRed, roll = rnd()
        if (good) {
          if (roll < 0.4) { s.food += 60; note('★ Fauna: rój świetlików zapylił uprawy – +60 t żywności.', 'pos') }
          else if (roll < 0.7) { const n = depositName('przy szlaku mruczków'), t = addDeposit(s, n, 300); note('★ Fauna: mruczki wydeptały ścieżkę do nowego złoża – ' + n + ', ' + t + ' t.', 'pos') }
          else if ((s.b.pen || 0) * 20 > (s.tamed || 0)) { s.tamed = (s.tamed || 0) + 1; note('★ Fauna: przybłąkany mruczek sam wszedł do zagrody!', 'pos') }
          else { s.mor += 2; note('★ Fauna: stado mruczków mruczało całą noc pod kopułą – koloniści są zachwyceni (+2 morale).', 'pos') }
          stops.push('faunaGood')
        } else {
          let txt
          if (roll < 0.35) { const l = R(s.food * 0.15 * (1 - red)); s.food -= l; txt = 'stado splądrowało zapasy – stracono ' + l + ' t żywności' }
          else if (roll < 0.6 && s.cond && s.cond.mine && s.cond.mine.length && rnd() > red) { s.cond.mine[0].broken = true; txt = 'mruczki uwiły gniazdo w kopalni – awaria' }
          else if (roll < 0.75 && s.exp.length) { const x = s.exp[0], l = Math.min(2, x.team - 1); x.team -= l; txt = 'fauna zaatakowała wyprawę w terenie – zginęło ' + l + ' uczestników' }
          else if (rnd() > red) {
            const ks = Object.keys(BLD).filter(k => s.b[k] > 0), k = ks[Math.floor(rnd() * ks.length)]
            if (k) { s.b[k]--; txt = 'stado stratowało budynek: ' + BLD[k].n } else txt = 'stado przebiegło przez pustą kolonię'
          } else txt = 'stado szarżowało na kolonię, ale ogrodzenie soniczne je odstraszyło'
          if (s.b.fence && rnd() < 0.25) { s.b.fence--; txt += '; zniszczone zostało ogrodzenie soniczne' }
          note('Fauna: ' + txt + '.', 'neg'); stops.push('faunaBad')
        }
      }
      return stops
    }
  },
  {
    k: 'ticktock', n: 'Asteroida Tik-Tak', diff: 'normal', ready: true,
    patron: 'Główny Chronometrysta Dworu do spraw Punktualności, Spóźnień Usprawiedliwionych oraz Kalendarzy Ściennych z Ładnymi Obrazkami',
    story: [
      'Imperator obawia się, że jedna doba nie wystarczy, żeby przyjąć życzenia od wszystkich gości. Zażądał technologii, która rozciągnie dzień Jubileuszu do 48 godzin.',
      'Asteroida Tik-Tak jest pełna anomalii czasowych – idealne miejsce na laboratorium. Albo najgorsze. Naukowcy wciąż się kłócą, bo dla każdego z nich minęło już inaczej dużo czasu.'
    ],
    goal: {
      text: 'zbadać Rozciągacz Doby i mieć 300 kolonistów', short: 'CEL: ROZCIĄGACZ DOBY',
      progress: s => s.tech.stretch ? pct(s.pop, 300) : Math.min(99, ['chrono1', 'chrono2', 'stretch'].reduce((a, k) => a + (s.tech[k] ? 30 : 0), 0) + (s.rs === 'stretch' ? 9 : 0)),
      done: s => !!s.tech.stretch && s.pop >= 300,
      status: s => 'Rozciągacz Doby: ' + (s.tech.stretch ? 'zbadany' : 'nie') + ' · koloniści ' + R(s.pop) + '/300'
    },
    win: 'Rozciągacz Doby działa! Dzień Jubileuszu potrwa 48 godzin. Główny Chronometrysta przez pomyłkę rozciągnął też swój urlop – na zawsze.',
    features: 'Scenariusz badawczy: anomalie czasu, mało złóż, słabe farmy.',
    start: s => { s.dep[0].t = s.dep[0].max = 500; s.b.lab = 2; s.spec.sci = 16; s.b.farm = 4; s.food = 400; s.mods = { farmMul: 0.75 } },
    tick: (s, c, note) => {
      if (rnd() >= 0.05) return []
      // pętle czasowe sprawiają, że anomalie częściej pomagają
      const helpful = rnd() < (s.tech.chrono2 ? 0.7 : 0.5), k = s.rs
      if (helpful) {
        if (rnd() < 0.5) { s.m -= 1; note('★ Anomalia czasu: dzień się powtórzył – zyskujesz dodatkowy dzień kadencji!', 'pos') }
        else if (k) { const p = R(TECH[k].c * 0.15); s.rp[k] = (s.rp[k] || 0) + p; note('★ Anomalia czasu: laboratorium dostało wyniki badań z przyszłości – ' + TECH[k].n + ' +' + p + ' pkt.', 'pos') }
        else { s.m -= 1; note('★ Anomalia czasu: dzień się powtórzył – zyskujesz dodatkowy dzień kadencji!', 'pos') }
        return ['anomalyGood']
      }
      if (rnd() < 0.5 || !k) { s.m += 1; note('Anomalia czasu: cały dzień przepadł w pętli – kadencja jest krótsza o dzień.', 'neg') }
      else { const p = R((s.rp[k] || 0) * 0.2 * (s.tech.chrono1 ? 0.5 : 1)); s.rp[k] = (s.rp[k] || 0) - p; note('Anomalia czasu: laboratorium cofnęło się w czasie – ' + TECH[k].n + ' −' + p + ' pkt.', 'neg') }
      return ['anomalyBad']
    }
  },
  {
    k: 'splash', n: 'Planeta Chlupotka', diff: 'hard', ready: true,
    patron: 'Wielki Mistrz Ceremonii Rekreacyjno-Sportowych Jego Wysokości, Kawaler Orderu Złotego Kija',
    story: [
      'Imperator chce zagrać na Jubileuszu w golfa – ale na wodzie, bo „na trawie grają wszyscy”. Chlupotka ma dużo wody i prawie nic poza nią.',
      'Lądu jest tyle, co kot napłakał, więc każdy budynek się liczy – a nowe miejsca dadzą tylko pływające platformy. Złóż na lądzie prawie nie ma, za to morze daje wodorosty. I sztormy.'
    ],
    goal: {
      text: '18 pływających dołków golfowych i 400 kolonistów', short: 'CEL: 18 DOŁKÓW',
      progress: s => (pct(s.b.golf || 0, 18) * 3 + pct(s.pop, 400)) / 4,
      done: s => (s.b.golf || 0) >= 18 && s.pop >= 400,
      status: s => 'dołki ' + (s.b.golf || 0) + '/18 · koloniści ' + R(s.pop) + '/400'
    },
    win: 'Imperator trafił do dołka za pierwszym razem – piłka popłynęła sama. Wielki Mistrz Ceremonii otrzymał Order Złotego Kija z Wodorostami.',
    features: 'Mało lądu, farmy wodorostów, sztormy, platformy pływające.',
    slots: { base: 14, per: { platform: 4 }, free: ['platform', 'golf', 'kelp'] },
    start: s => { s.dep[0].t = s.dep[0].max = 300; s.mods = { farmMul: 0.6, depMul: 0.5 } },
    tick: (s, c, note) => {
      if (rnd() >= 0.04) return []
      const hit = instances(s).sort(() => rnd() - 0.5).slice(0, 2)
      for (const [, x] of hit) { x.c = Math.max(1, x.c - 40); if (rnd() < 0.3) x.broken = true }
      let txt = hit.length ? 'SZTORM! Fale uszkodziły: ' + hit.map(([k]) => BLD[k].n).join(' i ') : 'SZTORM! Na szczęście fale nic nie uszkodziły'
      if (s.b.golf && rnd() < 0.2) { s.b.golf--; txt += '; jeden dołek golfowy odpłynął w siną dal' }
      note(txt + '.', 'neg')
      return ['storm']
    }
  },
  {
    k: 'sill', n: 'Stacja Parapet-3', diff: 'hard', ready: true,
    patron: 'Pierwszy Zastępca Wicekanclerza do spraw Widoków z Okna i Ogólnej Malowniczości Horyzontu',
    story: [
      'Imperator chce oglądać jubileuszowe fajerwerki z miejsca, z którego widać je wszystkie naraz. Takie miejsce jest tylko na orbicie – trzeba tam postawić stację z najlepszym parapetem w galaktyce.',
      'Na stacji nie ma gruntu, więc nie ma też kopalń – minerały przywiozą tylko wyprawy na asteroidy albo kupisz je na rynku. Miejsca jest mało, a każde rozszczelnienie to prawdziwy kłopot.'
    ],
    goal: {
      text: 'Imperialna Galeria Widokowa i 500 kolonistów', short: 'CEL: GALERIA WIDOKOWA',
      progress: s => ((s.b.gallery ? 100 : Math.min(90, ((s.q.find(x => x.k === 'gallery') || {}).d || 0) / BLD.gallery.bt * 90)) * 2 + pct(s.pop, 500)) / 3,
      done: s => (s.b.gallery || 0) >= 1 && s.pop >= 500,
      status: s => 'galeria: ' + (s.b.gallery ? 'gotowa' : s.q.some(x => x.k === 'gallery') ? 'w budowie' : 'nie') + ' · koloniści ' + R(s.pop) + '/500'
    },
    win: 'Z Galerii Widokowej widać wszystkie fajerwerki naraz. Imperator zachwycony – tylko Pierwszy Zastępca Wicekanclerza narzeka, że parapet jest odrobinę za wąski na jego łokcie.',
    features: 'Stacja orbitalna: bez kopalń, rozszczelnienia, mało miejsca.',
    ban: ['mine', 'mine2'],
    slots: { base: 12, per: { module: 3 }, free: ['module'] },
    start: s => { s.dep = []; s.min = 600; s.b.mine = 0; s.mods = { noMines: true } },
    tick: (s, c, note) => {
      if (rnd() >= 0.03) return []
      const eng = Math.min(0.6, ((s.spec && s.spec.eng) || 0) * 0.05)
      const lost = Math.max(0, R((2 + rnd() * 4) * (1 - eng)))
      s.pop -= Math.min(lost, s.pop); s.mor -= 5
      const all = instances(s); if (all.length) all[Math.floor(rnd() * all.length)][1].broken = true
      note('ROZSZCZELNIENIE! Jeden z modułów stracił powietrze' + (lost ? ' – zginęło ' + lost + ' kolonistów' : ' – inżynierowie zdążyli uszczelnić go na czas') + '.', 'neg')
      return ['breach']
    }
  },
  {
    k: 'ice', n: 'Glob Kostkolód', diff: 'hard', ready: true,
    patron: 'Sekretarz Stanu do spraw Napojów Chłodzonych, Lodu Ceremonialnego oraz Słomek Okolicznościowych',
    story: [
      'Przy Jubileuszu Imperator wzniesie toast, a jego napój musi być schłodzony lodem „z najczystszego zamarzniętego świata w galaktyce”.',
      'Problem w tym, że na Kostkolodzie jest tak zimno, że lód trzeba najpierw rozmrozić, oczyścić i zamrozić ponownie. Wieczna zima pożera energię na ogrzewanie, a słońce ledwo świeci – za to pod lodem leżą bogate złoża.'
    ],
    goal: {
      text: 'wysłać 2000 t Lodu Ceremonialnego', short: 'CEL: 2000 T LODU',
      progress: s => pct(s.iceSent || 0, 2000), done: s => (s.iceSent || 0) >= 2000,
      status: s => 'Lód Ceremonialny ' + R(s.iceSent || 0) + '/2000 t'
    },
    win: 'Imperator wzniósł toast, a lód zadzwonił o kryształ jak dzwoneczki. Sekretarz Stanu do spraw Napojów Chłodzonych dostał awans na Sekretarza Stanu do spraw Wszystkich Napojów.',
    features: 'Wieczna zima, kosztowne ogrzewanie, słabe słońce, bogate złoża.',
    season: () => ({ k: 'winter', n: 'WIECZNA ZIMA', solar: 0.25, food: 1, heat: 0.04, next: null }),
    // wieczna zima: na start geotermia i więcej farm, bo słońce i plony są słabe
    start: s => { s.dep[0].t = s.dep[0].max = 4000; s.iceSent = 0; s.b.geo = 2; s.b.farm = 5; s.b.fridge = 2; s.b.house = 3; s.pop = 130; s.food = 700; s.cr = 700; s.mods = { farmMul: 0.7, depMul: 1.5 } },
    tick: (s, c, note, add) => { if (c.iceProd > 0) { s.iceSent = (s.iceSent || 0) + c.iceProd; add('ice', { a: c.iceProd }) } return [] }
  }
]

export const scenarioOf = s => SCENARIOS.find(x => x.k === ((s && s.sc) || 'moon')) || SCENARIOS[0]
export const diffOf = s => DIFF[scenarioOf(s).diff]
export const seasonOf = s => { const f = scenarioOf(s).season; return f ? f(s) : null }

// dostępność budynków i technologii w scenariuszu
export const bldAvail = (s, k) => (!BLD[k].sc || BLD[k].sc.includes(scenarioOf(s).k)) && !(scenarioOf(s).ban || []).includes(k)
export const techAvail = (s, k) => !TECH[k].sc || TECH[k].sc.includes(scenarioOf(s).k)

// miejsca na budynki (tylko w scenariuszach z ograniczonym miejscem)
export function slotsInfo(s) {
  const sl = scenarioOf(s).slots
  if (!sl) return null
  const free = k => sl.free.includes(k)
  let max = sl.base, used = 0
  for (const k in BLD) { if (sl.per[k]) max += (s.b[k] || 0) * sl.per[k]; if (!free(k)) used += s.b[k] || 0 }
  used += s.q.filter(x => !free(x.k)).length
  return { max, used, free }
}
export function buildBlock(s, k) {
  if (!bldAvail(s, k)) return 'Niedostępne w tym scenariuszu.'
  const sl = slotsInfo(s)
  if (sl && !sl.free(k) && sl.used >= sl.max) return 'Brak miejsca na budynki – ' + (scenarioOf(s).k === 'splash' ? 'zbuduj platformę pływającą.' : 'zbuduj moduł stacji.')
  return ''
}

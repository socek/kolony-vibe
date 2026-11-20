// p – produkcja dziennie, w – pracownicy, en – zużycie energii kWh/dzień,
// crew – maks. liczba budowniczych, bt – praca potrzebna do budowy (osobodni)
export const BLD = {
  farm: { n: 'Farma hydroponiczna', cr: 120, mi: 40, w: 10, en: 1.5, p: 8, crew: 5, bt: 30, d: '+8 t żywności dziennie' },
  farm2: { n: 'Farma aeroponiczna', cr: 200, mi: 70, w: 10, en: 2.5, p: 12, crew: 6, bt: 45, d: '+12 t żywności dziennie – uprawy w mgle odżywczej', req: 'hydro' },
  synth: { n: 'Syntezator żywności', cr: 300, mi: 120, w: 2, en: 8, p: 14, crew: 6, bt: 60, d: '+14 t żywności dziennie z syntezy białka – tylko 2 pracowników, ale 8 kWh prądu', req: 'synth' },
  power: { n: 'Elektrownia słoneczna', cr: 150, mi: 60, w: 6, en: 0, p: 10, crew: 5, bt: 35, d: '+10 kWh energii dziennie' },
  power2: { n: 'Elektrownia grafenowa', cr: 240, mi: 90, w: 6, en: 0, p: 16, crew: 6, bt: 50, d: '+16 kWh energii dziennie – wydajne ogniwa grafenowe', req: 'graph' },
  battery: { n: 'Bateria', cr: 130, mi: 70, w: 1, en: 0, crew: 3, bt: 15, d: '+100 kWh pojemności magazynu energii' },
  fridge: { n: 'Chłodnia', cr: 110, mi: 40, w: 2, en: 1, crew: 4, bt: 20, d: '+250 t miejsca na żywność' },
  store: { n: 'Magazyn minerałów', cr: 100, mi: 30, w: 2, en: 0, crew: 4, bt: 20, d: '+250 t miejsca na minerały' },
  mine: { n: 'Kopalnia', cr: 140, mi: 20, w: 12, en: 2, p: 6, crew: 6, bt: 50, d: '+6 t minerałów dziennie, wydobywane ze złóż' },
  mine2: { n: 'Kopalnia głębinowa', cr: 230, mi: 40, w: 14, en: 3, p: 10, crew: 8, bt: 70, d: '+10 t minerałów dziennie, wydobywane ze złóż', req: 'drill' },
  house: { n: 'Moduł mieszkalny', cr: 100, mi: 50, w: 2, en: 1, crew: 4, bt: 20, d: '+60 miejsc' },
  school: { n: 'Szkoła', cr: 260, mi: 80, w: 4, en: 1.5, crew: 6, bt: 45, d: 'kształci specjalistów: 1 osoba co 4 dni (specjalizację wybierasz w zakładce PRACA)' },
  hosp: { n: 'Szpital', cr: 280, mi: 90, w: 3, en: 2, crew: 6, bt: 50, d: 'osłabia epidemie, zmniejsza zgony z głodu, przyspiesza przyrost, więcej osób zdolnych do pracy – obsadzają go tylko naukowcy' },
  rec: { n: 'Centrum rekreacji', cr: 200, mi: 60, w: 6, en: 1.5, crew: 6, bt: 50, d: 'podnosi morale' },
  lab: { n: 'Laboratorium', cr: 250, mi: 80, w: 8, en: 2, p: 2, crew: 8, bt: 80, d: '+2 pkt badań dziennie' },
  port: { n: 'Port kosmiczny', cr: 600, mi: 250, w: 15, en: 3.5, p: 13, crew: 15, bt: 300, d: '+13 kr handlu dziennie, imigranci, lepsze ceny', max: 1 },
  shield: { n: 'Osłona orbitalna', cr: 180, mi: 90, w: 0, en: 0.5, crew: 6, bt: 60, d: 'przechwytuje jeden deszcz meteorytów i ulega zniszczeniu', req: 'shield' },
  // --- budynki tylko w niektórych scenariuszach (sc) ---
  fence: { n: 'Ogrodzenie soniczne', cr: 180, mi: 60, w: 3, en: 1, crew: 4, bt: 25, d: 'zmniejsza straty od szkodliwej fauny, gdy jest obsadzone (żołnierze pracują wydajniej)', sc: ['purr'] },
  pen: { n: 'Zagroda', cr: 150, mi: 40, w: 3, en: 0.5, crew: 4, bt: 20, d: 'oswaja mruczki: 1 co 5 dni (do 20 na zagrodę); oswojone mruczki poprawiają morale', sc: ['purr'] },
  kelp: { n: 'Farma wodorostów', cr: 100, mi: 20, w: 6, en: 0.5, p: 9, crew: 4, bt: 20, d: '+9 t żywności dziennie z morza – nie zajmuje miejsca na lądzie', sc: ['splash'] },
  platform: { n: 'Platforma pływająca', cr: 150, mi: 80, w: 0, en: 0, crew: 4, bt: 20, d: '+4 miejsca na budynki', sc: ['splash'] },
  golf: { n: 'Pływający dołek golfowy', cr: 250, mi: 60, w: 0, en: 0.5, crew: 4, bt: 25, d: 'jeden z 18 dołków imperialnego pola golfowego – unosi się na wodzie', sc: ['splash'], max: 18 },
  module: { n: 'Moduł stacji', cr: 200, mi: 120, w: 0, en: 0.5, crew: 5, bt: 30, d: '+3 miejsca na budynki na stacji', sc: ['sill'] },
  gallery: { n: 'Imperialna Galeria Widokowa', cr: 2500, mi: 800, w: 10, en: 6, crew: 20, bt: 400, d: 'parapet z widokiem na wszystkie fajerwerki naraz – cel scenariusza', sc: ['sill'], max: 1 },
  geo: { n: 'Elektrownia geotermalna', cr: 260, mi: 120, w: 5, en: 0, p: 18, crew: 6, bt: 50, d: '+18 kWh dziennie z ciepła planety – działa także w wiecznej zimie', sc: ['ice'] },
  icefac: { n: 'Oczyszczalnia lodu', cr: 300, mi: 150, w: 8, en: 4, p: 6, crew: 6, bt: 50, d: '+6 t Lodu Ceremonialnego dziennie, wysyłanego prosto do Imperatora', sc: ['ice'] },
  gun: { n: 'Działo magnetyczne', cr: 220, mi: 100, w: 4, en: 1, crew: 5, bt: 40, d: 'zmniejsza straty od piratów i meteorytów, gdy jest obsadzone', req: 'cannon' }
}

// Grupy budynków na liście budowy
export const BLD_GROUPS = [
  { n: 'ŻYWNOŚĆ', icon: 'food', color: 'var(--green)', ks: ['farm', 'farm2', 'synth', 'kelp', 'fridge'] },
  { n: 'PRZEMYSŁ I NAUKA', icon: 'mine', color: 'var(--yellow)', ks: ['power', 'power2', 'geo', 'battery', 'mine', 'mine2', 'store', 'lab'] },
  { n: 'LUDNOŚĆ', icon: 'pop', color: 'var(--red)', ks: ['house', 'school', 'hosp', 'rec', 'pen', 'port', 'platform', 'module'] },
  { n: 'OBRONA', icon: 'shield', color: 'var(--cyan)', ks: ['shield', 'gun', 'fence'] },
  { n: 'CEL SCENARIUSZA', icon: 'res', color: 'var(--white)', ks: ['golf', 'gallery', 'icefac'] }
]

// Gałęzie drzewa technologii (kolumny schematu)
export const TECH_BRANCHES = [
  { k: 'food', n: 'ŻYWNOŚĆ', color: 'var(--green)' },
  { k: 'ind', n: 'PRZEMYSŁ I ENERGIA', color: 'var(--yellow)' },
  { k: 'pop', n: 'LUDNOŚĆ', color: 'var(--red)' },
  { k: 'def', n: 'OBRONA', color: 'var(--cyan)' },
  { k: 'exp', n: 'WYPRAWY', color: 'var(--white)' },
  { k: 'trade', n: 'HANDEL I POLITYKA', color: 'var(--text)' }
]

// Technologie: g – gałąź, c – koszt w punktach badań, req – wymagane technologie, d – efekt
export const TECH = {
  hydro: { g: 'food', n: 'Aeroponika', c: 40, req: [], d: 'Pozwala budować farmy aeroponiczne (+12 t żywności zamiast +8)' },
  cryo: { g: 'food', n: 'Krio\u00adprzecho\u00adwalnictwo', c: 50, req: [], d: 'Chłodnie mieszczą o 50% więcej żywności' },
  synth: { g: 'food', n: 'Synteza białka', c: 120, req: ['hydro', 'graph'], d: 'Pozwala budować syntezatory żywności – dużo żywności przy 2 pracownikach, ale za dużo prądu' },
  graph: { g: 'ind', n: 'Ogniwa grafenowe', c: 50, req: [], d: 'Pozwala budować elektrownie grafenowe (+16 kWh zamiast +10)' },
  drill: { g: 'ind', n: 'Wiertła głębinowe', c: 60, req: [], d: 'Pozwala budować kopalnie głębinowe (+10 t minerałów zamiast +6)' },
  supercap: { g: 'ind', n: 'Super\u00adkondensatory', c: 70, req: ['graph'], d: 'Baterie mieszczą dwa razy więcej energii' },
  auto: { g: 'ind', n: 'Automatyzacja', c: 90, req: ['graph'], d: 'Budynki i budowy potrzebują o 25% mniej pracowników' },
  med: { g: 'pop', n: 'Medycyna kosmiczna', c: 80, req: [], d: 'Przyrost +30%, słabsze epidemie' },
  stack: { g: 'pop', n: 'Moduły piętrowe', c: 70, req: [], d: 'Moduł mieszkalny mieści 90 osób zamiast 60' },
  creche: { g: 'pop', n: 'Zautomatyzowane żłobki', c: 90, req: ['med', 'auto'], d: 'Roboty opiekują się dziećmi – zdolnych do pracy jest o 5 punktów procentowych więcej' },
  holo: { g: 'pop', n: 'Holorozrywka', c: 100, req: ['graph'], d: 'Centra rekreacji są dwa razy skuteczniejsze' },
  cannon: { g: 'def', n: 'Działa magnetyczne', c: 70, req: [], d: 'Pozwala budować działa magnetyczne, które zmniejszają straty od piratów i meteorytów' },
  shield: { g: 'def', n: 'Osłony orbitalne', c: 110, req: ['graph'], d: 'Pozwala budować osłony orbitalne chroniące przed meteorytami' },
  targeting: { g: 'def', n: 'Systemy celownicze', c: 100, req: ['cannon', 'auto'], d: 'Działa potrzebują 2 pracowników zamiast 4 i są o 50% silniejsze' },
  sonar: { g: 'exp', n: 'Sonary geologiczne', c: 60, req: ['drill'], d: 'Wyprawy mają o 15 punktów procentowych większą szansę na znalezienie złoża' },
  rover: { g: 'exp', n: 'Łaziki terenowe', c: 90, req: ['sonar', 'auto'], d: 'Wyprawy są o 30% krótsze, a ryzyko strat o połowę mniejsze. Odblokowuje cele: Pas wulkaniczny i Pole meteorytowe' },
  chrono1: { g: 'ind', n: 'Chronometria kwantowa', c: 120, req: ['graph'], d: 'Pierwszy krok do Rozciągacza Doby. Laboratoria lepiej znoszą anomalie czasu (połowa strat).', sc: ['ticktock'] },
  chrono2: { g: 'ind', n: 'Pętle czasowe', c: 180, req: ['chrono1', 'auto'], d: 'Pozwala okiełznać pętle czasu – anomalie częściej pomagają niż szkodzą.', sc: ['ticktock'] },
  stretch: { g: 'ind', n: 'Rozciągacz Doby', c: 300, req: ['chrono2', 'med'], d: 'Rozciąga dzień Jubileuszu do 48 godzin – cel scenariusza Asteroida Tik-Tak.', sc: ['ticktock'] },
  exchange: { g: 'trade', n: 'Giełda między\u00adgwiezdna', c: 60, req: [], d: 'Ceny na rynku lepsze o 10% i handel partiami po 500 t' },
  propa: { g: 'trade', n: 'Propaganda holo\u00adgraficzna', c: 80, req: ['exchange', 'holo'], d: 'Kampanie reklamowe są o 30% tańsze. Odblokowuje kampanię: Loteria biletów kolonijnych' }
}

export const RES = { food: { n: 'Żywność', base: 4 }, min: { n: 'Minerały', base: 6 } }

export const BATCAP = 100, STBASE = 150, STCAP = 250, MAINT = 1, MORK = 0.11
export const HUNGER_MAX = 12 // po tylu dniach głodu kolonia wymiera
export const DAYS = 365, YEAR = 2150, KEY = 'kolony-vibe-v2'

export const INFRA = ['battery', 'fridge', 'store', 'house', 'shield', 'platform', 'module', 'golf']
export const JOBS = ['build', 'repair', 'farm', 'farm2', 'synth', 'power', 'power2', 'mine', 'mine2', 'school', 'hosp', 'rec', 'lab', 'port', 'gun', 'hunt', 'kelp', 'geo', 'icefac', 'fence', 'pen', 'gallery']
export const PRIO = [[0, 'STOP'], [1, 'NISKI'], [2, 'ŚREDNI'], [3, 'WYSOKI']]
export const TABS = [['raport', 'RAPORT'], ['budowa', 'BUDOWA'], ['praca', 'PRACA'], ['wyprawy', 'WYPRAWY'], ['rynek', 'RYNEK'], ['polityka', 'POLITYKA'], ['nauka', 'TECHNOLOGIE'], ['statystyki', 'STATYSTYKI']]
export const RATIONS = [[0.75, 'Głodowe'], [1, 'Normalne'], [1.25, 'Obfite']]
export const MDAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
export const MNAMES = ['STY', 'LUT', 'MAR', 'KWI', 'MAJ', 'CZE', 'LIP', 'SIE', 'WRZ', 'PAŹ', 'LIS', 'GRU']

// Specjaliści: jobs – stanowiska, na których dają premię; req – stanowiska tylko dla nich
export const SPEC = {
  sci: { n: 'Naukowcy', one: 'naukowiec', jobs: ['lab', 'hosp'], req: ['lab', 'hosp'] },
  eng: { n: 'Inżynierowie', one: 'inżynier', jobs: ['build', 'repair', 'geo', 'icefac', 'power', 'power2', 'mine', 'mine2', 'synth', 'port'], req: [] },
  sol: { n: 'Żołnierze', one: 'żołnierz', jobs: ['gun', 'fence', 'hunt'], req: [] }
}
export const SPEC_BONUS = 1.5 // sprawność specjalisty na swoim stanowisku (zwykły kolonista = 1)
export const SPEC_REQ = ['lab', 'hosp']
export const prioOf = (s, k) => INFRA.includes(k) ? 9 : ((s.prio || {})[k] ?? 2)
export const jobName = k => k === 'build' ? 'Budowniczowie' : k === 'repair' ? 'Konserwatorzy' : k === 'hunt' ? 'Myśliwi' : BLD[k].n
// pojemność magazynu danego surowca: żywność w chłodniach, minerały w magazynach minerałów
export const capOf = (s, k) => k === 'food'
  ? STBASE + (s.b.fridge || 0) * STCAP * (s.tech.cryo ? 1.5 : 1)
  : STBASE + (s.b.store || 0) * STCAP
// pojemność baterii i liczba miejsc w modułach mieszkalnych (zależą od technologii)
export const batCapOf = s => (s.b.battery || 0) * BATCAP * (s.tech.supercap ? 2 : 1)
export const HOUSE_CAP = 60
export const houseCapOf = s => (s.b.house || 0) * HOUSE_CAP * (s.tech.stack ? 1.5 : 1)
// czy technologia istnieje w scenariuszu tej gry (część technologii jest tylko w wybranych scenariuszach)
export const techIn = (s, k) => !TECH[k].sc || TECH[k].sc.includes(s.sc || 'moon')
// czy wszystkie wymagania technologii są odkryte
export const techReady = (s, k) => TECH[k].req.every(r => s.tech[r])

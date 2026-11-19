// p – produkcja dziennie, w – pracownicy, en – zużycie energii kWh/dzień,
// crew – maks. liczba budowniczych, bt – praca potrzebna do budowy (osobodni)
export const BLD = {
  farm: { n: 'Farma hydroponiczna', cr: 120, mi: 40, w: 10, en: 1.5, p: 8, crew: 5, bt: 30, d: '+8 t żywności dziennie' },
  power: { n: 'Elektrownia słoneczna', cr: 150, mi: 60, w: 6, en: 0, p: 10, crew: 5, bt: 35, d: '+10 kWh energii dziennie' },
  battery: { n: 'Bateria', cr: 130, mi: 70, w: 1, en: 0, crew: 3, bt: 15, d: '+100 kWh pojemności magazynu energii' },
  fridge: { n: 'Chłodnia', cr: 110, mi: 40, w: 2, en: 1, crew: 4, bt: 20, d: '+250 t miejsca na żywność' },
  store: { n: 'Magazyn minerałów', cr: 100, mi: 30, w: 2, en: 0, crew: 4, bt: 20, d: '+250 t miejsca na minerały' },
  mine: { n: 'Kopalnia', cr: 140, mi: 20, w: 12, en: 2, p: 6, crew: 6, bt: 50, d: '+6 t minerałów dziennie, wydobywane ze złóż' },
  house: { n: 'Moduł mieszkalny', cr: 100, mi: 50, w: 2, en: 1, crew: 4, bt: 20, d: '+60 miejsc' },
  rec: { n: 'Centrum rekreacji', cr: 200, mi: 60, w: 6, en: 1.5, crew: 6, bt: 50, d: 'podnosi morale' },
  lab: { n: 'Laboratorium', cr: 250, mi: 80, w: 8, en: 2, p: 2, crew: 8, bt: 80, d: '+2 pkt badań dziennie' },
  port: { n: 'Port kosmiczny', cr: 600, mi: 250, w: 15, en: 3.5, p: 13, crew: 15, bt: 300, d: '+13 kr handlu dziennie, imigranci, lepsze ceny', max: 1 },
  shield: { n: 'Osłona orbitalna', cr: 180, mi: 90, w: 0, en: 0.5, crew: 6, bt: 60, d: 'przechwytuje jeden deszcz meteorytów i ulega zniszczeniu', req: 'shield' }
}

export const TECH = {
  hydro: { n: 'Ulepszona hydroponika', c: 40, d: 'Farmy +30%' },
  graph: { n: 'Panele grafenowe', c: 50, d: 'Elektrownie +30%' },
  drill: { n: 'Głębokie wiercenia', c: 60, d: 'Kopalnie +30%' },
  med: { n: 'Medycyna kosmiczna', c: 80, d: 'Przyrost +30%, słabsze epidemie' },
  auto: { n: 'Automatyzacja', c: 90, d: 'Budynki i budowy potrzebują o 25% mniej pracowników' },
  shield: { n: 'Osłony orbitalne', c: 110, d: 'Pozwala budować osłony orbitalne chroniące przed meteorytami' }
}

export const RES = { food: { n: 'Żywność', base: 4 }, min: { n: 'Minerały', base: 6 } }

export const BATCAP = 100, STBASE = 150, STCAP = 250, MAINT = 1, MORK = 0.11
export const HUNGER_MAX = 12 // po tylu dniach głodu kolonia wymiera
export const GOAL = 1000, DAYS = 365, YEAR = 2150, KEY = 'kolony-vibe-v2'

export const INFRA = ['battery', 'fridge', 'store', 'house', 'shield']
export const JOBS = ['build', 'farm', 'power', 'mine', 'rec', 'lab', 'port']
export const PRIO = [[0, 'STOP'], [1, 'NISKI'], [2, 'ŚREDNI'], [3, 'WYSOKI']]
export const TABS = [['raport', 'RAPORT'], ['budowa', 'BUDOWA'], ['praca', 'PRACA'], ['wyprawy', 'WYPRAWY'], ['rynek', 'RYNEK'], ['polityka', 'POLITYKA'], ['nauka', 'NAUKA']]
export const RATIONS = [[0.75, 'Głodowe'], [1, 'Normalne'], [1.25, 'Obfite']]
export const MDAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
export const MNAMES = ['STY', 'LUT', 'MAR', 'KWI', 'MAJ', 'CZE', 'LIP', 'SIE', 'WRZ', 'PAŹ', 'LIS', 'GRU']

export const prioOf = (s, k) => INFRA.includes(k) ? 9 : ((s.prio || {})[k] ?? 2)
export const jobName = k => k === 'build' ? 'Budowniczowie' : BLD[k].n
// pojemność magazynu danego surowca: żywność w chłodniach, minerały w magazynach minerałów
export const capOf = (s, k) => STBASE + (s.b[k === 'food' ? 'fridge' : 'store'] || 0) * STCAP

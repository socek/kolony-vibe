import { plForm } from '../../i18n.js'

// Zakładki: raport (prognoza)
export default {
  'rp.title': p => !p.d ? 'RAPORT' : p.d === 1 ? 'RAPORT Z OSTATNIEGO DNIA' : 'RAPORT Z OSTATNICH ' + p.d + ' DNI',
  'rp.forecast': 'PROGNOZA NA NASTĘPNY DZIEŃ', 'rp.eff': 'Wydajność', 'rp.build': 'Budowa', 'rp.stalled': 'stoi',
  'rp.eta': 'jeszcze {d}', 'rp.sites': 'placów budowy: {n}',
  'rp.famine': 'GŁÓD', 'rp.famineDeaths': p => 'dzień ' + p.d + '/' + p.max + ' – zginie ok. ' + p.n + ' ' + plForm(p.n, 'osoba', 'osoby', 'osób'),
  'rp.famineEnds': 'jutro się skończy', 'rp.famineHeld': 'wstrzymany racjami głodowymi (dzień {d}/{max})',
  'rp.prodUse': '{p} prod. / {u} zuż.', 'rp.season': 'Pora roku: {n}', 'rp.sun': 'słońce ×{x}', 'rp.crops': 'plony ×{x}', 'rp.heat': 'ogrzewanie {n} kWh',
  'rp.battery': 'Magazyn energii', 'rp.noBat': 'brak baterii', 'rp.charged': 'naładowane',
  'rp.deps': p => 'w złożach ' + p.t + ' t' + (p.d ? ', na ' + p.d : ''), 'rp.noDeps': 'brak złóż',
  'rp.exp': '{n} w terenie', 'rp.expBack': 'najbliższy powrót za {d}',
  'rp.fridges': 'Chłodnie', 'rp.stores': 'Magazyny minerałów', 'rp.lossFood': 'strata {n} t żywności', 'rp.lossMin': 'strata {n} t minerałów',
  'rp.money': p => 'podatki ' + p.tax + (p.trade != null ? ', handel ' + p.trade : '') + ', utrzymanie −' + p.maint,
  'rp.noProject': 'brak projektu', 'rp.defence': 'Obrona',
  'rp.defOn': 'straty od piratów i meteorytów −{n}%', 'rp.defOff': 'działa nieobsadzone – nie działają', 'rp.guns': 'sprawne działa: {n}/{max}',
  'rp.cond': 'Stan budynków', 'rp.avg': 'średnio {n}%', 'rp.broken': 'awarie: {n}', 'rp.repairs': 'naprawy {n} pkt/dzień',
  'rp.morale': '{a}% → {b}%; przy obecnych warunkach ustali się na {c}%',
  // budowa
  'bt.info': 'Zapłacone budynki trafiają na plac budowy (lista na dole). Im więcej budowniczych, tym szybciej powstają – ich liczbę ustalasz priorytetem w zakładce PRACOWNICY. Wolni budowniczowie trafiają najpierw na pierwszy plac w kolejce. Utrzymanie: {m} kr/dzień za budynek.',
  'bt.slots': 'Miejsca na budynki', 'bt.inBuild': '+{n} w budowie', 'bt.demolish': 'Rozbierz', 'bt.build': 'BUDUJ',
  'bt.cost': 'koszt {cr} kr, {mi} t min.', 'bt.workers': '{n} prac.', 'bt.workersPer': '1 prac. na {n} budynki', 'bt.energy': '{n} kWh/dzień',
  'bt.time': 'budowa {d} przy {n} budowniczych', 'bt.max': 'maks. {n}', 'bt.cond': 'stan: {n}%', 'bt.eff': 'sprawność {n}%',
  'bt.needTech': 'Wymaga technologii: {n} (zakładka TECHNOLOGIE)', 'bt.credits': 'kredyty {a}/{b}', 'bt.minerals': 'minerały {a}/{b} t',
  'bt.sites': 'PLACE BUDOWY', 'bt.builders': 'budowniczowie: {a}/{b}', 'bt.first': 'NAJPIERW', 'bt.cancel': 'ANULUJ', 'bt.cancelTitle': 'Zwrot połowy kosztów',
  // pracownicy
  'wt.able': 'Zdolni do pracy ({n}% kolonistów)', 'wt.pp': '{v} pkt proc.',
  'wt.range': 'Odsetek mieści się zawsze między {a}% a {b}%. Wysokie morale, szpitale i technologia Zautomatyzowane żłobki go podnoszą, a niskie morale i epidemie obniżają.',
  'wt.employed': 'Zatrudnieni', 'wt.unemployed': 'Bezrobotni', 'wt.missing': 'Brakuje rąk do pracy',
  'wt.info': 'Pracownicy trafiają najpierw do zadań o wysokim priorytecie. Przy równym priorytecie dzielą się po równo. STOP wyłącza budynek lub wstrzymuje budowy: nic nie produkują i nie zużywają energii, a ich ludzie zostają bez pracy.',
  'wt.spec': 'SPECJALIŚCI',
  'wt.specInfo': 'Specjalista na swoim stanowisku pracuje o 50% wydajniej. Laboratoria i szpitale obsadzają tylko naukowcy. Szkoły same kształcą specjalizację, której najbardziej brakuje do celu, a gdy wszystkie cele są osiągnięte – nie zabierają ludzi z pracy. AUTO: cel równy liczbie stanowisk w budynkach.',
  'wt.target': 'cel {n}', 'wt.manual': 'ręcznie', 'wt.posts': 'stanowisk: {n}', 'wt.lack': 'brakuje {n}',
  'wt.lower': 'Obniż cel', 'wt.raise': 'Podnieś cel', 'wt.dismiss': 'ZWOLNIJ 1', 'wt.dismissTitle': 'Zwolnij jednego specjalistę ({one} wraca do zwykłej pracy)',
  'wt.schools': p => 'Szkoły: ' + (p.rate ? '1 osoba co ' + p.rate + ' dni' : 'brak obsadzonej szkoły') + (p.now ? ', teraz kształcą: ' + p.now : p.done ? ' – cele osiągnięte, szkolenie wstrzymane' : '') + '.',
  'wt.warn': p => '⚠ Brakuje specjalistów: ' + p.n + (p.sci > 0 ? ' (w tym ' + p.sci + ' naukowców – bez nich laboratoria i szpitale nie działają w pełni)' : '') + '. ' + (p.days ? 'Przy obecnym tempie szkoły nadrobią to za ok. ' + p.days + ' dni – zbuduj kolejną szkołę albo podnieś jej priorytet.' : 'Zbuduj szkołę (albo obsadź istniejącą), żeby kształcić specjalistów.'),
  'wt.toTarget': p => 'Do celu brakuje ' + p.n + ' specjalistów' + (p.days ? ' – szkoły nadrobią to za ok. ' + p.days + ' dni.' : ' – szkoła pozwoli ich wykształcić.'),
  'wt.infra': 'Infrastruktura', 'wt.infraInfo': 'Mieszkania, chłodnie, magazyny, baterie i osłony są zawsze obsadzane jako pierwsze.',
  'wt.repairs': 'naprawy: {n} pkt/dzień', 'wt.hunt': '+{n} t żywności, ale fauna jest agresywniejsza',
  'wt.staff': '{a}/{b} prac.', 'wt.paused': 'WSTRZYMANE', 'wt.stopped': 'ZATRZYMANY'
}

// Zdarzenia z wyborem: tytuł (t), opis (d), opcje <nr>.n (nazwa), .d (znane skutki), .r/.r2/.r3 (wynik)
export default {
  'ch.lackCr': 'Brakuje kredytów.', 'ch.lackMin': 'Brakuje minerałów.', 'ch.noResearch': 'Nic nie jest badane.', 'ch.fewPop': 'Za mało kolonistów.',
  'ch.fx': p => (p.cr ? '−' + Math.abs(p.cr) + ' kr, ' : '') + (p.mor > 0 ? '+' : '−') + Math.abs(p.mor) + ' morale',
  'ch.noEffect': 'Bez skutków',

  'ch.ransom.t': 'Piraci żądają okupu',
  'ch.ransom.d': 'Statek piracki zawisł nad kolonią. Kapitan żąda {n} kr za „ochronę”. Odmowa oznacza atak.',
  'ch.ransom.0.n': 'Zapłać okup', 'ch.ransom.0.d': '−{n} kr', 'ch.ransom.0.r': 'Zapłacono {n} kr okupu. Piraci odlecieli.',
  'ch.ransom.1.n': 'Walcz', 'ch.ransom.1.d': 'Działa zmniejszają straty – bez nich piraci zabiorą więcej niż okup.',
  'ch.ransom.1.r': 'Działa odparły część ataku – piraci zrabowali {n} kr.', 'ch.ransom.1.r2': 'Bez obrony piraci splądrowali kolonię – zrabowali {n} kr.',

  'ch.sick.t': 'Uchodźcy z gorączką',
  'ch.sick.d': 'Do kolonii przyleciała grupa uchodźców. Część z nich ma wysoką gorączkę.',
  'ch.sick.0.n': 'Przyjmij', 'ch.sick.0.d': 'Nowi koloniści (jeśli jest miejsce), ale choroba może się rozprzestrzenić.',
  'ch.sick.0.r': 'Przyjęto {n} uchodźców. Gorączka szybko minęła.', 'ch.sick.0.r2': 'Przyjęto {n} uchodźców, ale choroba się rozprzestrzeniła – zmarło {d} osób.',
  'ch.sick.1.n': 'Odeślij', 'ch.sick.1.r': 'Uchodźców odesłano. Koloniści czują się z tym źle.',

  'ch.trader.t': 'Wędrowny kupiec',
  'ch.trader.d': 'Kupiec z pasa asteroid oferuje 150 t minerałów za 300 kr – taniej niż na rynku.',
  'ch.trader.0.n': 'Kup', 'ch.trader.0.d': '−300 kr, +150 t minerałów', 'ch.trader.0.r': 'Kupiono 150 t minerałów od wędrownego kupca.',
  'ch.trader.1.n': 'Odmów', 'ch.trader.1.r': 'Kupiec odleciał szukać innych klientów.',

  'ch.strike.t': 'Strajk górników',
  'ch.strike.d': 'Górnicy odłożyli kilofy i żądają premii za pracę w pyle.',
  'ch.strike.0.n': 'Wypłać premię', 'ch.strike.0.r': 'Górnicy dostali premię i wrócili do pracy w dobrych humorach.',
  'ch.strike.1.n': 'Odmów', 'ch.strike.1.r': 'Górnicy wrócili do pracy, ale niezadowolenie rośnie.',

  'ch.beacon.t': 'Sygnał z wraku',
  'ch.beacon.d': 'Radar wykrył sygnał alarmowy z rozbitego statku niedaleko kolonii.',
  'ch.beacon.0.n': 'Zbadaj wrak', 'ch.beacon.0.d': 'Może się opłacić, ale wrak bywa niebezpieczny.',
  'ch.beacon.0.r': 'Ekipa wróciła z wraku z 200 t minerałów i sprzętem wartym 100 kr.', 'ch.beacon.0.r2': 'Wrak eksplodował podczas badania – zginęło {d} kolonistów.',
  'ch.beacon.1.n': 'Zignoruj', 'ch.beacon.1.r': 'Sygnał z wraku po kilku dniach ucichł.',

  'ch.swarm.t': 'Ostrzeżenie przed rojem meteorów',
  'ch.swarm.d': 'Astronomowie wykryli rój meteorów, który jutro przetnie orbitę kolonii.',
  'ch.swarm.0.n': 'Ewakuuj ludzi do schronów', 'ch.swarm.0.d': '−5 morale, budynki bez strat', 'ch.swarm.0.r': 'Koloniści przesiedzieli noc w schronach. Rój minął kolonię bokiem.',
  'ch.swarm.1.n': 'Wzmocnij budynki', 'ch.swarm.1.d': '−150 t minerałów', 'ch.swarm.1.r': 'Wzmocnione budynki wytrzymały uderzenia odłamków.',
  'ch.swarm.2.n': 'Zaryzykuj', 'ch.swarm.2.d': 'Może nic się nie stanie… a może coś zostanie zniszczone.',
  'ch.swarm.2.r': 'Rój meteorów przeleciał bokiem. Udało się!', 'ch.swarm.2.r2': 'Meteory spadły na puste pole.', 'ch.swarm.2.r3': 'Meteory zniszczyły budynek: {n}.',

  'ch.festival.t': 'Koloniści chcą święta',
  'ch.festival.d': 'Rada kolonistów prosi o zorganizowanie Dnia Pioniera.',
  'ch.festival.0.n': 'Hucznie', 'ch.festival.0.r': 'Huczny Dzień Pioniera przejdzie do historii kolonii.',
  'ch.festival.1.n': 'Skromnie', 'ch.festival.1.r': 'Skromne, ale miłe święto poprawiło nastroje.',
  'ch.festival.2.n': 'Odmów', 'ch.festival.2.r': 'Święta nie będzie. Koloniści są zawiedzeni.',

  'ch.journalist.t': 'Dziennikarz z Ludzkiej Unii Jedności',
  'ch.journalist.d': 'Reporter imperialnej telewizji chce nakręcić materiał o kolonii.',
  'ch.journalist.0.n': 'Oprowadź po kolonii', 'ch.journalist.0.d': '−50 kr; dobry materiał może przyciągnąć osadników',
  'ch.journalist.0.r': 'Reportaż był świetny – przybyło {n} nowych kolonistów.', 'ch.journalist.0.r2': 'Reportaż wyemitowano o trzeciej w nocy. Nikt go nie widział.',
  'ch.journalist.1.n': 'Przekup, żeby pisał same dobre rzeczy', 'ch.journalist.1.r': 'Entuzjastyczny artykuł podniósł kolonistom morale.',
  'ch.journalist.2.n': 'Wyrzuć go', 'ch.journalist.2.r': 'Dziennikarz odleciał obrażony. W kolonii mówi się o cenzurze.',

  'ch.plague.t': 'Wybuch epidemii',
  'ch.plague.d': 'W kolonii szerzy się groźna choroba. Lekarze czekają na decyzję.',
  'ch.plague.0.n': 'Kwarantanna', 'ch.plague.0.d': 'Niewielkie straty w ludziach, −6 morale', 'ch.plague.0.r': 'Kwarantanna zatrzymała chorobę. Zmarło {d} osób.',
  'ch.plague.1.n': 'Leczenie za kredyty', 'ch.plague.1.d': '−300 kr, minimalne straty', 'ch.plague.1.r': 'Drogie leki uratowały większość chorych. Zmarło {d} osób.',
  'ch.plague.2.n': 'Szczepionka eksperymentalna', 'ch.plague.2.d': 'Może zadziałać idealnie… albo wcale.',
  'ch.plague.2.r': 'Szczepionka zadziałała! Nikt nie zmarł.', 'ch.plague.2.r2': 'Szczepionka nie zadziałała. Zmarło {d} osób.',
  'ch.plague.3.n': 'Nic nie rób', 'ch.plague.3.d': 'Duże straty w ludziach', 'ch.plague.3.r': 'Epidemia przeszła przez kolonię. Zmarło {d} osób.',

  'ch.smugglers.t': 'Przemytnicy',
  'ch.smugglers.d': 'Podejrzany frachtowiec proponuje towary „bez zbędnych pytań”.',
  'ch.smugglers.0.n': 'Kup działo', 'ch.smugglers.0.d': '−250 kr, +1 działo magnetyczne', 'ch.smugglers.0.r': 'Przemytnicy zostawili gotowe działo magnetyczne.',
  'ch.smugglers.1.n': 'Kup nasiona', 'ch.smugglers.1.d': '−150 kr, +120 t żywności', 'ch.smugglers.1.r': 'Przemycone nasiona dały szybki plon: +120 t żywności.',
  'ch.smugglers.2.n': 'Kup dane naukowe', 'ch.smugglers.2.d': '−200 kr, +30 pkt do bieżących badań', 'ch.smugglers.2.r': 'Wykradzione dane przyspieszyły badania: {n} +30 pkt.',
  'ch.smugglers.3.n': 'Przegoń ich', 'ch.smugglers.3.r': 'Przemytnicy odlecieli, przeklinając pod nosem.',

  'ch.gift.t': 'List od Imperatora',
  'ch.gift.d': 'Kancelaria Imperatora Gały przypomina, że każda kolonia przysyła prezent na Jubileusz. Termin: wczoraj.',
  'ch.gift.0.n': 'Ręcznie przepisana książka', 'ch.gift.0.r': 'Kopiści przepisali „Kodeks drogowy Unii”. Imperator podobno się wzruszył.',
  'ch.gift.1.n': 'Skrzynia minerałów', 'ch.gift.1.d': '−200 t minerałów, nagroda 400 kr', 'ch.gift.1.r': 'Imperator docenił skrzynię minerałów i odesłał 400 kr nagrody.',
  'ch.gift.2.n': 'Delegacja kolonistów', 'ch.gift.2.d': '−10 kolonistów, nagroda 600 kr', 'ch.gift.2.r': 'Delegacja zostanie na dworze na zawsze. Kancelaria przysłała 600 kr „na otarcie łez”.',
  'ch.gift.3.n': 'Wiersz napisany przez dzieci', 'ch.gift.3.d': 'Za darmo – ale gust Imperatora jest nieprzewidywalny.',
  'ch.gift.3.r': 'Imperator recytował wiersz na balu! Koloniści pękają z dumy.', 'ch.gift.3.r2': 'Imperator uznał wiersz za „zbyt awangardowy”. Wstyd na całą galaktykę.',
  'ch.gift.4.n': 'Nic nie wysyłaj', 'ch.gift.4.r': 'Kolonia nie wysłała prezentu. Plotki o tym krążą po całej Unii.'
}

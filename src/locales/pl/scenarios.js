// Scenariusze: nazwy, zleceniodawcy, historie, cele, wygrane, zdarzenia scenariuszowe; poziomy trudności i pory roku
export default {
  'diff.easy': 'ŁATWY', 'diff.normal': 'NORMALNY', 'diff.hard': 'TRUDNY',
  'season.winter': 'ZIMA', 'season.spring': 'WIOSNA', 'season.summer': 'LATO', 'season.autumn': 'JESIEŃ', 'season.eternal': 'WIECZNA ZIMA',
  'sc.goal.pop': '{n} kolonistów', 'sc.goal.popShort': 'CEL: {n} OSÓB', 'sc.st.pop': 'koloniści {a}/{n}',
  'sc.na': 'Niedostępne w tym scenariuszu.', 'sc.noSlotsSplash': 'Brak miejsca na budynki – zbuduj platformę pływającą.', 'sc.noSlotsSill': 'Brak miejsca na budynki – zbuduj moduł stacji.',
  'sc.and': ' i ',

  'sc.moon.n': 'Księżyc Jowisz-67',
  'sc.moon.patron': 'Specjalny Doradca Imperatora do spraw Rozpowszechniania Czytania Książek wśród Obywateli Niechętnych Czytaniu',
  'sc.moon.story': [
    'Na Jubileusz przylecą miliardy gości, a Imperator nie zniesie myśli, że w kolejce do toalety nie będą mieli czego czytać.',
    'Księżyc Jowisz-67 ma się stać Wielką Biblioteką Jubileuszową. Wszystkie książki ludzkości trzeba przepisać ręcznie – bo „tak jest bardziej uroczyście” – a do tego potrzeba mnóstwa kolonistów.'
  ],
  'sc.moon.win': 'Biblioteka Jubileuszowa tętni życiem: tysiąc kopistów przepisuje książki dzień i noc. Specjalny Doradca płacze ze wzruszenia nad pierwszym tomem „Instrukcji obsługi tostera” przepisanym kaligrafią.',
  'sc.moon.features': 'Klasyczna rozgrywka: bez pór roku i bez fauny.',

  'sc.purr.n': 'Planeta Mruczysko',
  'sc.purr.patron': 'Nadzwyczajny Pełnomocnik Imperatora do spraw Zwierząt Puszystych, Mniej Puszystych oraz Tych, Co do Których Puszystości Trwa Spór Naukowy',
  'sc.purr.story': [
    'Imperator zażyczył sobie na urodziny mini zoo z „czymś, co mruczy, ale nie jest kotem”. Na Mruczysku żyją mruczki – nikt nie wie, czy są groźne, bo jeszcze nikt nie podszedł bliżej.',
    'Planeta ma pory roku, a jej fauna potrafi zapylić twoje uprawy albo je zjeść. Zbuduj zagrody, oswój mruczki i nie daj się stadu, które właśnie wybiera się na wiosenną migrację.'
  ],
  'sc.purr.goal': '600 kolonistów i 50 oswojonych mruczków', 'sc.purr.short': 'CEL: 600 OSÓB, 50 MRUCZKÓW', 'sc.purr.status': 'koloniści {a}/600 · mruczki {b}/50',
  'sc.purr.win': 'Pięćdziesiąt mruczków jedzie w luksusowych kontenerach na Jubileusz. Nadzwyczajny Pełnomocnik ogłasza, że spór naukowy o ich puszystość rozstrzygnięto: są puszyste. Bardzo.',
  'sc.purr.features': 'Pory roku, fauna lokalna, zagrody i myśliwi.',
  'sc.purr.f.bugs': '★ Fauna: rój świetlików zapylił uprawy – +60 t żywności.', 'sc.purr.f.trail': 'przy szlaku mruczków',
  'sc.purr.f.dep': '★ Fauna: mruczki wydeptały ścieżkę do nowego złoża – {n}, {a} t.',
  'sc.purr.f.stray': '★ Fauna: przybłąkany mruczek sam wszedł do zagrody!',
  'sc.purr.f.purr': '★ Fauna: stado mruczków mruczało całą noc pod kopułą – koloniści są zachwyceni (+2 morale).',
  'sc.purr.b': 'Fauna: {txt}.', 'sc.purr.b.food': 'stado splądrowało zapasy – stracono {l} t żywności', 'sc.purr.b.mine': 'mruczki uwiły gniazdo w kopalni – awaria',
  'sc.purr.b.exp': 'fauna zaatakowała wyprawę w terenie – zginęło {l} uczestników', 'sc.purr.b.bld': 'stado stratowało budynek: {n}',
  'sc.purr.b.empty': 'stado przebiegło przez pustą kolonię', 'sc.purr.b.fence': 'stado szarżowało na kolonię, ale ogrodzenie soniczne je odstraszyło',
  'sc.purr.b.fenceLost': '; zniszczone zostało ogrodzenie soniczne',

  'sc.ticktock.n': 'Asteroida Tik-Tak',
  'sc.ticktock.patron': 'Główny Chronometrysta Dworu do spraw Punktualności, Spóźnień Usprawiedliwionych oraz Kalendarzy Ściennych z Ładnymi Obrazkami',
  'sc.ticktock.story': [
    'Imperator obawia się, że jedna doba nie wystarczy, żeby przyjąć życzenia od wszystkich gości. Zażądał technologii, która rozciągnie dzień Jubileuszu do 48 godzin.',
    'Asteroida Tik-Tak jest pełna anomalii czasowych – idealne miejsce na laboratorium. Albo najgorsze. Naukowcy wciąż się kłócą, bo dla każdego z nich minęło już inaczej dużo czasu.'
  ],
  'sc.ticktock.goal': 'zbadać Rozciągacz Doby i mieć 300 kolonistów', 'sc.ticktock.short': 'CEL: ROZCIĄGACZ DOBY',
  'sc.ticktock.status': p => 'Rozciągacz Doby: ' + (p.done ? 'zbadany' : 'nie') + ' · koloniści ' + p.a + '/300',
  'sc.ticktock.win': 'Rozciągacz Doby działa! Dzień Jubileuszu potrwa 48 godzin. Główny Chronometrysta przez pomyłkę rozciągnął też swój urlop – na zawsze.',
  'sc.ticktock.features': 'Scenariusz badawczy: anomalie czasu, mało złóż, słabe farmy.',
  'sc.ticktock.a.repeat': '★ Anomalia czasu: dzień się powtórzył – zyskujesz dodatkowy dzień kadencji!',
  'sc.ticktock.a.future': '★ Anomalia czasu: laboratorium dostało wyniki badań z przyszłości – {n} +{p} pkt.',
  'sc.ticktock.a.lost': 'Anomalia czasu: cały dzień przepadł w pętli – kadencja jest krótsza o dzień.',
  'sc.ticktock.a.back': 'Anomalia czasu: laboratorium cofnęło się w czasie – {n} −{p} pkt.',

  'sc.splash.n': 'Planeta Chlupotka',
  'sc.splash.patron': 'Wielki Mistrz Ceremonii Rekreacyjno-Sportowych Jego Wysokości, Kawaler Orderu Złotego Kija',
  'sc.splash.story': [
    'Imperator chce zagrać na Jubileuszu w golfa – ale na wodzie, bo „na trawie grają wszyscy”. Chlupotka ma dużo wody i prawie nic poza nią.',
    'Lądu jest tyle, co kot napłakał, więc każdy budynek się liczy – a nowe miejsca dadzą tylko pływające platformy. Złóż na lądzie prawie nie ma, za to morze daje wodorosty. I sztormy.'
  ],
  'sc.splash.goal': '18 pływających dołków golfowych i 400 kolonistów', 'sc.splash.short': 'CEL: 18 DOŁKÓW', 'sc.splash.status': 'dołki {a}/18 · koloniści {b}/400',
  'sc.splash.win': 'Imperator trafił do dołka za pierwszym razem – piłka popłynęła sama. Wielki Mistrz Ceremonii otrzymał Order Złotego Kija z Wodorostami.',
  'sc.splash.features': 'Mało lądu, farmy wodorostów, sztormy, platformy pływające.',
  'sc.splash.storm': 'SZTORM! Fale uszkodziły: {n}', 'sc.splash.stormNone': 'SZTORM! Na szczęście fale nic nie uszkodziły',
  'sc.splash.golfLost': '; jeden dołek golfowy odpłynął w siną dal',

  'sc.sill.n': 'Stacja Parapet-3',
  'sc.sill.patron': 'Pierwszy Zastępca Wicekanclerza do spraw Widoków z Okna i Ogólnej Malowniczości Horyzontu',
  'sc.sill.story': [
    'Imperator chce oglądać jubileuszowe fajerwerki z miejsca, z którego widać je wszystkie naraz. Takie miejsce jest tylko na orbicie – trzeba tam postawić stację z najlepszym parapetem w galaktyce.',
    'Na stacji nie ma gruntu, więc nie ma też kopalń – minerały przywiozą tylko wyprawy na asteroidy albo kupisz je na rynku. Miejsca jest mało, a każde rozszczelnienie to prawdziwy kłopot.'
  ],
  'sc.sill.goal': 'Imperialna Galeria Widokowa i 500 kolonistów', 'sc.sill.short': 'CEL: GALERIA WIDOKOWA',
  'sc.sill.status': p => 'galeria: ' + { done: 'gotowa', build: 'w budowie', no: 'nie' }[p.st] + ' · koloniści ' + p.a + '/500',
  'sc.sill.win': 'Z Galerii Widokowej widać wszystkie fajerwerki naraz. Imperator zachwycony – tylko Pierwszy Zastępca Wicekanclerza narzeka, że parapet jest odrobinę za wąski na jego łokcie.',
  'sc.sill.features': 'Stacja orbitalna: bez kopalń, rozszczelnienia, mało miejsca.',
  'sc.sill.breach': p => 'ROZSZCZELNIENIE! Jeden z modułów stracił powietrze' + (p.n ? ' – zginęło ' + p.n + ' kolonistów' : ' – inżynierowie zdążyli uszczelnić go na czas') + '.',

  'sc.ice.n': 'Glob Kostkolód',
  'sc.ice.patron': 'Sekretarz Stanu do spraw Napojów Chłodzonych, Lodu Ceremonialnego oraz Słomek Okolicznościowych',
  'sc.ice.story': [
    'Przy Jubileuszu Imperator wzniesie toast, a jego napój musi być schłodzony lodem „z najczystszego zamarzniętego świata w galaktyce”.',
    'Problem w tym, że na Kostkolodzie jest tak zimno, że lód trzeba najpierw rozmrozić, oczyścić i zamrozić ponownie. Wieczna zima pożera energię na ogrzewanie, a słońce ledwo świeci – za to pod lodem leżą bogate złoża.'
  ],
  'sc.ice.goal': 'wysłać 2000 t Lodu Ceremonialnego', 'sc.ice.short': 'CEL: 2000 T LODU', 'sc.ice.status': 'Lód Ceremonialny {a}/2000 t',
  'sc.ice.win': 'Imperator wzniósł toast, a lód zadzwonił o kryształ jak dzwoneczki. Sekretarz Stanu do spraw Napojów Chłodzonych dostał awans na Sekretarza Stanu do spraw Wszystkich Napojów.',
  'sc.ice.features': 'Wieczna zima, kosztowne ogrzewanie, słabe słońce, bogate złoża.'
}

// Scenariusze: każdy ma własny cel, historię i stały poziom trudności (mnożnik wyniku).
// Wspólna fabuła: przygotowania do setnych urodzin Imperatora Ludzkiej Unii Jedności.

export const DIFF = {
  easy: { n: 'ŁATWY', mult: 1, color: 'var(--green)' },
  normal: { n: 'NORMALNY', mult: 1.5, color: 'var(--yellow)' },
  hard: { n: 'TRUDNY', mult: 2, color: 'var(--red)' }
}

export const PROLOGUE = 'Jego Wysokość Imperator Ludzkiej Unii Jedności obchodzi wkrótce setne urodziny i zapowiedział „Najwspanialszy Jubileusz w Dziejach Ludzkości”. Każdy z jego dworzan dostał do przygotowania jeden element uroczystości – i każdy uznał, że najlepiej będzie założyć w tym celu nową kolonię. Ty zostajesz jej gubernatorem.'

const popGoal = n => ({
  text: n + ' kolonistów',
  short: 'CEL: ' + n + ' OSÓB',
  progress: s => Math.min(100, s.pop / n * 100),
  done: s => s.pop >= n
})

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
    k: 'purr', n: 'Planeta Mruczysko', diff: 'normal', ready: false,
    patron: 'Nadzwyczajny Pełnomocnik Imperatora do spraw Zwierząt Puszystych, Mniej Puszystych oraz Tych, Co do Których Puszystości Trwa Spór Naukowy',
    story: ['Imperator zażyczył sobie na urodziny mini zoo z „czymś, co mruczy, ale nie jest kotem”. Na Mruczysku żyją mruczki – nikt nie wie, czy są groźne, bo jeszcze nikt nie podszedł bliżej.'],
    goal: popGoal(600), features: 'Pory roku i fauna lokalna.'
  },
  {
    k: 'ticktock', n: 'Asteroida Tik-Tak', diff: 'normal', ready: false,
    patron: 'Główny Chronometrysta Dworu do spraw Punktualności, Spóźnień Usprawiedliwionych oraz Kalendarzy Ściennych z Ładnymi Obrazkami',
    story: ['Imperator obawia się, że jedna doba nie wystarczy, żeby przyjąć życzenia od wszystkich gości. Zażądał technologii, która rozciągnie dzień Jubileuszu do 48 godzin.'],
    goal: popGoal(300), features: 'Scenariusz badawczy z anomaliami czasu.'
  },
  {
    k: 'splash', n: 'Planeta Chlupotka', diff: 'hard', ready: false,
    patron: 'Wielki Mistrz Ceremonii Rekreacyjno-Sportowych Jego Wysokości, Kawaler Orderu Złotego Kija',
    story: ['Imperator chce zagrać na Jubileuszu w golfa – ale na wodzie, bo „na trawie grają wszyscy”.'],
    goal: popGoal(400), features: 'Planeta oceaniczna, sztormy, mało lądu.'
  },
  {
    k: 'sill', n: 'Stacja Parapet-3', diff: 'hard', ready: false,
    patron: 'Pierwszy Zastępca Wicekanclerza do spraw Widoków z Okna i Ogólnej Malowniczości Horyzontu',
    story: ['Imperator chce oglądać jubileuszowe fajerwerki z miejsca, z którego widać je wszystkie naraz.'],
    goal: popGoal(500), features: 'Stacja orbitalna bez kopalń, rozszczelnienia.'
  },
  {
    k: 'ice', n: 'Glob Kostkolód', diff: 'hard', ready: false,
    patron: 'Sekretarz Stanu do spraw Napojów Chłodzonych, Lodu Ceremonialnego oraz Słomek Okolicznościowych',
    story: ['Napój do imperialnego toastu musi być schłodzony lodem „z najczystszego zamarzniętego świata w galaktyce”.'],
    goal: popGoal(400), features: 'Wieczna zima, kosztowne ogrzewanie, bogate złoża.'
  }
]

export const scenarioOf = s => SCENARIOS.find(x => x.k === ((s && s.sc) || 'moon'))
export const diffOf = s => DIFF[scenarioOf(s).diff]

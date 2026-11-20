export const VERSION = '0.3', CODENAME = 'Merveil'
// wersja w trakcie zmian – pokazywane przy numerze wersji
export const IN_DEV = true
export const versionLabel = (upper = false) => {
  const t = VERSION + ' „' + CODENAME + '”' + (IN_DEV ? ' (in development)' : '')
  return upper ? t.toUpperCase() : t
}

export const CHANGELOG = [
  {
    v: '0.3 „Merveil” (in development)', d: 'w przygotowaniu', items: [
      'Zakładka STATYSTYKI: wykresy wszystkich zasobów dzień po dniu, wybór zakresu, znaczniki wydarzeń, ukrywanie serii.',
      'Wyniki i odznaki (menu → WYNIKI I ODZNAKI): tabela najlepszych gier ze wszystkimi szczegółami i 10 odznak wspólnych dla wszystkich scenariuszy. Ekran końca gry pokazuje miejsce w tabeli i ma przycisk do statystyk.',
      'Zdarzenia z wyborem: 11 nowych sytuacji (od 2 do 5 opcji), np. okup piratów, strajk górników, epidemia, list od Imperatora. Czas stoi, dopóki nie podejmiesz decyzji; w ustawieniach można ustawić odpowiedzi automatyczne.',
      'Scenariusze: nowa gra zaczyna się od wyboru scenariusza. Każdy ma własny cel, historię i poziom trudności, który mnoży wynik. Pierwszy scenariusz: Księżyc Jowisz-67 (łatwy).',
      'Wspólna fabuła: przygotowania do setnych urodzin Imperatora Ludzkiej Unii Jedności.',
      'Nowe drzewo technologii: 17 technologii w 6 gałęziach, z wymaganiami, pokazane jako schemat blokowy (na telefonie jako lista).',
      'Kolejka badań – naukowcy badają kolejne technologie po sobie.',
      'Nowe technologie: krioprzechowalnictwo, synteza białka (syntezator żywności), superkondensatory, moduły piętrowe, holorozrywka, systemy celownicze, sonary geologiczne, łaziki terenowe, giełda międzygwiezdna, propaganda holograficzna.',
      'Pas wulkaniczny, Pole meteorytowe i Loteria biletów kolonijnych wymagają teraz technologii.',
      'Ikonka gry w karcie przeglądarki.',
      'Gra zapisuje się od razu po każdym dniu, a nie dopiero po animacji.',
      'Gra jest otwartoźródłowa (licencja GNU AGPL v3) – link do kodu na ekranie „O grze”.',
      'Gra działa offline i można ją zainstalować na telefonie jak aplikację (PWA). Czcionki są wbudowane w grę.'
    ]
  },
  {
    v: '0.2 „Tukohama”', d: '19.11.2026', items: [
      'Zakładka NAUKA nazywa się TECHNOLOGIE.',
      'Aeroponika, ogniwa grafenowe i wiertła głębinowe odblokowują nowe budynki (farma aeroponiczna, elektrownia grafenowa, kopalnia głębinowa) zamiast premii +30%.',
      'Budynki wymagające nieodkrytej technologii są wyszarzone na liście budowy.',
      'Działa magnetyczne (nowa technologia i budynek obronny) – zmniejszają straty od piratów i meteorytów, ale tylko obsadzone; atak może część z nich zniszczyć.',
      'Budynki na liście budowy pogrupowane: żywność, przemysł i nauka, ludność, obrona.',
      'Menu ułożone pionowo.',
      'Kampanie reklamowe w zakładce POLITYKA – kosztują kredyty i trwają określony czas, w którym mogą przybyć nowi koloniści. Skuteczność każdej kampanii jest ukryta.',
      'Głód trwa najwyżej 12 dni – z każdym dniem umiera więcej osób, a 12. dnia giną wszyscy. Kończy go dzień pełnego jedzenia; racje głodowe tylko wstrzymują umieranie.',
      'Złoża minerałów się wyczerpują – kopalnie wydobywają z nich kolejno. Nowe złoża znajdują wyprawy w nowej zakładce WYPRAWY (cel, liczebność ekipy, koszt, szansa, ryzyko).',
      'Osiem celów wypraw – od bezpiecznej bliskiej okolicy po ryzykowny pas wulkaniczny i odległe pole meteorytowe.',
      'Osobne magazyny: chłodnie na żywność i magazyny minerałów na minerały.',
      'Wszystkie odkryte złoża to złoża minerałów.',
      'Kafelek Minerały pokazuje stan złóż i na ile dni wystarczą.',
      'Zdarzenie „złoże kryształów” dodaje nowe złoże zamiast jednorazowych minerałów.',
      'Tura to jeden dzień, gra trwa rok (365 dni). Data i liczba pozostałych dni w nagłówku.',
      'Budowa trwa – im większy budynek, tym dłużej. Budowniczowie z priorytetem w zakładce PRACA, kolejka placów budowy z przyciskami NAJPIERW i ANULUJ.',
      'Przycisk ▶▶ 7 DNI – przewija tydzień i zatrzymuje się przy ważnych wydarzeniach.',
      'Raport z wielu dni sumuje liczby (np. zmarnowana energia, narodziny) i podaje, przez ile dni coś trwało. Tytuł raportu mówi, ilu dni dotyczy.',
      'Uchodźcy przybywają tylko, gdy jest dla nich miejsce.',
      'Zdarzenie „awaria systemu podtrzymywania życia” nazywa się teraz „awaria zasilania”.',
      'Wydajność na górze prognozy, opis paska kadencji.',
      'Paski kosztu budowy (kredyty i minerały) – przyciski nie skaczą przy klikaniu.',
      'Gra nazywa się Kolony Vibe (bez „8,1”).',
      'Lista zmian w menu.',
      'Komunikat „Przewijanie zatrzymane” jest czerwony, mruga i podaje powód.',
      'Ustawienia w menu (≡) – wybierasz, które wydarzenia zatrzymują przewijanie (m.in. nowe: brak rąk do pracy, stojąca budowa, pełne magazyny, zadłużenie).'
    ]
  },
  {
    v: '0.1 Prototyp', d: '19.11.2026', items: [
      'Pierwsza wersja: kolonia na odległej planecie w stylu C64, tura to miesiąc, 10 lat na 1000 kolonistów.',
      'Priorytety pracowników (STOP / NISKI / ŚREDNI / WYSOKI) w zakładce PRACA.',
      'Badania jako projekty – wybierasz technologię, naukowcy dokładają postęp co turę.',
      'Osłony orbitalne jako budynek odblokowywany technologią; każda chroni przed jednym deszczem meteorytów.',
      'Pikselowe ikonki budynków i zasobów, jednostki: kWh, tony, kredyty.',
      'Animacja końca tury, czytelniejsza prognoza morale, liczba brakujących pracowników w raporcie.',
      'Ekran „O grze”.'
    ]
  }
]

# Propozycje funkcjonalności

Lista do dopracowania. Po ustaleniu ostatecznej wersji – implementacja.

## Rozgrywka

### 1. Zdarzenia z wyborem
Część zdarzeń losowych zamiast dziać się automatycznie daje graczowi decyzję, np.:
- piraci żądają okupu 200 kr – zapłacić czy walczyć (wtedy liczą się działa),
- uchodźcy mogą przywlec chorobę – przyjąć czy odesłać.

Ustalenia:
- Zdarzenia mają od 2 do 5 wyborów – tyle, ile ma sens dla danej sytuacji.
- Im więcej wyborów, tym mniej typów takich zdarzeń (najwięcej zdarzeń z 2 wyborami, najmniej z 5).
- Zostają też zdarzenia bez wyboru (jak obecne).
- Decyzji nie da się zignorować – gra czeka, aż gracz wybierze.
- Przewijanie domyślnie zatrzymuje się na zdarzeniu z wyborem.
- W ustawieniach można dla zdarzenia ustawić automatyczną odpowiedź – wtedy przewijanie się nie zatrzymuje.

### 2. Zamówienia Ludzkiej Unii Jedności (LUJ)
Kontrakty typu „dostarcz 300 t minerałów do dnia 120 – nagroda 800 kr i 20 kolonistów”.
Cele pośrednie między „przetrwać” a „1000 osób”; rynek staje się czymś więcej niż wyprzedażą nadwyżek.

Ustalenia:
- Zamówienia zleca Ludzka Unia Jedności (LUJ), nie Ziemia.
- Zamówienia pojawiają się same co jakiś czas.
- Rodzaje zamówień (różne):
  - dostawa żywności,
  - dostawa minerałów,
  - dostawa energii (przez port),
  - wysłanie kolonistów (np. „wyślij 10 osób do innej kolonii”),
  - zbadanie technologii dla LUJ.
- Różne terminy i różne kary za niewykonanie: brak kary (tylko utrata nagrody), utrata kredytów, spadek morale / reputacji.
- Różne nagrody: kredyty, koloniści, technologia, budynek albo ich mieszanka.

### 3. Zużycie budynków
Budynki z czasem się psują i tracą wydajność, dopóki nie zostaną naprawione.
Nowe zajęcie dla pracowników i koszt utrzymania rosnący z kolonią.

Ustalenia:
- Budynki zużywają się stopniowo (stan spada z czasem).
- Im gorszy stan, tym większa szansa na awarię całego budynku.
- Naprawy wykonuje osobna pula pracowników (konserwatorzy) z własnym priorytetem w zakładce PRACA.
- Budynek całkowicie zużyty rozpada się – trzeba go zbudować od nowa.

### 4. Specjaliści
Szpital (słabsze epidemie, mniej zgonów z głodu) i szkoła kształcąca naukowców i inżynierów.
Laboratoria i działa wymagają wykwalifikowanej obsady, a nie dowolnych kolonistów.

Ustalenia:
- Na razie trzy specjalizacje:
  - Naukowcy,
  - Inżynierowie – premia do budowy i napraw,
  - Żołnierze.
- Laboratorium i szpital mogą obsadzać tylko specjaliści.
- Pozostałe budynki mogą obsadzać zwykli koloniści, ale wtedy działają z mniejszą sprawnością niż przy obsadzie specjalistów.
- Specjalistów kształci szkoła.

### 5. Więcej z wypraw
Wyprawy oprócz złóż mogą znajdować:
- ruiny z punktami badań,
- wraki ze sprzętem,
- ślady innych osadników (rzadkie zdarzenie kontaktu).

Ustalenia:
- Wyprawa ma wybrany cel poszukiwań (złoża, ruiny, wraki, osadnicy). Daje on wysoką szansę na znalezienie tej konkretnej rzeczy i bardzo niską szansę na znalezienie przy okazji czegoś innego.
- Wraki dają kredyty, minerały albo części do technologii.
- Kontakt z innymi osadnikami może skończyć się:
  - jednorazowym zdarzeniem (handel, przyłączenie się kolonistów, konflikt),
  - albo odkryciem stałej sąsiedniej osady, z którą można handlować.
- Wyprawy korzystają ze specjalistów: żołnierze zmniejszają ryzyko strat, inżynierowie zwiększają zysk z wraków.

## Czytelność i wygoda

### 6. Wykresy historii
Ludność, morale, żywność i kredyty dzień po dniu, w stylu C64.

Ustalenia:
- Nowa zakładka ze statystykami.
- Wykresy pokazują wszystko, co jest na kafelkach: koloniści, morale, żywność, energia, minerały, złoża, kredyty, badania, pracownicy.
- Wybór zakresu czasu (np. ostatnie 30 dni / cały rok).
- Na wykresie widać ważne wydarzenia (głód, piraci, ukończone budowy itp.).
- Każdy element wykresu (każdą serię danych i znaczniki wydarzeń) można osobno wyłączyć.
- Na ekranie końca gry jest przycisk do obejrzenia statystyk.

### 7. Podpowiedzi na start
Kilka kroków samouczka w pierwszych dniach (np. „brakuje rąk do pracy – sprawdź zakładkę PRACA”).

Ustalenia:
- Podpowiedzi kontekstowe – pojawiają się, gdy coś dzieje się pierwszy raz (pierwszy brak rąk do pracy, pierwszy głód, pierwsza wyczerpana kopalnia itp.).
- Podpowiedź wyświetla się w okienku.
- Okienko ma przycisk „nie pokazuj więcej” (wyłącza tę konkretną podpowiedź).
- W ustawieniach jest przełącznik włączający / wyłączający wszystkie podpowiedzi.

### 8. Poziomy trudności
Łatwy / normalny / trudny: inne zapasy startowe, częstość zdarzeń, cel.

Ustalenia:
- Nie ma osobnego wyboru poziomu trudności – trudność wynika ze scenariusza (punkt 13).
- Każdy scenariusz ma jeden, konkretny poziom trudności.
- Poziom trudności mnoży wynik końcowy.

### 9. Tabela wyników i osiągnięcia
Lokalna lista najlepszych gier i odznaki (np. „przetrwał głód”, „5 wypraw bez strat”).

Ustalenia:
- Wszystko zapisywane lokalnie (w przeglądarce), bez serwera.
- Odznaki są niezależne od scenariuszy – wspólne dla wszystkich.
- Jedna wspólna tabela wyników z kolumną „scenariusz”.
- Przy wyniku zapisywane jest wszystko, co się da: data, scenariusz, poziom trudności, wynik, liczba kolonistów, dzień zakończenia, wygrana/przegrana i powód, morale, kredyty, technologie, zdobyte w tej grze odznaki itp.
- Wyniki widać w dwóch miejscach:
  - ekran „WYNIKI” w menu,
  - podgląd na ekranie końca gry (np. „twój wynik to 3. miejsce”).
- Na start 10 odznak.
- Wszystkie odznaki są jawne od początku, z opisem, co trzeba zrobić.

## Techniczne

### 10. Testy (Vitest + testy w przeglądarce)
Logika jest oddzielona od Vue, więc łatwo ją testować. Ochrona przed psuciem powiązanych mechanik (głód, złoża, przewijanie, priorytety) przy kolejnych zmianach.

Ustalenia:
- Zakres: całość – logika gry (`src/game/`) i komponenty Vue.
- Testy powstają od razu, jako pierwszy krok przed resztą listy, a potem na bieżąco z każdą nową funkcjonalnością.
- Testy w przeglądarce (dotąd robione ręcznie w Chromium) zapisane jako stałe testy całej gry (np. Playwright).

### 11. Publikacja na GitHub Pages + tryb offline (PWA)
Gra dostępna pod linkiem, instalowalna na telefonie.

Ustalenia:
- Publiczne repozytorium `kolony-vibe` na GitHubie, na koncie autora.
- Publikacja tylko na GitHub Pages – bez innych miejsc.
- PWA: wszystko działa offline (także czcionki – dołączone do gry zamiast ładowania z Google Fonts).
- Publikacja automatyczna przez GitHub Actions po każdej zmianie na `main` (po przejściu testów).

### 12. Muzyka chiptune
Kilka prostych melodii w stylu SID, generowanych tym samym Web Audio co dźwięki.

Ustalenia:
- Muzyka gra w tle przez całą grę.
- Różne motywy zależnie od sytuacji (np. spokojny, kryzys/głód, zwycięstwo, przegrana).
- Liczba melodii – według uznania przy implementacji.
- Własne, oryginalne kompozycje (bez melodii z istniejących gier).
- Osobny przełącznik muzyki w ustawieniach (niezależny od efektów dźwiękowych).

## Technologie

### 14. Rework technologii
Więcej technologii i drzewo technologii pokazane jako schemat blokowy.

Ustalenia:
- Na początek ok. 15 technologii; drzewo będzie się rozrastać razem z kolejnymi funkcjonalnościami (specjaliści, wyprawy, scenariusze itd.).
- Drzewo podzielone na gałęzie (np. Żywność, Przemysł i nauka, Ludność, Obrona, Wyprawy, Handel i polityka).
- Technologia może wymagać kilku wcześniejszych naraz.
- Jak najwięcej rodzajów efektów: nowe budynki, premie do istniejących, odblokowanie funkcji (cele wypraw, kampanie, opcje handlu), ulepszenia obrony itp.
- Kolejka badań – projekty badane kolejno jeden po drugim, laboratoria nie stoją po ukończeniu projektu.
- Zakładka TECHNOLOGIE pokazuje drzewo jako schemat blokowy (bloki połączone strzałkami wymagań); na telefonie zamiast schematu – lista.
- Blok technologii pokazuje: nazwę, koszt, pasek postępu i stan (odkryta / badana / w kolejce / dostępna / zablokowana); szczegóły po kliknięciu.
- Scenariusze mogą zmieniać drzewo (dodawać, usuwać lub zmieniać technologie).

## Scenariusze

### 13. Scenariusze
Gra oferuje 6 scenariuszy, wszystkie dostępne od razu. Każdy ma dwuczłonową nazwę, stały poziom trudności (mnoży wynik końcowy – punkt 8), własny cel i własną historię. Scenariusze mogą dowolnie zmieniać zasady gry.

Mnożniki wyniku (propozycja): łatwy ×1, normalny ×1,5, trudny ×2.

#### Wspólna fabuła
Jego Wysokość Imperator Ludzkiej Unii Jedności obchodzi wkrótce swoje setne urodziny i zapowiedział „Najwspanialszy Jubileusz w Dziejach Ludzkości”. Każdy z jego dworzan dostał do przygotowania jeden element uroczystości – i każdy postanowił, że najlepiej będzie do tego założyć nową kolonię. Gracz jest gubernatorem kolejnych kolonii zakładanych przez tych dworzan. Zlecenia z punktu 2 (LUJ) mogą nawiązywać do przygotowań do Jubileuszu.

#### Księżyc Jowisz-67 – łatwy
- Zleca: **Specjalny Doradca Imperatora do spraw Rozpowszechniania Czytania Książek wśród Obywateli Niechętnych Czytaniu**.
- Historia: na Jubileusz przylecą miliardy gości, a Imperator nie zniesie myśli, że w kolejce do toalety nie będą mieli czego czytać. Kolonia ma się stać Wielką Biblioteką Jubileuszową – potrzebuje mnóstwa kolonistów, którzy przepiszą wszystkie książki ręcznie.
- Cel: 1000 kolonistów w ciągu roku (obecna gra).
- Zasady: obecna gra, bez pór roku i bez fauny.

#### Planeta Mruczysko – normalny
- Zleca: **Nadzwyczajny Pełnomocnik Imperatora do spraw Zwierząt Puszystych, Mniej Puszystych oraz Tych, Co do Których Puszystości Trwa Spór Naukowy**.
- Historia: Imperator zażyczył sobie na urodziny mini zoo z „czymś, co mruczy, ale nie jest kotem”. Na Mruczysku żyją mruczki – nikt nie wie, czy są groźne, bo jeszcze nikt nie podszedł bliżej.
- Cel (propozycja): 600 kolonistów i oswojenie 50 mruczków do imperialnego zoo.
- Pory roku:
  - wiosna – początek sezonu wegetacji, migracje fauny,
  - lato – pełna moc elektrowni słonecznych, burze pyłowe,
  - jesień – zbiory (farmy wydajniejsze), fauna robi zapasy i podkrada jedzenie,
  - zima – elektrownie słoneczne słabsze, ogrzewanie zużywa prąd, farmy wolniejsze.
- Fauna lokalna – zdarzenia pomocne i szkodliwe:
  - pomocne: zwierzęta zapylają uprawy (więcej żywności), wydeptują ścieżki do złóż (łatwiejsze wyprawy), przybłąkane zwierzę do oswojenia,
  - szkodliwe: plądrowanie farm i chłodni, gniazda w kopalniach (przestój), atak na wyprawę, stado tratujące budynek.
- Nowy budynek obronny: **Ogrodzenie soniczne** – zmniejsza straty od szkodliwej fauny (działa jak działa magnetyczne wobec piratów: tylko obsadzone, może zostać zniszczone).
- Dodatkowe propozycje:
  - **Zagroda** – budynek do oswajania mruczków (potrzebny do celu), oswojone zwierzęta poprawiają morale,
  - **Myśliwi** – nowe zadanie w zakładce PRACA: żywność z polowań, ale fauna staje się agresywniejsza,
  - zapowiedź zmiany pory roku kilka dni wcześniej.

#### Asteroida Tik-Tak – normalny (scenariusz badawczy)
- Zleca: **Główny Chronometrysta Dworu do spraw Punktualności, Spóźnień Usprawiedliwionych oraz Kalendarzy Ściennych z Ładnymi Obrazkami**.
- Historia: Imperator obawia się, że jedna doba nie wystarczy, żeby przyjąć życzenia od wszystkich gości. Zażądał technologii, która rozciągnie dzień Jubileuszu do 48 godzin. Asteroida Tik-Tak jest pełna anomalii czasowych – idealne miejsce na laboratorium. Albo najgorsze. Naukowcy wciąż się kłócą, bo dla każdego z nich minęło już inaczej dużo czasu.
- Cel (propozycja): zbadać technologię **Rozciągacz Doby** (bardzo droga, na końcu łańcucha kilku technologii pośrednich). Liczba kolonistów ma mniejsze znaczenie (np. minimum 300).
- Zasady:
  - nauka w centrum gry – laboratoria i naukowcy (punkt 4) są kluczowi,
  - rozbudowane drzewo technologii z wymaganiami (technologie pośrednie odblokowują kolejne),
  - wyprawy do ruin (punkt 5) dają ważne punkty badań,
  - zdarzenia anomalii czasowych: dzień się powtarza, dzień przepada, laboratorium cofa się w czasie i traci postęp albo nagle zyskuje postęp z przyszłości,
  - mało złóż i słaba produkcja żywności – trzeba handlować i wykonywać zamówienia LUJ.

#### Planeta Chlupotka – trudny (planeta oceaniczna)
- Zleca: **Wielki Mistrz Ceremonii Rekreacyjno-Sportowych Jego Wysokości, Kawaler Orderu Złotego Kija**.
- Historia: Imperator chce zagrać na Jubileuszu w golfa – ale na wodzie, bo „na trawie grają wszyscy”. Chlupotka ma dużo wody i prawie nic poza nią.
- Cel (propozycja): zbudować 18 pływających dołków golfowych (nowy budynek) i utrzymać co najmniej 400 kolonistów.
- Zasady: mało złóż na lądzie (głównie z wypraw podwodnych), żywność z farm wodorostów, sztormy niszczące budynki, ograniczona liczba miejsc na budynki (trzeba budować platformy).

#### Stacja Parapet-3 – trudny (stacja orbitalna)
- Zleca: **Pierwszy Zastępca Wicekanclerza do spraw Widoków z Okna i Ogólnej Malowniczości Horyzontu**.
- Historia: Imperator chce oglądać jubileuszowe fajerwerki z miejsca, z którego widać je wszystkie naraz. Takie miejsce jest tylko na orbicie – trzeba tam postawić stację z najlepszym parapetem w galaktyce.
- Cel (propozycja): zbudować Imperialną Galerię Widokową (wielki budynek) i mieć 500 kolonistów.
- Zasady: brak kopalń – minerały tylko z wypraw na asteroidy i z handlu, ryzyko rozszczelnienia (awarie modułów), ograniczone miejsce na stacji.

#### Glob Kostkolód – trudny (lodowy świat)
- Zleca: **Sekretarz Stanu do spraw Napojów Chłodzonych, Lodu Ceremonialnego oraz Słomek Okolicznościowych**.
- Historia: przy Jubileuszu Imperator wzniesie toast, a jego napój musi być schłodzony lodem „z najczystszego zamarzniętego świata w galaktyce”. Problem w tym, że na Kostkolodzie jest tak zimno, że lód trzeba najpierw rozmrozić, oczyścić i zamrozić ponownie.
- Cel (propozycja): wyprodukować i wysłać 2000 t Lodu Ceremonialnego (nowy surowiec z nowego budynku – oczyszczalni lodu).
- Zasady: wieczna zima, ogrzewanie kluczowe i bardzo energożerne, elektrownie słoneczne prawie bezużyteczne (potrzebne inne źródła energii), za to pod lodem bogate złoża.

## Proponowana kolejność
1. Testy (punkt 10).
2. Tag wersji 0.2 „Tukohama” w gicie, potem wersja 0.3 „Merveil”.
3. Publikacja na GitHub Pages + PWA (punkt 11).
4. Rework technologii (punkt 14).
5. Scenariusze – etap 1 (punkty 13 i 8): wybór scenariusza, mnożnik wyniku, fabuła, Księżyc Jowisz-67.
6. Zdarzenia z wyborem (punkt 1).
7. Wykresy historii (punkt 6) oraz wyniki i odznaki (punkt 9).
8. Zamówienia LUJ (punkt 2).
9. Specjaliści (punkt 4), potem więcej z wypraw (punkt 5).
10. Zużycie budynków (punkt 3).
11. Podpowiedzi (punkt 7).
12. Muzyka (punkt 12).
13. Scenariusze – etap 2: Mruczysko, Tik-Tak, potem trzy trudne.

// Zasady gry (ekran ZASADY)
export default {
  'help.keys': 'SKRÓTY KLAWISZOWE', 'help.keyList': ['Spacja – koniec dnia (albo decyzja do podjęcia)', 'W – przewiń 7 dni', '1–8 – zakładki', 'Esc – menu gry albo zamknięcie otwartego okna'],
  'help.intro': 'Jesteś gubernatorem kolonii na odległej planecie. Każda tura to jeden dzień. Gra oferuje kilka scenariuszy – każdy ma własny cel, historię i poziom trudności (trudniejszy scenariusz mnoży wynik). W obecnym scenariuszu ({scen}) masz {days} dni na cel: {goal}.',
  'help.rules': p => [
    'Pracować może zwykle 60% kolonistów (reszta to dzieci, seniorzy i opiekunowie). Wysokie morale dodaje do 10 pkt proc., niskie tyle samo odejmuje; szpitale i technologia Zautomatyzowane żłobki dodają po 5 pkt proc., a po epidemii chorzy przez kilka dni nie pracują. Odsetek mieści się między 40% a 80%. Najpierw obsadzane są mieszkania, chłodnie, magazyny, baterie i osłony, potem reszta zadań (budynki i budowniczowie) wg priorytetów z zakładki PRACOWNICY. Zatrzymany budynek nie produkuje ani nie zużywa energii, a jego pracownicy są bezrobotni.',
    'Budowa trwa. Każdy budynek wymaga określonej ilości pracy – im większy, tym więcej. Więcej budowniczych kończy budowę szybciej, ale zabiera ludzi z produkcji. Anulowana budowa zwraca połowę kosztów.',
    'Kopalnie wydobywają minerały ze złóż, które się wyczerpują. Nowe złoża znajdują wyprawy (zakładka WYPRAWY) – uczestnicy na czas wyprawy opuszczają kolonię.',
    'Wyprawa szuka wybranego celu (złoża, ruiny, wraki, osadnicy) – z dużą szansą znajdzie właśnie to, z małą coś innego. Żołnierze w ekipie zmniejszają ryzyko, inżynierowie zwiększają zysk.',
    'Specjaliści (naukowcy, inżynierowie, żołnierze) pracują o 50% wydajniej na swoich stanowiskach. Kształcą ich szkoły – zawsze tych, których najbardziej brakuje do celu. Cel ustawia się sam (AUTO: tyle, ile stanowisk w budynkach) albo ręcznie w zakładce PRACOWNICY; tam też można zwolnić zbędnego specjalistę.',
    'Budynki się zużywają: tracą sprawność, coraz częściej mają awarie, a zużyte do zera rozpadają się. Naprawiają je konserwatorzy (zakładka PRACOWNICY).',
    'Budynki zużywają energię. Gdy jej brakuje, produkcja spada, a ludzie są źli.',
    'Energii nie da się kupić ani sprzedać. Nadwyżkę zmagazynujesz tylko w bateriach (po ' + p.bat + ' kWh każda), resztę tracisz.',
    'Żywność trzymasz w chłodniach, a minerały w magazynach minerałów – każdy surowiec ma ' + p.base + ' t miejsca bazowo + ' + p.cap + ' t za każdy budynek. Nadmiar przepada.',
    'Ludzie rosną w liczbie tylko, gdy mają gdzie mieszkać i co jeść.',
    'Głód: każdy dzień braku jedzenia zabija coraz więcej osób, a 12. dnia głodu umierają wszyscy. Głód kończy dzień pełnego jedzenia przy co najmniej normalnych racjach. Racje głodowe tylko wstrzymują umieranie.',
    'Działa magnetyczne (po zbadaniu technologii) zmniejszają straty od piratów i meteorytów – tylko obsadzone i zasilone. Mogą zostać zniszczone w czasie ataku.',
    'Niektóre zdarzenia wymagają decyzji – dopóki jej nie podejmiesz, czas stoi. W ustawieniach możesz ustawić odpowiedzi automatyczne.',
    'Ludzka Unia Jedności zleca kolonii zadania (zakładka IMPERIUM): dostawy, wysłanie ludzi albo zbadanie technologii. Przyjęte zlecenie ma termin i karę, a wykonane daje nagrodę i reputację.',
    'Kampanie reklamowe (zakładka POLITYKA) mogą przyciągnąć nowych kolonistów. Znasz tylko ich koszt i czas trwania – skuteczność trzeba sprawdzić samemu.',
    'Wysokie podatki i głodowe racje obniżają morale. Przy morale 5% wybucha bunt.',
    'Laboratoria codziennie posuwają naprzód badania. W zakładce TECHNOLOGIE dodajesz technologie do kolejki – naukowcy badają je po kolei. Technologie tworzą drzewo: niektóre wymagają odkrycia innych. Dają nowe budynki, premie i nowe możliwości (cele wypraw, kampanie, handel).',
    'Dług powyżej 500 kr oznacza bankructwo.',
    'Przycisk ▶▶ 7 DNI przewija tydzień i zatrzymuje się przy ważnych wydarzeniach – które to są, ustawisz w menu (≡) → USTAWIENIA.',
    'Nadwyżki żywności i minerałów sprzedawaj na rynku (zakładka IMPERIUM), ceny zmieniają się codziennie.'
  ]
}

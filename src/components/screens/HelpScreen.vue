<script setup>
import { closeScreen } from '../../store.js'
import { computed } from 'vue'
import { game } from '../../store.js'
import { BATCAP, STBASE, STCAP, DAYS } from '../../game/constants.js'
import { scenarioOf } from '../../game/scenarios.js'
const scen = computed(() => scenarioOf(game.s))
</script>

<template>
  <h1>ZASADY</h1>
  <p>Jesteś gubernatorem kolonii na odległej planecie. Każda tura to jeden dzień. Gra oferuje kilka scenariuszy – każdy ma własny cel, historię i poziom trudności (trudniejszy scenariusz mnoży wynik). W obecnym scenariuszu ({{ scen.n }}) masz {{ DAYS }} dni na cel: {{ scen.goal.text }}.</p>
  <p>
    • 60% kolonistów pracuje. Najpierw obsadzane są mieszkania, chłodnie, magazyny, baterie i osłony, potem reszta zadań (budynki i budowniczowie) wg priorytetów z zakładki PRACA. Zatrzymany budynek nie produkuje ani nie zużywa energii, a jego pracownicy są bezrobotni.<br>
    • Budowa trwa. Każdy budynek wymaga określonej ilości pracy – im większy, tym więcej. Więcej budowniczych kończy budowę szybciej, ale zabiera ludzi z produkcji. Anulowana budowa zwraca połowę kosztów.<br>
    • Kopalnie wydobywają minerały ze złóż, które się wyczerpują. Nowe złoża znajdują wyprawy (zakładka WYPRAWY) – uczestnicy na czas wyprawy opuszczają kolonię.<br>
    • Wyprawa szuka wybranego celu (złoża, ruiny, wraki, osadnicy) – z dużą szansą znajdzie właśnie to, z małą coś innego. Żołnierze w ekipie zmniejszają ryzyko, inżynierowie zwiększają zysk.<br>
    • Budynki się zużywają: tracą sprawność, coraz częściej mają awarie, a zużyte do zera rozpadają się. Naprawiają je konserwatorzy (zakładka PRACA).<br>
    • Budynki zużywają energię. Gdy jej brakuje, produkcja spada, a ludzie są źli.<br>
    • Energii nie da się kupić ani sprzedać. Nadwyżkę zmagazynujesz tylko w bateriach (po {{ BATCAP }} kWh każda), resztę tracisz.<br>
    • Żywność trzymasz w chłodniach, a minerały w magazynach minerałów – każdy surowiec ma {{ STBASE }} t miejsca bazowo + {{ STCAP }} t za każdy budynek. Nadmiar przepada.<br>
    • Ludzie rosną w liczbie tylko, gdy mają gdzie mieszkać i co jeść.<br>
    • Głód: każdy dzień braku jedzenia zabija coraz więcej osób, a 12. dnia głodu umierają wszyscy. Głód kończy dzień pełnego jedzenia przy co najmniej normalnych racjach. Racje głodowe tylko wstrzymują umieranie.<br>
    • Działa magnetyczne (po zbadaniu technologii) zmniejszają straty od piratów i meteorytów – tylko obsadzone i zasilone. Mogą zostać zniszczone w czasie ataku.<br>
    • Niektóre zdarzenia wymagają decyzji – dopóki jej nie podejmiesz, czas stoi. W ustawieniach możesz ustawić odpowiedzi automatyczne.<br>
    • Ludzka Unia Jedności zleca kolonii zadania (zakładka RYNEK): dostawy, wysłanie ludzi albo zbadanie technologii. Przyjęte zlecenie ma termin i karę, a wykonane daje nagrodę i reputację.<br>
    • Kampanie reklamowe (zakładka POLITYKA) mogą przyciągnąć nowych kolonistów. Znasz tylko ich koszt i czas trwania – skuteczność trzeba sprawdzić samemu.<br>
    • Wysokie podatki i głodowe racje obniżają morale. Przy morale 5% wybucha bunt.<br>
    • Laboratoria codziennie posuwają naprzód badania. W zakładce TECHNOLOGIE dodajesz technologie do kolejki – naukowcy badają je po kolei. Technologie tworzą drzewo: niektóre wymagają odkrycia innych. Dają nowe budynki, premie i nowe możliwości (cele wypraw, kampanie, handel).<br>
    • Dług powyżej 500 kr oznacza bankructwo.<br>
    • Przycisk ▶▶ 7 DNI przewija tydzień i zatrzymuje się przy ważnych wydarzeniach – które to są, ustawisz w menu (≡) → USTAWIENIA.<br>
    • Nadwyżki żywności i minerałów sprzedawaj na rynku, ceny zmieniają się codziennie.
  </p>
  <div class="btns"><button @click="closeScreen">WRÓĆ</button></div>
</template>

<script setup>
import { closeScreen } from '../../store.js'
import { BATCAP, STBASE, STCAP, DAYS, GOAL } from '../../game/constants.js'
</script>

<template>
  <h1>ZASADY</h1>
  <p>Jesteś gubernatorem kolonii na odległej planecie. Każda tura to jeden dzień. Masz rok ({{ DAYS }} dni), żeby kolonia urosła do {{ GOAL }} mieszkańców.</p>
  <p>
    • 60% kolonistów pracuje. Najpierw obsadzane są mieszkania, chłodnie, magazyny, baterie i osłony, potem reszta zadań (budynki i budowniczowie) wg priorytetów z zakładki PRACA. Zatrzymany budynek nie produkuje ani nie zużywa energii, a jego pracownicy są bezrobotni.<br>
    • Budowa trwa. Każdy budynek wymaga określonej ilości pracy – im większy, tym więcej. Więcej budowniczych kończy budowę szybciej, ale zabiera ludzi z produkcji. Anulowana budowa zwraca połowę kosztów.<br>
    • Kopalnie wydobywają minerały ze złóż, które się wyczerpują. Nowe złoża znajdują wyprawy (zakładka WYPRAWY) – uczestnicy na czas wyprawy opuszczają kolonię.<br>
    • Budynki zużywają energię. Gdy jej brakuje, produkcja spada, a ludzie są źli.<br>
    • Energii nie da się kupić ani sprzedać. Nadwyżkę zmagazynujesz tylko w bateriach (po {{ BATCAP }} kWh każda), resztę tracisz.<br>
    • Żywność trzymasz w chłodniach, a minerały w magazynach minerałów – każdy surowiec ma {{ STBASE }} t miejsca bazowo + {{ STCAP }} t za każdy budynek. Nadmiar przepada.<br>
    • Ludzie rosną w liczbie tylko, gdy mają gdzie mieszkać i co jeść.<br>
    • Głód: każdy dzień braku jedzenia zabija coraz więcej osób, a 12. dnia głodu umierają wszyscy. Głód kończy dzień pełnego jedzenia przy co najmniej normalnych racjach. Racje głodowe tylko wstrzymują umieranie.<br>
    • Kampanie reklamowe (zakładka POLITYKA) mogą przyciągnąć nowych kolonistów. Znasz tylko ich koszt i czas trwania – skuteczność trzeba sprawdzić samemu.<br>
    • Wysokie podatki i głodowe racje obniżają morale. Przy morale 5% wybucha bunt.<br>
    • Laboratoria codziennie posuwają naprzód wybraną w zakładce NAUKA technologię.<br>
    • Dług powyżej 500 kr oznacza bankructwo.<br>
    • Przycisk ▶▶ 7 DNI przewija tydzień i zatrzymuje się przy ważnych wydarzeniach – które to są, ustawisz w zakładce PRZEWIJANIE.<br>
    • Nadwyżki żywności i minerałów sprzedawaj na rynku, ceny zmieniają się codziennie.
  </p>
  <div class="btns"><button @click="closeScreen">WRÓĆ</button></div>
</template>

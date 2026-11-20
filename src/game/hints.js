// Podpowiedzi kontekstowe: pokazują się, gdy coś dzieje się w grze pierwszy raz.
// Klucze to powody zatrzymania przewijania zwracane przez endTurn.
export const HINTS = {
  short: { t: 'Brakuje rąk do pracy', d: 'Budynki potrzebują więcej pracowników, niż masz. W zakładce PRACOWNICY ustaw priorytety – najważniejsze budynki dostaną ludzi jako pierwsze. Więcej pracowników dadzą nowi koloniści (moduły mieszkalne, kampanie reklamowe).' },
  hunger: { t: 'Zaczął się głód', d: 'Z każdym dniem głodu umiera więcej osób, a 12. dnia giną wszyscy. Kup żywność w zakładce IMPERIUM albo zbuduj farmy. Głód kończy dzień pełnego jedzenia przy co najmniej normalnych racjach.' },
  black: { t: 'Blackout', d: 'Budynki zużywają więcej energii, niż produkujesz. Zbuduj elektrownie albo baterie na zapas, albo wyłącz (STOP w zakładce PRACOWNICY) budynki, bez których na razie się obejdziesz.' },
  depleted: { t: 'Złoże się wyczerpało', d: 'Kopalnie wydobywają ze złóż, które się kończą. Wyślij wyprawę (zakładka WYPRAWY) z celem „ZŁOŻA”, żeby znaleźć nowe.' },
  nodep: { t: 'Kopalnie stoją', d: 'Nie ma już żadnych złóż. Wyślij wyprawę w poszukiwaniu nowych, a do tego czasu kupuj minerały w zakładce IMPERIUM.' },
  nores: { t: 'Laboratoria nie mają projektu', d: 'Naukowcy czekają na zadanie. W zakładce TECHNOLOGIE kliknij technologię i dodaj ją do kolejki badań.' },
  choice: { t: 'Decyzja do podjęcia', d: 'Niektóre zdarzenia wymagają twojej decyzji – do tego czasu dni się nie rozgrywają. Jeśli jakaś decyzja się powtarza, w menu → USTAWIENIA możesz ustawić odpowiedź automatyczną.' },
  broke: { t: 'Awaria budynku', d: 'Budynki się zużywają i psują. Zepsuty budynek nie pracuje, dopóki go nie naprawią konserwatorzy – sprawdź ich priorytet w zakładce PRACOWNICY.' },
  order: { t: 'Zlecenie od LUJ', d: 'Ludzka Unia Jedności proponuje zlecenie (zakładka IMPERIUM). Przyjęte ma termin i karę za niewykonanie, ale wykonane daje nagrodę i reputację.' },
  crowd: { t: 'Przeludnienie', d: 'W kolonii mieszka więcej osób, niż mieszczą moduły mieszkalne. To obniża morale – zbuduj kolejne moduły.' },
  debt: { t: 'Kolonia jest zadłużona', d: 'Kredyty spadły poniżej zera. To obniża morale, a dług powyżej 500 kr kończy grę bankructwem. Podnieś podatki, sprzedaj nadwyżki w zakładce IMPERIUM albo wykonaj zlecenie LUJ.' },
  build: { t: 'Pierwsza budowa ukończona', d: 'Gratulacje! Im więcej budowniczych (priorytet w zakładce PRACOWNICY), tym szybciej powstają kolejne budynki – ale tym mniej ludzi pracuje przy produkcji.' },
  exp: { t: 'Wyprawa wróciła', d: 'Wyprawy szukają wybranego celu, ale czasem znajdą coś innego. Żołnierze w ekipie zmniejszają ryzyko strat, a inżynierowie zwiększają zysk.' }
}

// wybiera pierwszą podpowiedź, która pasuje do powodów, nie była pokazana w tej grze i nie została wyłączona
export function pickHint(reasons, shown, disabled) {
  return Object.keys(HINTS).find(k => reasons.includes(k) && !shown.includes(k) && !disabled[k]) || null
}

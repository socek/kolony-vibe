// Ekrany: menu, ustawienia, wybór scenariusza, wstęp, decyzja
export default {
  'common.back': 'WRÓĆ', 'common.backMenu': 'WRÓĆ DO MENU', 'common.close': 'ZAMKNIJ',
  'menu.title': 'MENU', 'menu.back': 'WRÓĆ DO GRY', 'menu.settings': 'USTAWIENIA', 'menu.scores': 'WYNIKI I ODZNAKI',
  'menu.sound': 'DŹWIĘK', 'menu.music': 'MUZYKA', 'menu.on': 'WŁ.', 'menu.off': 'WYŁ.',
  'menu.help': 'ZASADY', 'menu.about': 'O GRZE', 'menu.log': 'ZMIANY', 'menu.newGame': 'NOWA GRA',
  'menu.continue': 'KONTYNUUJ (dzień {d})',

  'set.access': 'DOSTĘPNOŚĆ', 'set.size': 'Wielkość tekstu i przycisków', 'set.size.m': 'NORMALNA', 'set.size.l': 'DUŻA', 'set.size.xl': 'BARDZO DUŻA',
  'set.contrast': 'Wysoki kontrast (czarne tło, jaśniejsze kolory)',
  'set.lang': 'JĘZYK', 'set.sound': 'DŹWIĘK',
  'set.music': 'Muzyka w tle (zmienia się zależnie od sytuacji w kolonii)',
  'set.sfx': 'Efekty dźwiękowe',
  'set.tutorial': 'SAMOUCZEK I KOMUNIKATY',
  'set.hints': 'Samouczek: okienka z podpowiedzią, gdy coś dzieje się pierwszy raz',
  'set.short': 'Skrócone komunikaty w raporcie – tylko co się stało, bez rad, co z tym zrobić (dla zaawansowanych)',
  'set.hintsOff': 'Wyłączone pojedynczo: {n}', 'set.hintsRestore': 'PRZYWRÓĆ WSZYSTKIE',
  'set.stats': 'STATYSTYKI',
  'set.analytics': 'Anonimowe statystyki gry (Google Analytics) – pomagają autorowi rozwijać grę',
  'set.analyticsNote': 'Po wyłączeniu gra od razu przestaje wysyłać zdarzenia; skrypt Google znika całkiem przy następnym uruchomieniu.',
  'set.stops': 'ZATRZYMYWANIE PRZEWIJANIA',
  'set.stopsInfo': 'Wybierz, które wydarzenia zatrzymują przewijanie przyciskiem ▶▶ 7 DNI. Stany długotrwałe (głód, blackout, brak rąk do pracy…) zatrzymują je tylko w dniu, w którym się zaczynają. Koniec gry zawsze zatrzymuje przewijanie. Ustawienia obowiązują we wszystkich grach.',
  'set.all': 'WSZYSTKO', 'set.defaults': 'DOMYŚLNE', 'set.none': 'NIC',
  'set.auto': 'AUTOMATYCZNE ODPOWIEDZI',
  'set.autoInfo': 'Zdarzenia z wyborem zawsze czekają na twoją decyzję – chyba że ustawisz tu odpowiedź automatyczną. Jeśli wybranej odpowiedzi nie da się wykonać (np. brakuje kredytów), gra i tak zapyta.',
  'set.askMe': 'pytaj mnie',

  'scen.pick': 'WYBIERZ SCENARIUSZ', 'scen.mult': 'wynik ×{m}', 'scen.goal': 'Cel: {g}', 'scen.noScore': 'bez wyniku', 'scen.wip': 'W PRZYGOTOWANIU', 'scen.start': 'ROZPOCZNIJ',
  'intro.diff': 'Poziom trudności: {d}', 'intro.patron': 'ZLECENIODAWCA', 'intro.task': 'TWOJE ZADANIE',
  'intro.taskText': '{g} w ciągu {n} dni.', 'intro.taskFree': 'Buduj kolonię tak długo, jak chcesz – bez celu i bez terminu. Uważaj tylko na głód, bunt i bankructwo.', 'intro.go': 'DO DZIEŁA!',
  'choice.look': 'OBEJRZYJ KOLONIĘ (DECYZJA POCZEKA)'
}
export const end = {
  'end.scen': 'Scenariusz: {n} ({d})', 'end.stats1': 'Koloniści: {pop} · Morale: {mor}%', 'end.stats2': 'Dzień: {day} · Technologie: {tech}',
  'end.score': 'WYNIK: {n}', 'end.mult': '{base} pkt × {m} za poziom trudności',
  'end.place': p => 'Twój wynik to ' + p.p + '. miejsce na ' + p.n + ' ' + (p.n === 1 ? 'grę' : 'gier') + '.',
  'end.noScore': 'Piaskownica nie ma wyniku – liczy się, jak długo przetrwała kolonia.', 'end.badges': 'Odznaki zdobyte w tej grze:', 'end.stats': 'STATYSTYKI', 'end.look': 'ZOBACZ KOLONIĘ',
  'sc.title': 'WYNIKI', 'sc.best': 'NAJLEPSZE GRY', 'sc.none': 'Nie ukończono jeszcze żadnej gry.', 'sc.scen': 'scenariusz', 'sc.score': 'wynik',
  'sc.win': 'wygrana', 'sc.lose': 'przegrana',
  'sc.det': 'koloniści {pop} · dzień {day} · morale {mor}% · kredyty {cr} · technologie {tech}',
  'sc.points': 'punkty {base} × {m} = {score}', 'sc.badgesOf': 'odznaki:', 'sc.badges': 'ODZNAKI ({n}/{max})',
  'log.version': 'WERSJA {v}', 'log.empty': 'Na razie bez zmian.'
}

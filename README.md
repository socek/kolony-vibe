# Kolony Vibe

Strategiczna gra ekonomiczna o zarządzaniu kolonią na odległej planecie, w stylu C64.
Napisana w Vue 3, budowana Vite.

## Uruchamianie

```sh
npm install
npm run dev      # serwer deweloperski z podglądem na żywo
npm run build    # gra w jednym pliku: dist/index.html (można otworzyć z dysku)
```

Menu deweloperskie: dopisz `#iddqd` do adresu gry.

## Publikacja

Każda zmiana wypchnięta na `main` uruchamia testy, a gdy przejdą – publikuje grę na GitHub Pages
(`.github/workflows/deploy.yml`). Opublikowana gra działa offline i można ją zainstalować na telefonie (PWA).

## Testy

```sh
npm test            # testy logiki gry i komponentów Vue (Vitest)
npm run test:e2e    # testy całej gry w przeglądarce (Playwright)
npm run test:all    # wszystko
```

Testy w przeglądarce potrzebują Chromium: `npx playwright install chromium`
albo systemowe Chromium wskazane zmienną `CHROMIUM_PATH=/usr/bin/chromium`.

## Struktura

- `src/game/` – logika gry bez Vue: stałe i dane (`constants.js`), wyliczenia dnia (`calc.js`),
  rozgrywanie tury (`turn.js`), zdarzenia losowe, raport, zapis stanu, ikonki, dźwięk, lista zmian.
- `src/store.js` – reaktywny stan gry i interfejsu oraz akcje gracza.
- `src/components/` – elementy ekranu; `tabs/` – zakładki, `screens/` – ekrany nakładki (menu, zasady, dev…).
- `tests/unit/` – logika gry, `tests/components/` – komponenty Vue, `tests/e2e/` – cała gra w przeglądarce.

## Licencja

Copyright (C) 2026 Dominik "Socek" Długajczyk

Kolony Vibe jest wolnym oprogramowaniem na licencji **GNU Affero General Public License v3.0
lub nowszej** – pełny tekst w pliku [`LICENSE`](LICENSE). Kto udostępnia zmienioną wersję gry
(także jako stronę www), musi udostępnić jej kod źródłowy na tej samej licencji.

Elementy innych autorów:
- czcionki **VT323** i **Press Start 2P** – SIL Open Font License 1.1 (`licenses/`),
- **Vue** i pozostałe biblioteki – licencja MIT.

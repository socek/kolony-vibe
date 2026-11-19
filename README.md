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

## Struktura

- `src/game/` – logika gry bez Vue: stałe i dane (`constants.js`), wyliczenia dnia (`calc.js`),
  rozgrywanie tury (`turn.js`), zdarzenia losowe, raport, zapis stanu, ikonki, dźwięk, lista zmian.
- `src/store.js` – reaktywny stan gry i interfejsu oraz akcje gracza.
- `src/components/` – elementy ekranu; `tabs/` – zakładki, `screens/` – ekrany nakładki (menu, zasady, dev…).

import { test, expect } from '@playwright/test'

// Losowość ustawiona na stałe (brak zdarzeń losowych), czysty zapis i zbieranie błędów konsoli
test.beforeEach(async ({ page }) => {
  page.errors = []
  page.on('pageerror', e => page.errors.push(e.message))
  page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') page.errors.push(m.text()) })
  await page.addInitScript(() => {
    if (!sessionStorage.getItem('kept')) {
      localStorage.clear()
      // podpowiedzi wyłączone w testach rozgrywki (osobny test poniżej)
      if (!location.hash.includes('hints')) localStorage.setItem('kolony-vibe-settings', JSON.stringify({ hints: false }))
    }
    Math.random = () => 0.5
  })
})
test.afterEach(async ({ page }) => { expect(page.errors).toEqual([]) })

const newGame = async page => {
  await page.goto('/')
  await page.getByRole('button', { name: 'NOWA GRA' }).click()
  await page.getByRole('button', { name: 'ROZPOCZNIJ' }).click()
  await page.getByRole('button', { name: 'DO DZIEŁA!' }).click()
}
const tab = (page, name) => page.locator('.tabs').getByRole('button', { name, exact: true }).click()
const card = (page, text) => page.locator('.card', { hasText: text })

test('ekran startowy i nowa gra', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText(/WERSJA \d+\.\d+ /)).toBeVisible()
  await page.getByRole('button', { name: 'NOWA GRA' }).click()
  await expect(page.getByText('WYBIERZ SCENARIUSZ')).toBeVisible()
  await page.getByRole('button', { name: 'ROZPOCZNIJ' }).click()
  await expect(page.getByText('ZLECENIODAWCA')).toBeVisible()
  await page.getByRole('button', { name: 'DO DZIEŁA!' }).click()
  await expect(page.locator('.tabs button')).toHaveCount(9)
  await expect(page.getByText('CEL: 1000 OSÓB')).toBeVisible()
  await expect(page.getByText('1 STY 2150 · DZIEŃ 1/365')).toBeVisible()
})

test('koniec dnia przesuwa datę', async ({ page }) => {
  await newGame(page)
  await page.getByRole('button', { name: '▶ KONIEC DNIA' }).click()
  await expect(page.getByText('DZIEŃ 2/365')).toBeVisible()
  await expect(page.getByText('RAPORT Z OSTATNIEGO DNIA')).toBeVisible()
})

test('przewijanie zatrzymuje się po ukończeniu budowy', async ({ page }) => {
  await newGame(page)
  await tab(page, 'BUDOWA')
  await card(page, 'Bateria').getByRole('button', { name: 'BUDUJ' }).click()
  await expect(page.getByText('PLACE BUDOWY')).toBeVisible()
  await page.getByRole('button', { name: '▶▶ 7 DNI' }).click()
  await expect(page.locator('.stop')).toContainText('ukończono budowę')
  await expect(page.locator('.log')).toContainText('Ukończono budowę: Bateria')
})

test('wyłączony powód w ustawieniach nie zatrzymuje przewijania', async ({ page }) => {
  await newGame(page)
  await page.getByRole('button', { name: '≡' }).click()
  await page.getByRole('button', { name: 'USTAWIENIA' }).click()
  await page.locator('.stopopt', { hasText: 'Ukończenie budowy' }).locator('input').uncheck()
  await page.getByRole('button', { name: 'WRÓĆ DO MENU' }).click()
  await page.getByRole('button', { name: 'WRÓĆ DO GRY' }).click()
  await tab(page, 'BUDOWA')
  await card(page, 'Bateria').getByRole('button', { name: 'BUDUJ' }).click()
  await page.getByRole('button', { name: '▶▶ 7 DNI' }).click()
  await expect(page.getByText('RAPORT Z OSTATNICH 7 DNI')).toBeVisible()
  await expect(page.locator('.stop')).toHaveCount(0)
})

test('wyprawa wyrusza i wraca', async ({ page }) => {
  await newGame(page)
  await tab(page, 'WYPRAWY')
  await page.getByRole('button', { name: 'WYŚLIJ WYPRAWĘ' }).click()
  await expect(page.getByText('W TERENIE')).toBeVisible()
  await page.getByRole('button', { name: '▶▶ 7 DNI' }).click()
  await expect(page.locator('.stop')).toContainText('wróciła wyprawa')
})

test('gra zapisuje się i można ją kontynuować', async ({ page }) => {
  await newGame(page)
  await page.getByRole('button', { name: '▶ KONIEC DNIA' }).click()
  await expect(page.getByText('DZIEŃ 2/365')).toBeVisible()
  await page.evaluate(() => sessionStorage.setItem('kept', '1'))
  await page.reload()
  await page.getByRole('button', { name: /KONTYNUUJ \(dzień 2\)/ }).click()
  await expect(page.getByText('DZIEŃ 2/365')).toBeVisible()
})

test('menu deweloperskie widać tylko z #iddqd', async ({ page }) => {
  await newGame(page)
  await expect(page.getByRole('button', { name: 'DEV' })).toHaveCount(0)
  await page.evaluate(() => { location.hash = '#iddqd' })
  await page.getByRole('button', { name: 'DEV' }).click()
  await page.getByRole('button', { name: '+1000 KR' }).click()
  await expect(page.locator('.box .sub')).toContainText('+1000 kr')
})

test('na telefonie dolny pasek mieści się w jednym rzędzie', async ({ page }) => {
  await page.setViewportSize({ width: 380, height: 700 })
  await newGame(page)
  // wszystkie przyciski zachodzą na siebie w pionie = są w jednym rzędzie
  const boxes = await page.locator('.bar button').evaluateAll(bs => bs.map(b => { const r = b.getBoundingClientRect(); return [r.top, r.bottom] }))
  expect(Math.max(...boxes.map(b => b[0]))).toBeLessThan(Math.min(...boxes.map(b => b[1])))
})

test('kolejka badań w zakładce TECHNOLOGIE', async ({ page }) => {
  await newGame(page)
  await tab(page, 'TECHNOLOGIE')
  for (const k of ['graph', 'auto']) {
    await page.locator('[data-tech="' + k + '"]').click()
    await page.getByRole('button', { name: 'DODAJ DO KOLEJKI' }).click()
  }
  await expect(page.locator('[data-tech="graph"]')).toHaveClass(/active/)
  await expect(page.locator('[data-tech="auto"]')).toContainText('KOLEJKA #1')
  await expect(page.locator('.tarrow').first()).toBeAttached()
})

test('zdarzenie z wyborem wstrzymuje czas do decyzji', async ({ page }) => {
  await newGame(page)
  await page.evaluate(() => { location.hash = '#iddqd' })
  await page.getByRole('button', { name: 'DEV' }).click()
  await page.getByRole('button', { name: 'Wędrowny kupiec' }).click()
  await expect(page.getByText('WĘDROWNY KUPIEC')).toBeVisible()
  await page.getByRole('button', { name: /OBEJRZYJ KOLONIĘ/ }).click()
  await expect(page.getByRole('button', { name: '▶▶ 7 DNI' })).toBeDisabled()
  await page.getByRole('button', { name: '⚠ DECYZJA!' }).click()
  await page.getByRole('button', { name: /^Kup/ }).click()
  await expect(page.locator('.log')).toContainText('Kupiono 150 t minerałów')
  await expect(page.getByRole('button', { name: '▶ KONIEC DNIA' })).toBeEnabled()
})

test('koniec gry: miejsce w tabeli, statystyki i wyniki w menu', async ({ page }) => {
  await newGame(page)
  for (let i = 0; i < 3; i++) await page.getByRole('button', { name: '▶ KONIEC DNIA' }).click()
  // czekamy, aż animacja ostatniego dnia się skończy
  await expect(page.getByText('DZIEŃ 4/365')).toBeVisible()
  await expect(page.getByRole('button', { name: '▶ KONIEC DNIA' })).toBeEnabled()
  await page.evaluate(() => { location.hash = '#iddqd' })
  await page.getByRole('button', { name: 'DEV' }).click()
  await page.locator('.dev label', { hasText: 'Dzień' }).locator('input').fill('365')
  await page.locator('.dev label', { hasText: 'Dzień' }).locator('input').dispatchEvent('change')
  await page.getByRole('button', { name: 'ZAMKNIJ' }).click()
  await page.getByRole('button', { name: '▶ KONIEC DNIA' }).click()
  await expect(page.getByText('KONIEC KADENCJI')).toBeVisible()
  await expect(page.getByText(/Twój wynik to 1\. miejsce/)).toBeVisible()
  await page.locator('.box').getByRole('button', { name: 'STATYSTYKI' }).click()
  await expect(page.locator('.chartsvg').first()).toBeVisible()
  await page.locator('.chip', { hasText: 'Koloniści' }).click()
  await expect(page.locator('.chart', { hasText: 'Koloniści' })).toHaveCount(0)
  await page.getByRole('button', { name: '≡' }).click()
  await page.getByRole('button', { name: 'WYNIKI I ODZNAKI' }).click()
  await expect(page.locator('.scorerow')).toHaveCount(1)
  await expect(page.locator('.badge')).toHaveCount(10)
})

test('zlecenie LUJ: przyjęcie i wykonanie', async ({ page }) => {
  await newGame(page)
  await page.evaluate(() => { location.hash = '#iddqd' })
  await page.getByRole('button', { name: 'DEV' }).click()
  await page.getByRole('button', { name: '+ZLECENIE LUJ' }).click()
  await page.getByRole('button', { name: 'ZAMKNIJ' }).click()
  await tab(page, 'IMPERIUM')
  await page.getByRole('button', { name: 'PRZYJMIJ' }).click()
  await page.getByRole('button', { name: 'DOSTARCZ' }).click()
  await expect(page.locator('.order')).toHaveCount(0)
  await expect(page.getByText(/reputacja u LUJ: \d+/)).toContainText('56')
})

test('wyprawa do ruin z żołnierzem', async ({ page }) => {
  await newGame(page)
  await tab(page, 'WYPRAWY')
  await page.getByRole('button', { name: 'RUINY' }).click()
  await page.locator('.row', { hasText: 'Żołnierze:' }).getByRole('button', { name: '+' }).first().click()
  await page.getByRole('button', { name: 'WYŚLIJ WYPRAWĘ' }).click()
  await expect(page.getByText(/cel: ruiny · 5 osób \(żołn\. 1/)).toBeVisible()
})

test('konserwatorzy i stan budynków', async ({ page }) => {
  await newGame(page)
  await tab(page, 'PRACOWNICY')
  await expect(page.locator('.card', { hasText: 'Konserwatorzy (naprawy' })).toBeVisible()
  await tab(page, 'RAPORT')
  await expect(page.getByText('Stan budynków')).toBeVisible()
})

test('podpowiedź przy pierwszym braku rąk do pracy i „nie pokazuj więcej”', async ({ page }) => {
  await page.goto('/#hints')
  await page.getByRole('button', { name: 'NOWA GRA' }).click()
  await page.getByRole('button', { name: 'ROZPOCZNIJ' }).click()
  await page.getByRole('button', { name: 'DO DZIEŁA!' }).click()
  await page.getByRole('button', { name: '▶ KONIEC DNIA' }).click()
  await expect(page.getByText('BRAKUJE RĄK DO PRACY')).toBeVisible()
  await page.getByRole('button', { name: 'NIE POKAZUJ WIĘCEJ TEJ PODPOWIEDZI' }).click()
  const st = await page.evaluate(() => JSON.parse(localStorage.getItem('kolony-vibe-settings')))
  expect(st.hintOff.short).toBe(true)
})

test('scenariusz Mruczysko: pora roku, zagroda i myśliwi', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'NOWA GRA' }).click()
  await page.locator('.scen', { hasText: 'Planeta Mruczysko' }).click()
  await page.getByRole('button', { name: 'ROZPOCZNIJ' }).click()
  await expect(page.getByText(/Nadzwyczajny Pełnomocnik/)).toBeVisible()
  await page.getByRole('button', { name: 'DO DZIEŁA!' }).click()
  await expect(page.getByText('PORA ROKU: ZIMA', { exact: true })).toBeVisible()
  await tab(page, 'BUDOWA')
  await expect(page.locator('.card', { hasText: 'Zagroda' })).toBeVisible()
  await tab(page, 'PRACOWNICY')
  await expect(page.locator('.card', { hasText: 'Myśliwi (+' })).toBeVisible()
})

test('scenariusz Chlupotka: limit miejsc na budynki', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'NOWA GRA' }).click()
  await page.locator('.scen', { hasText: 'Planeta Chlupotka' }).click()
  await page.getByRole('button', { name: 'ROZPOCZNIJ' }).click()
  await page.getByRole('button', { name: 'DO DZIEŁA!' }).click()
  await tab(page, 'BUDOWA')
  await expect(page.getByText('Miejsca na budynki', { exact: true })).toBeVisible()
  await expect(page.locator('.card', { hasText: 'Pływający dołek golfowy' })).toBeVisible()
  await expect(page.locator('.card', { hasText: 'Kopalnia głębinowa' })).toBeVisible()
})

test('zakładka PRACOWNICY wyjaśnia odsetek zdolnych do pracy', async ({ page }) => {
  await newGame(page)
  await tab(page, 'PRACOWNICY')
  await expect(page.getByText('Zdolni do pracy (62% kolonistów)')).toBeVisible()
  await expect(page.getByText('Bazowo (dzieci, seniorzy i opiekunowie nie pracują)')).toBeVisible()
  await expect(page.getByText('+2 pkt proc.')).toBeVisible()
  await page.screenshot({ path: process.env.SHOT || 'test-results/work.png' })
})

test('WRÓĆ z zasad, o grze i zmian wraca tam, skąd je otwarto', async ({ page }) => {
  await page.goto('/')
  for (const [open, title] of [['ZASADY', 'ZASADY'], ['O GRZE', 'O GRZE'], ['ZMIANY', null]]) {
    await page.getByRole('button', { name: open, exact: true }).click()
    if (title) await expect(page.getByRole('heading', { name: title })).toBeVisible()
    await page.getByRole('button', { name: 'WRÓĆ', exact: true }).click()
    await expect(page.getByRole('button', { name: 'NOWA GRA' })).toBeVisible()
  }
  await page.getByRole('button', { name: 'NOWA GRA' }).click()
  await page.getByRole('button', { name: 'ROZPOCZNIJ' }).click()
  await page.getByRole('button', { name: 'DO DZIEŁA!' }).click()
  await page.getByTitle('Menu', { exact: true }).click()
  await page.getByRole('button', { name: 'ZASADY', exact: true }).click()
  await page.getByRole('button', { name: 'WRÓĆ', exact: true }).click()
  await expect(page.getByRole('button', { name: 'WRÓĆ DO GRY' })).toBeVisible()
})

test('przyciski ZGŁOŚ BŁĄD i WESPRZYJ otwierają strony w nowej karcie', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => { window.opened = []; window.open = u => { window.opened.push(u) } })
  await page.getByRole('button', { name: 'ZGŁOŚ BŁĄD' }).click()
  await page.getByRole('button', { name: 'WESPRZYJ' }).click()
  expect(await page.evaluate(() => window.opened)).toEqual(['https://github.com/socek/kolony-vibe/issues/new', 'https://cuplink.to/socek'])
  await page.screenshot({ path: process.env.SHOT || 'test-results/links.png' })
})

test('specjaliści: cel, AUTO i zwolnienie w zakładce PRACOWNICY', async ({ page }) => {
  await newGame(page)
  await tab(page, 'PRACOWNICY')
  const sol = page.locator('.spec', { hasText: 'Żołnierze' })
  await expect(sol).toContainText('Żołnierze: 2')
  await expect(sol).toContainText('AUTO,')
  await sol.getByRole('button', { name: 'ZWOLNIJ 1' }).click()
  await expect(sol).toContainText('Żołnierze: 1 / cel 1')
  await expect(sol).toContainText('ręcznie')
  await sol.getByRole('button', { name: '+' }).click()
  await expect(sol).toContainText('cel 2')
  await sol.getByRole('button', { name: 'AUTO' }).click()
  await expect(sol).toContainText('AUTO,')
  await page.locator('.spec').first().scrollIntoViewIfNeeded()
  await page.screenshot({ path: process.env.SHOT || 'test-results/spec.png' })
})

test('animacja startowa leci tylko raz', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('LOAD "KOLONY VIBE",8,1')).toBeVisible()
  await expect(page.locator('.bootstory')).toContainText('Imperator Gała')
  await page.getByRole('button', { name: 'ZASADY', exact: true }).click()
  await page.getByRole('button', { name: 'WRÓĆ', exact: true }).click()
  // od razu cały ekran z przyciskami, bez ponownego „wczytywania”
  await expect(page.getByRole('button', { name: 'NOWA GRA' })).toBeVisible({ timeout: 300 })
})

test('O GRZE: wstążka GitHub i linki do YouTube i Twitcha', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'O GRZE' }).click()
  await expect(page.getByRole('link', { name: 'FORK ME ON GITHUB' })).toHaveAttribute('href', 'https://github.com/socek/kolony-vibe')
  await expect(page.getByRole('link', { name: /YouTube/ })).toHaveAttribute('href', 'https://www.youtube.com/user/socek')
  await expect(page.getByRole('link', { name: /Twitch/ })).toHaveAttribute('href', 'https://www.twitch.tv/wujeksocek')
})

test('na telefonie dolny pasek jest nad listą technologii', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await newGame(page)
  await tab(page, 'TECHNOLOGIE')
  // przewiń tak, żeby kafelek technologii znalazł się dokładnie pod dolnym paskiem
  const hit = await page.evaluate(() => {
    const bar = document.querySelector('.bar').getBoundingClientRect()
    const blocks = [...document.querySelectorAll('.tblock')]
    const b = blocks[blocks.length - 1]
    window.scrollBy(0, b.getBoundingClientRect().top - bar.top - 4)
    const r = document.querySelector('.bar').getBoundingClientRect(), br = b.getBoundingClientRect()
    const y = (Math.max(r.top, br.top) + Math.min(r.bottom, br.bottom)) / 2
    return { under: br.top < r.bottom && br.bottom > r.top, onBar: document.elementFromPoint(r.left + 20, y).closest('.bar') !== null }
  })
  expect(hit.under).toBe(true)
  expect(hit.onBar).toBe(true)
})

test('opis wybranej technologii otwiera się w okienku na wierzchu drzewa', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await newGame(page)
  await tab(page, 'TECHNOLOGIE')
  await page.locator('[data-tech="cannon"]').click()
  const pop = page.getByRole('dialog', { name: 'Działa magnetyczne' })
  await expect(pop).toBeInViewport()
  // okienko jest na wierzchu: na jego środku nie ma kafelka technologii ani dolnego paska
  const b = await pop.boundingBox()
  expect(await page.evaluate(([x, y]) => !!document.elementFromPoint(x, y).closest('.tdetail'), [b.x + b.width / 2, b.y + b.height / 2])).toBe(true)
  await page.getByRole('button', { name: 'ZAMKNIJ' }).click()
  await expect(pop).toBeHidden()
  await page.locator('[data-tech="cannon"]').click()
  await page.keyboard.press('Escape')
  await expect(pop).toBeHidden()
  await page.locator('[data-tech="cannon"]').click()
  await page.getByRole('button', { name: 'DODAJ DO KOLEJKI' }).click()
  await expect(pop).toBeHidden()
  await expect(page.locator('.card', { hasText: 'Badana:' })).toContainText('Działa magnetyczne')
})

test('na szerokim ekranie zakładki są menu bocznym po lewej', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 })
  await newGame(page)
  const nav = await page.locator('.tabs').boundingBox(), panel = await page.locator('.panel').boundingBox()
  expect(nav.x + nav.width).toBeLessThanOrEqual(panel.x)
  const b = page.locator('.tabs button')
  expect((await b.nth(1).boundingBox()).y).toBeGreaterThan((await b.nth(0).boundingBox()).y)
})

test('przycisk „wstecz”: pierwszy raz menu gry, drugi raz wyjście z gry', async ({ page }) => {
  await page.goto('/?poprzednia') // „poprzednia strona”, na którą wychodzi się z gry
  await newGame(page)
  await page.goBack()
  await expect(page.getByRole('heading', { name: 'MENU' })).toBeVisible()
  await page.goBack()
  await expect(page).toHaveURL(/poprzednia/)
})

test('przycisk „wstecz” po powrocie z menu do gry znowu otwiera menu', async ({ page }) => {
  await page.goto('/?poprzednia') // „poprzednia strona”, na którą wychodzi się z gry
  await newGame(page)
  await page.goBack()
  await page.getByRole('button', { name: 'WRÓĆ DO GRY' }).click()
  await page.goBack()
  await expect(page.getByRole('heading', { name: 'MENU' })).toBeVisible()
})

test('po zakończeniu dnia początek raportu jest na górze ekranu', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await newGame(page)
  await tab(page, 'BUDOWA')
  await page.mouse.wheel(0, 3000)
  await page.getByRole('button', { name: '▶ KONIEC DNIA' }).click()
  await expect(page.locator('.panel')).toContainText('RAPORT')
  await expect.poll(async () => Math.round((await page.locator('.panel').boundingBox()).y)).toBeLessThan(40)
  await expect.poll(async () => Math.round((await page.locator('.panel').boundingBox()).y)).toBeGreaterThanOrEqual(0)
})

test('samouczek: przycisk WYŁĄCZ SAMOUCZEK CAŁKOWICIE', async ({ page }) => {
  await page.goto('/#hints')
  await page.getByRole('button', { name: 'NOWA GRA' }).click()
  await page.getByRole('button', { name: 'ROZPOCZNIJ' }).click()
  await page.getByRole('button', { name: 'DO DZIEŁA!' }).click()
  await page.getByRole('button', { name: '▶ KONIEC DNIA' }).click()
  await expect(page.getByText('USTAWIENIA → SAMOUCZEK I KOMUNIKATY')).toBeVisible()
  await page.getByRole('button', { name: 'WYŁĄCZ SAMOUCZEK CAŁKOWICIE' }).click()
  await expect(page.getByText('BRAKUJE RĄK DO PRACY')).toBeHidden()
  const st = await page.evaluate(() => JSON.parse(localStorage.getItem('kolony-vibe-settings')))
  expect(st.hints).toBe(false)
})

test('skróty klawiszowe: spacja, W, cyfry i Esc', async ({ page }) => {
  await newGame(page)
  await page.keyboard.press('Space')
  await expect(page.getByText('DZIEŃ 2/365')).toBeVisible()
  await expect(page.locator('.tw')).toHaveCount(0) // koniec animacji dnia – wtedy skróty znowu działają
  await expect(page.getByRole('button', { name: '▶ KONIEC DNIA' })).toBeEnabled()
  await page.keyboard.press('2')
  await expect(page.locator('.tabs button.on')).toHaveText('BUDOWA')
  await page.keyboard.press('7')
  await expect(page.locator('.tabs button.on')).toHaveText('TECHNOLOGIE')
  await page.keyboard.press('Escape')
  await expect(page.getByRole('heading', { name: 'MENU' })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('heading', { name: 'MENU' })).toBeHidden()
  await page.keyboard.press('w')
  await expect(page.getByText(/DZIEŃ (3|4|5|6|7|8|9)\/365/)).toBeVisible()
})

test('dostępność: wielkość tekstu i wysoki kontrast', async ({ page }) => {
  await newGame(page)
  await page.getByTitle('Menu', { exact: true }).click()
  await page.getByRole('button', { name: 'USTAWIENIA' }).click()
  await page.getByRole('button', { name: 'BARDZO DUŻA' }).click()
  await page.getByLabel('Wysoki kontrast (czarne tło, jaśniejsze kolory)').check()
  await expect(page.locator('html')).toHaveAttribute('data-size', 'xl')
  await expect(page.locator('html')).toHaveAttribute('data-contrast', '')
  await page.getByRole('button', { name: 'NORMALNA' }).click()
  await expect(page.locator('html')).not.toHaveAttribute('data-size', /./)
})

test('Piaskownica: bez limitu dni i bez wyniku', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'NOWA GRA' }).click()
  await page.getByRole('button', { name: /Piaskownica Imperatora/ }).click()
  await expect(page.getByRole('button', { name: /Piaskownica Imperatora/ })).toContainText('bez wyniku')
  await page.getByRole('button', { name: 'ROZPOCZNIJ' }).click()
  await expect(page.getByText('Buduj kolonię tak długo, jak chcesz')).toBeVisible()
  await page.getByRole('button', { name: 'DO DZIEŁA!' }).click()
  await expect(page.getByText('DZIEŃ 1', { exact: true })).toHaveCount(0)
  await expect(page.locator('.screen')).toContainText('· DZIEŃ 1')
  await expect(page.locator('.screen')).not.toContainText('/365')
  await expect(page.getByText('KADENCJA GUBERNATORA')).toHaveCount(0)
  await expect(page.getByText('TRYB SWOBODNY', { exact: true })).toBeVisible()
})

test('ustawy w zakładce POLITYKA', async ({ page }) => {
  await newGame(page)
  await tab(page, 'POLITYKA')
  const row = page.locator('.law', { hasText: 'Niedzielne festyny' })
  await row.getByRole('button', { name: 'UCHWAL −100 kr' }).click()
  await expect(row).toHaveClass(/on/)
  await expect(page.getByText('uchwalone: 1/3')).toBeVisible()
  await expect(page.locator('.tile', { hasText: 'Kredyty' })).toContainText('400')
  await row.getByRole('button', { name: 'UCHYL' }).click()
  await expect(page.getByText('uchwalone: 0/3')).toBeVisible()
})

test('zapisy: slot i przenoszenie gry kodem', async ({ page }) => {
  await newGame(page)
  await page.getByRole('button', { name: '▶ KONIEC DNIA' }).click()
  await expect(page.getByText('DZIEŃ 2/365')).toBeVisible()
  await expect(page.locator('.tw')).toHaveCount(0)
  await page.getByTitle('Menu', { exact: true }).click()
  await page.getByRole('button', { name: 'ZAPISY GRY' }).click()
  await page.getByRole('button', { name: 'ZAPISZ TU' }).first().click()
  await expect(page.getByText('Zapisano grę w slocie 1.')).toBeVisible()
  await page.getByRole('button', { name: 'POKAŻ KOD GRY' }).click()
  await expect(page.locator('textarea.savecode[readonly]')).toHaveValue(/^KV/)
  const code = await page.locator('textarea.savecode[readonly]').inputValue()
  expect(code).toMatch(/^KV1:/)
  // nowa gra, potem wczytanie ze slotu
  await page.getByRole('button', { name: 'WRÓĆ', exact: true }).click()
  await page.getByRole('button', { name: 'NOWA GRA' }).click()
  await page.getByRole('button', { name: 'ROZPOCZNIJ' }).click()
  await page.getByRole('button', { name: 'DO DZIEŁA!' }).click()
  await expect(page.getByText('DZIEŃ 1/365')).toBeVisible()
  await page.getByTitle('Menu', { exact: true }).click()
  await page.getByRole('button', { name: 'ZAPISY GRY' }).click()
  await page.getByRole('button', { name: 'WCZYTAJ', exact: true }).first().click()
  await expect(page.getByText('DZIEŃ 2/365')).toBeVisible()
  // import z kodu na ekranie startowym
  await page.evaluate(() => sessionStorage.setItem('kept', '1'))
  await page.evaluate(() => localStorage.removeItem('kolony-vibe-v2'))
  await page.reload()
  await page.getByRole('button', { name: 'WCZYTAJ GRĘ' }).click()
  await page.locator('textarea.savecode').fill(code)
  await page.getByRole('button', { name: 'WCZYTAJ Z KODU' }).click()
  await expect(page.getByText('DZIEŃ 2/365')).toBeVisible()
})

test('udostępnianie wyniku: tekst w schowku i obrazek', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await newGame(page)
  await page.evaluate(() => { location.hash = '#iddqd' })
  await page.getByRole('button', { name: 'DEV' }).click()
  await page.locator('.dev label', { hasText: 'Dzień' }).locator('input').fill('365')
  await page.locator('.dev label', { hasText: 'Dzień' }).locator('input').dispatchEvent('change')
  await page.getByRole('button', { name: 'ZAMKNIJ' }).click()
  await page.getByRole('button', { name: '▶ KONIEC DNIA' }).click()
  await expect(page.getByText('KONIEC KADENCJI')).toBeVisible()
  await page.getByRole('button', { name: 'UDOSTĘPNIJ WYNIK' }).click()
  await expect(page.getByText('Skopiowano wynik do schowka')).toBeVisible()
  const txt = await page.evaluate(() => navigator.clipboard.readText())
  expect(txt).toMatch(/^Kolony Vibe – Księżyc Jowisz-67 \(łatwy\): KONIEC KADENCJI Wynik \d+, dzień 365/)
  expect(txt).toContain('https://socek.github.io/kolony-vibe/')
  const dl = page.waitForEvent('download')
  await page.getByRole('button', { name: 'POBIERZ OBRAZEK' }).click()
  const d = await dl
  expect(d.suggestedFilename()).toBe('kolony-vibe-moon.png')
  if (process.env.SHOT) await d.saveAs(process.env.SHOT)
})

test('zakładka KOLONIA: mapa z budynkami i placem budowy', async ({ page }) => {
  await newGame(page)
  await tab(page, 'BUDOWA')
  await page.getByRole('button', { name: 'BUDUJ' }).first().click()
  await tab(page, 'KOLONIA')
  // Księżyc na starcie: 3 farmy, 2 elektrownie, 4 baterie, chłodnia, magazyn, kopalnia, 2 moduły = 14 budynków
  await expect(page.locator('.mtile:not(.site)')).toHaveCount(14)
  await expect(page.locator('.mtile.site')).toHaveCount(1)
  await expect(page.getByText('budynki: 14 · place budowy: 1 · awarie: 0')).toBeVisible()
})

test('prognoza pokazuje braki pracowników i specjalistów', async ({ page }) => {
  await newGame(page)
  const f = page.locator('.card', { hasText: 'PROGNOZA' })
  await expect(f.locator('.row', { hasText: 'Pracownicy' })).toContainText('brakuje 1 pracownika')
  await expect(f.locator('.row', { hasText: 'Specjaliści' })).toContainText('inżynierowie −20')
})

test('PRACOWNICY: przeciąganie zmienia kolejność zadań', async ({ page }) => {
  await newGame(page)
  await page.getByRole('button', { name: 'PRACOWNICY', exact: true }).click()
  const order = () => page.locator('[data-job]').evaluateAll(els => els.map(e => e.dataset.job))
  const before = await order()
  const last = before[1]
  const h = page.locator(`[data-job="${last}"] .drag`), top = page.locator(`[data-job="${before[0]}"]`)
  await top.scrollIntoViewIfNeeded()
  const hb = await h.boundingBox(), tb = await top.boundingBox()
  await page.mouse.move(hb.x + hb.width / 2, hb.y + hb.height / 2)
  await page.mouse.down()
  await page.mouse.move(tb.x + 20, tb.y + 4, { steps: 12 })
  await page.mouse.up()
  expect((await order())[0]).toBe(last)
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('kolony-vibe-v2')).order.indexOf(document.querySelector('[data-job]').dataset.job))).toBeLessThan(2)
})

test('BUDOWA: przeciąganie zmienia kolejność placów budowy', async ({ page }) => {
  await newGame(page)
  await tab(page, 'BUDOWA')
  await card(page, 'Bateria').getByRole('button', { name: 'BUDUJ' }).click()
  await card(page, 'Farma hydroponiczna').getByRole('button', { name: 'BUDUJ' }).click()
  const order = () => page.locator('[data-site]').evaluateAll(els => els.map(e => e.textContent))
  expect((await order())[0]).toContain('Bateria')
  const h = page.locator('[data-site] .drag').nth(1), top = page.locator('[data-site]').first()
  await top.scrollIntoViewIfNeeded()
  const hb = await h.boundingBox(), tb = await top.boundingBox()
  await page.mouse.move(hb.x + hb.width / 2, hb.y + hb.height / 2)
  await page.mouse.down()
  await page.mouse.move(tb.x + 20, tb.y + 4, { steps: 12 })
  await page.mouse.up()
  expect((await order())[0]).toContain('Farma')
})

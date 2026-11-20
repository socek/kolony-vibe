import { test, expect } from '@playwright/test'

// Gra po angielsku: przeglądarka z językiem angielskim, a potem przełączanie PL/EN
test.use({ locale: 'en-US' })
test.beforeEach(async ({ page }) => {
  page.errors = []
  page.on('pageerror', e => page.errors.push(e.message))
  page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') page.errors.push(m.text()) })
  await page.addInitScript(() => {
    if (!sessionStorage.getItem('kept')) { localStorage.clear(); localStorage.setItem('kolony-vibe-settings', JSON.stringify({ hints: false })) }
    Math.random = () => 0.5
  })
})
test.afterEach(async ({ page }) => { expect(page.errors).toEqual([]) })

test('angielska przeglądarka: gra startuje po angielsku i da się w nią grać', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('.bootstory')).toContainText('Emperor Gory')
  await page.getByRole('button', { name: 'NEW GAME' }).click()
  await expect(page.getByText('CHOOSE A SCENARIO')).toBeVisible()
  await page.getByRole('button', { name: 'START' }).click()
  await page.getByRole('button', { name: "LET'S GO!" }).click()
  await expect(page.getByText("GOVERNOR'S TERM")).toBeVisible()
  await page.getByRole('button', { name: '▶ END DAY' }).click()
  await expect(page.locator('.panel')).toContainText('REPORT FOR THE LAST DAY')
  for (const tab of ['BUILD', 'WORKERS', 'EXPEDITIONS', 'EMPIRE', 'POLICY', 'TECHNOLOGIES', 'STATISTICS', 'COLONY']) {
    await page.locator('.tabs').getByRole('button', { name: tab, exact: true }).click()
    // żadnych polskich znaków w treści zakładki
    expect(await page.locator('.panel').innerText()).not.toMatch(/[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/)
  }
  expect(await page.locator('.screen').innerText()).not.toMatch(/[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/)
})

test('przełącznik języka na ekranie startowym i w ustawieniach', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'PL', exact: true }).click()
  await expect(page.getByRole('button', { name: 'NOWA GRA' })).toBeVisible()
  await expect(page.locator('.bootstory')).toContainText('Imperator Gała')
  await page.getByRole('button', { name: 'EN', exact: true }).click()
  await expect(page.getByRole('button', { name: 'NEW GAME' })).toBeVisible()
  // wybór zostaje zapamiętany
  await page.getByRole('button', { name: 'PL', exact: true }).click()
  await page.evaluate(() => sessionStorage.setItem('kept', '1'))
  await page.reload()
  await expect(page.getByRole('button', { name: 'NOWA GRA' })).toBeVisible()
})

import { test, expect } from '@playwright/test'

const URL = 'http://localhost:5200/'

test('zbudowana gra działa offline po pierwszym wczytaniu', async ({ page, context }) => {
  const errors = []
  page.on('pageerror', e => errors.push(e.message))
  await page.goto(URL)
  // czekamy, aż service worker przejmie stronę
  await page.evaluate(() => navigator.serviceWorker.ready)
  await page.reload()
  await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller)).toBe(true)

  await context.setOffline(true)
  await page.reload()
  await page.getByRole('button', { name: 'NOWA GRA' }).click()
  await page.getByRole('button', { name: '▶ KONIEC DNIA' }).click()
  await expect(page.getByText('DZIEŃ 2/365')).toBeVisible()
  // czcionki wbudowane w grę, nie z internetu
  expect(await page.evaluate(() => document.fonts.check('16px VT323'))).toBe(true)
  expect(errors).toEqual([])
})

test('manifest aplikacji jest poprawny', async ({ request }) => {
  const m = await (await request.get(URL + 'manifest.webmanifest')).json()
  expect(m.name).toBe('Kolony Vibe')
  for (const i of m.icons) expect((await request.get(URL + i.src)).ok()).toBe(true)
})

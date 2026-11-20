import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { game, ui } from '../../src/store.js'
import { newState } from '../../src/game/state.js'
import { settings, stopDefaults } from '../../src/game/stops.js'
import App from '../../src/App.vue'
import ResourceTiles from '../../src/components/ResourceTiles.vue'
import BuildTab from '../../src/components/tabs/BuildTab.vue'
import WorkTab from '../../src/components/tabs/WorkTab.vue'
import MarketTab from '../../src/components/tabs/MarketTab.vue'
import ExpeditionsTab from '../../src/components/tabs/ExpeditionsTab.vue'
import PolicyTab from '../../src/components/tabs/PolicyTab.vue'
import ResearchTab from '../../src/components/tabs/ResearchTab.vue'
import ReportTab from '../../src/components/tabs/ReportTab.vue'
import SettingsScreen from '../../src/components/screens/SettingsScreen.vue'
import MenuScreen from '../../src/components/screens/MenuScreen.vue'

beforeEach(() => {
  game.s = newState()
  Object.assign(ui, { tab: 'raport', qty: 50, screen: null, busy: false, turn: null, devMsg: '', expRange: 'near', expTeam: 5 })
  Object.assign(settings.stops, stopDefaults())
})
afterEach(() => { vi.restoreAllMocks(); localStorage.clear() })

const card = (w, text) => w.findAll('.card').find(c => c.text().includes(text))

describe('cała aplikacja', () => {
  it('renderuje się bez ostrzeżeń Vue', () => {
    const warn = vi.spyOn(console, 'warn')
    const w = mount(App)
    expect(w.text()).toContain('KOLONY')
    expect(warn).not.toHaveBeenCalled()
  })

  it('każda zakładka się otwiera', async () => {
    const w = mount(App)
    for (const b of w.findAll('.tabs button')) {
      await b.trigger('click')
      expect(w.find('.panel').text().length).toBeGreaterThan(20)
    }
  })
})

describe('kafelki zasobów', () => {
  it('pokazują stan złóż i ostrzegają o głodzie', async () => {
    const w = mount(ResourceTiles)
    expect(w.text()).toContain('złoża: 1200 t')
    game.s.hungerDays = 3
    await nextTick()
    expect(w.text()).toContain('głód: dzień 3/12')
  })
})

describe('budowa', () => {
  it('budynek bez technologii jest zablokowany', () => {
    const w = mount(BuildTab)
    expect(card(w, 'Działo magnetyczne').classes()).toContain('locked')
    expect(card(w, 'Farma hydroponiczna').classes()).not.toContain('locked')
  })

  it('BUDUJ pobiera koszt i tworzy plac budowy', async () => {
    const w = mount(BuildTab)
    const farm = card(w, 'Farma hydroponiczna')
    await farm.findAll('button').at(1).trigger('click')
    expect(game.s.cr).toBe(380)
    expect(game.s.q).toEqual([{ k: 'farm', d: 0 }])
    expect(w.text()).toContain('PLACE BUDOWY')
  })

  it('przycisk BUDUJ jest nieaktywny bez środków', () => {
    game.s.cr = 10
    const w = mount(BuildTab)
    expect(card(w, 'Farma hydroponiczna').findAll('button').at(1).attributes('disabled')).toBeDefined()
  })
})

describe('praca', () => {
  it('zmiana priorytetu zapisuje się w stanie gry', async () => {
    const w = mount(WorkTab)
    const farm = card(w, 'Farma hydroponiczna')
    await farm.findAll('.pr button').at(3).trigger('click')
    expect(game.s.prio.farm).toBe(3)
  })
})

describe('rynek', () => {
  it('kupno jest zablokowane, gdy brak miejsca w chłodniach', () => {
    game.s.food = 390
    const w = mount(MarketTab)
    const kup = card(w, 'Żywność').findAll('button').find(b => b.text().startsWith('KUP'))
    expect(kup.attributes('disabled')).toBeDefined()
  })
})

describe('wyprawy', () => {
  it('WYŚLIJ WYPRAWĘ zabiera ludzi i pokazuje wyprawę w terenie', async () => {
    const w = mount(ExpeditionsTab)
    await w.findAll('button').find(b => b.text() === 'WYŚLIJ WYPRAWĘ').trigger('click')
    expect(game.s.exp).toHaveLength(1)
    expect(w.text()).toContain('W TERENIE')
  })
})

describe('polityka', () => {
  it('uruchomienie kampanii pokazuje, ile jeszcze trwa', async () => {
    const w = mount(PolicyTab)
    await w.findAll('button').find(b => b.text().includes('−150 kr')).trigger('click')
    expect(game.s.camp).toHaveLength(1)
    expect(w.text()).toContain('trwa · jeszcze 10 dni')
  })
})

describe('technologie', () => {
  const block = (w, k) => w.find('[data-tech="' + k + '"]')
  const btn = (w, t) => w.findAll('button').find(b => b.text() === t)

  it('kliknięcie bloku pokazuje szczegóły i pozwala dodać do kolejki', async () => {
    const w = mount(ResearchTab)
    await block(w, 'graph').trigger('click')
    expect(w.find('.tdetail').text()).toContain('Ogniwa grafenowe')
    await btn(w, 'DODAJ DO KOLEJKI').trigger('click')
    expect(game.s.rs).toBe('graph')
    expect(block(w, 'graph').classes()).toContain('active')
  })

  it('technologia z nieodkrytymi wymaganiami jest zablokowana', async () => {
    const w = mount(ResearchTab)
    expect(block(w, 'rover').classes()).toContain('locked')
    await block(w, 'rover').trigger('click')
    expect(btn(w, 'DODAJ DO KOLEJKI')).toBeUndefined()
  })
})

describe('raport', () => {
  it('pokazuje prognozę głodu, gdy brakuje jedzenia', () => {
    game.s.b.farm = 0; game.s.food = 0
    const w = mount(ReportTab)
    expect(w.text()).toContain('GŁÓD')
  })
})

describe('menu i ustawienia', () => {
  it('menu prowadzi do ustawień', async () => {
    const w = mount(MenuScreen)
    await w.findAll('button').find(b => b.text() === 'USTAWIENIA').trigger('click')
    expect(ui.screen).toBe('settings')
  })

  it('NIC wyłącza wszystkie powody zatrzymania', async () => {
    const w = mount(SettingsScreen)
    await w.findAll('button').find(b => b.text() === 'NIC').trigger('click')
    expect(Object.values(settings.stops).every(v => v === false)).toBe(true)
  })
})

import { watch } from 'vue'

// Systemowy przycisk „wstecz” (np. na telefonie z Androidem): w trakcie gry pierwsze cofnięcie otwiera menu gry,
// dopiero drugie wychodzi z gry. Działa przez dodatkowy wpis w historii przeglądarki (state.kolonyBack), dodawany,
// gdy gracz jest w grze (żaden ekran nie jest otwarty). Na ekranie startowym cofnięcie działa normalnie.
const MARK = { kolonyBack: true }
const onMark = () => !!(history.state && history.state.kolonyBack)

export function setupBackButton(ui, showScreen) {
  let hash = location.hash
  const arm = () => { if (!ui.screen && !onMark()) history.pushState(MARK, '', location.href) }
  watch(() => ui.screen, arm, { immediate: true })
  window.addEventListener('popstate', e => {
    // zmiana samego #… (np. #iddqd) albo powrót na wpis z naszym znacznikiem – to nie jest wyjście z gry
    const hashMoved = location.hash !== hash
    hash = location.hash
    if (hashMoved || (e.state && e.state.kolonyBack)) return
    // w menu (otwartym ręcznie) albo na ekranie startowym: to już drugie cofnięcie – wychodzimy
    if (ui.screen === 'menu' || ui.screen === 'boot') history.back()
    else showScreen('menu')
  })
}

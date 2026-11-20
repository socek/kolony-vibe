import { ref, onUnmounted } from 'vue'

// Przeciąganie elementów listy myszą i palcem (pointer events – HTML5 drag&drop nie działa na dotyku).
// keys() – obecna kolejność kluczy; attr – atrybut data-* na elementach listy (np. 'job' → [data-job]);
// drop(k, before) – zapis: element k ma stanąć przed before (null = na końcu).
// Podczas przeciągania view trzyma kolejność roboczą – lista ma ją pokazywać zamiast keys().
export function useDragList(keys, attr, drop) {
  const drag = ref(null), view = ref(null)
  const sel = '[data-' + attr + ']'
  function onMove(e) {
    const k = drag.value
    if (k == null) return
    const others = [...document.querySelectorAll(sel)].filter(el => el.dataset[attr] !== k)
    const next = others.find(el => { const r = el.getBoundingClientRect(); return e.clientY < r.top + r.height / 2 })
    const v = view.value.filter(x => x !== k), i = next ? v.indexOf(next.dataset[attr]) : v.length
    v.splice(i < 0 ? v.length : i, 0, k)
    if (v.join() !== view.value.join()) view.value = v
    // przewijanie przy krawędzi ekranu
    if (e.clientY < 50) window.scrollBy(0, -12)
    else if (e.clientY > window.innerHeight - 50) window.scrollBy(0, 12)
  }
  function onUp() {
    const k = drag.value, v = view.value
    stop()
    if (k == null || !v) return
    const cur = keys().map(String), before = v[v.indexOf(k) + 1] ?? null
    if (before !== (cur[cur.indexOf(k) + 1] ?? null)) drop(k, before)
  }
  function stop() {
    drag.value = null; view.value = null
    window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', onUp); window.removeEventListener('pointercancel', stop)
  }
  function start(e, k) {
    if (e.button > 0) return
    e.preventDefault()
    drag.value = String(k); view.value = keys().map(String)
    window.addEventListener('pointermove', onMove); window.addEventListener('pointerup', onUp); window.addEventListener('pointercancel', stop)
  }
  onUnmounted(stop)
  return { drag, view, start }
}

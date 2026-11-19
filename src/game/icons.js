// Ikonki pikselowe 8x8: a biały, b żółty, c zielony, d czerwony, e cyjan, f fiolet
export const PAL = { a: '#fff', b: '#E3EA9A', c: '#A6E08F', d: '#FF9F90', e: '#9ADCE8', f: '#B3ADFF' }

export const ICONS = {
  pop: ['..aaaa..', '..aaaa..', '...aa...', '.aaaaaa.', 'a.aaaa.a', '..aaaa..', '..a..a..', '..a..a..'],
  mor: ['..bbbb..', '.bbbbbb.', 'bb.bb.bb', 'bbbbbbbb', 'b.bbbb.b', 'bb....bb', '.bbbbbb.', '..bbbb..'],
  food: ['....c...', '...c....', '.dd.dd..', 'dddddddd', 'dddddddd', 'dddddddd', '.dddddd.', '..dddd..'],
  energy: ['....bb..', '...bb...', '..bb....', '.bbbbbb.', '....bb..', '...bb...', '..bb....', '.b......'],
  min: ['..eeee..', '.eaeeee.', 'eaeeeeee', 'eeeeeeee', '.eeeeee.', '..eeee..', '...ee...', '........'],
  cr: ['..bbbb..', '.bbbbbb.', 'bbbaabbb', 'bbabbbbb', 'bbabbbbb', 'bbbaabbb', '.bbbbbb.', '..bbbb..'],
  res: ['..aaaa..', '...aa...', '...aa...', '..acca..', '.acccca.', 'acccccca', 'acccccca', '.aaaaaa.'],
  work: ['.ff..ff.', '.ff..ff.', '.ffffff.', '..ffff..', '...ff...', '...ff...', '...ff...', '...ff...'],
  build: ['bbbbbb..', 'bbbbbbf.', 'bbbbbb.f', '...ff...', '...ff...', '...ff...', '...ff...', '...ff...'],
  exp: ['.f......', '.fbbbb..', '.fbbbbbb', '.fbbbb..', '.f......', '.f......', '.f......', 'fff.....'],
  farm: ['.cc..cc.', 'cccccccc', '.cccccc.', '...cc...', '...cc...', '.dddddd.', '..dddd..', '..dddd..'],
  power: ['eeeeeeee', 'eaeaeaea', 'eeeeeeee', 'eaeaeaea', 'eeeeeeee', '...ff...', '...ff...', '.ffffff.'],
  battery: ['..aaaa..', '.aaaaaa.', '.a....a.', '.acccca.', '.acccca.', '.acccca.', '.acccca.', '.aaaaaa.'],
  fridge: ['.aaaaaa.', '.aeeeea.', '.aeeeaa.', '.aaaaaa.', '.aeeeea.', '.aeeeaa.', '.aeeeea.', '.aaaaaa.'],
  store: ['bbbbbbbb', 'bb....bb', 'b.b..b.b', 'b..bb..b', 'b..bb..b', 'b.b..b.b', 'bb....bb', 'bbbbbbbb'],
  mine: ['..ffff..', '.f.bb.f.', 'f..bb..f', '...bb...', '...bb...', '...bb...', '...bb...', '...bb...'],
  house: ['........', '..aaaa..', '.aaaaaa.', 'aabaabaa', 'aaaaaaaa', 'aaa..aaa', 'aaa..aaa', '........'],
  rec: ['.dd..dd.', 'dddddddd', 'dddddddd', 'dddddddd', '.dddddd.', '..dddd..', '...dd...', '........'],
  lab: ['..aaaa..', '...aa...', '...aa...', '..acca..', '.acccca.', 'acccccca', 'acccccca', '.aaaaaa.'],
  shield: ['eeeeeeee', 'eaaeeeee', 'eaeeeeee', 'eeeeeeee', 'eeeeeeee', '.eeeeee.', '..eeee..', '...ee...'],
  gun: ['......a.', '.....a..', '....a...', '...ffa..', '..ffff..', '.ffffff.', 'ffffffff', 'ffffffff'],
  port: ['...aa...', '..aaaa..', '..aeea..', '..aaaa..', '.aaaaaa.', 'aa.aa.aa', '...dd...', '..d..d..']
}

const cache = {}
// Lista pikseli { x, y, fill } dla ikonki
export function pixels(name) {
  if (cache[name]) return cache[name]
  const out = []
  ;(ICONS[name] || []).forEach((row, y) => [...row].forEach((ch, x) => { if (PAL[ch]) out.push({ x, y, fill: PAL[ch] }) }))
  return (cache[name] = out)
}

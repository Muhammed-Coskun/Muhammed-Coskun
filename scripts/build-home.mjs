// Generates assets/home-dark.svg and assets/home-light.svg: a typed intro line
// above a pixel-art snowfield where penguins and Muezza the cat wander around.
// Pure CSS animations, so it keeps moving inside GitHub's <img> sandbox.
//
//   node scripts/build-home.mjs

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const OUT = fileURLToPath(new URL('../assets/', import.meta.url));

// The scene is drawn on a 280x90 pixel grid and scaled up 3x.
const PX = 3;
const W = 280;
const H = 90;
const HORIZON = 46;

const THEMES = {
  dark: {
    text: '#e6edf3', accent: '#f0883e',
    // sprites
    o: '#05070a', k: '#1b2230', w: '#f0f4f8', s: '#b9c6d4', y: '#f2a33a',
    q: '#8d99a8', Q: '#6b7787',
    c: '#f0883e', C: '#c2621f', l: '#fbe3c4', p: '#f49ab0', g: '#3fb950',
    B: '#3f5774', H: '#5a7393', b: '#30455d', u: '#b9c7d6', U: '#9aabbe', L: '#b4c7dc',
    // scenery
    star: '#c9d1d9', moon: '#e6edf3', moonShade: '#a5b4c4', ridge: '#151c27',
    snowRim: '#4a5b70', snowFar: '#2c394a', snowMid: '#263242', snowNear: '#212c3a',
    snowHi: '#33425a', shadow: '#161e2a', sparkle: '#c9d6e3', flake: '#c9d1d9', zzz: '#c9d1d9',
    iceOut: '#1a3144', iceShade: '#244760', iceDeep: '#2f5a78', iceMid: '#4f87ab', iceLit: '#8cc3e2', iceTop: '#cdeaf8',
    iglooOut: '#141d29', iglooSeam: '#4a5d74', iglooDark: '#6e8399', iglooMid: '#93a7bc', iglooLit: '#bccad8',
    iglooHi: '#e1e8ef', door: '#222d3b', doorDeep: '#090c11',
    // lamplight inside the igloo, and the reader's shadow
    glow1: '#ccc5ba', glow2: '#f2c985', glow3: '#ffe5a3',
    glowSeam1: '#7d6e66', glowSeam2: '#bd8547', glowSeam3: '#dc9f54',
    doorLit: '#ffd27a', doorJamb: '#c98a45', spill1: '#5f5a50', spill2: '#b89c69', S: '#2a1405',
    // the snow banks of the halfpipe, and the skateboard
    bank: '#2c394a', r: '#e5534b', R: '#a8322c',
    // Pingu's scarf (f, F) and beak (n, N), and his snowman's hat (h, i) and eyes (v)
    f: '#a9cbe8', F: '#7ea6cc', n: '#f2643c', N: '#c4452a', h: '#f4a7c4', i: '#d97ba0', v: '#4a86d0',
  },
  light: {
    text: '#1f2328', accent: '#bc4c00',
    o: '#1f2328', k: '#2d3540', w: '#ffffff', s: '#cdd8e3', y: '#f2a33a',
    q: '#a3aebb', Q: '#86929f',
    c: '#f0883e', C: '#c2621f', l: '#fbe3c4', p: '#f49ab0', g: '#2da44e',
    B: '#7f9bbd', H: '#a2bad5', b: '#6482a6', u: '#f3f6f9', U: '#d9e3ed', L: '#eaf1f8',
    star: '#c9d6e3', moon: '#ffd37a', moonShade: '#f7b84b', ridge: '#edf2f7',
    snowRim: '#c3d1df', snowFar: '#eef3f8', snowMid: '#e7eef5', snowNear: '#e0e8f1',
    snowHi: '#f8fafc', shadow: '#cfd9e4', sparkle: '#ffffff', flake: '#b4c3d3', zzz: '#8c959f',
    iceOut: '#6f9dbb', iceShade: '#88b3cf', iceDeep: '#9fc6de', iceMid: '#bcdcee', iceLit: '#dff0fa', iceTop: '#ffffff',
    iglooOut: '#6f8599', iglooSeam: '#9fb1c3', iglooDark: '#c3d0dc', iglooMid: '#d9e2eb', iglooLit: '#edf2f7',
    iglooHi: '#ffffff', door: '#4a5666', doorDeep: '#2d3540',
    glow1: '#f5eee2', glow2: '#fce7bf', glow3: '#fff0c8',
    glowSeam1: '#c9c0b4', glowSeam2: '#e3c79c', glowSeam3: '#efc583',
    doorLit: '#ffd27a', doorJamb: '#dd9b4f', spill1: '#f7efdf', spill2: '#fde4ae', S: '#8a5a28',
    bank: '#e3eaf2', r: '#e5534b', R: '#b62324',
    f: '#9cc3e6', F: '#6f9bc6', n: '#ef5a32', N: '#bf3f24', h: '#f29bbd', i: '#d8749b', v: '#2f6db5',
  },
};

// ---------------------------------------------------------------- sprites
// One character per pixel. Letters map to theme colours, '.' is transparent.
// Every sprite faces right, stands on its last row and is anchored at column x.

const PENGUIN = [
  '......oooo......',
  '....ookkkkoo....',
  '...okkkkkkkko...',
  '...okkkkkkwwwo..',
  '...okkkkkwwowwo.',
  '...okkkkkwwwwyyo',
  '...okkkkwwwwwoo.',
  '..okkkkkwwwwwwo.',
  '..okkokkwwwwwwwo',
  '..okkokkwwwwwwwo',
  '..okkkokwwwwwwwo',
  '..okkkokwwwwwwwo',
  '...okkkkwwwwwwo.',
  '...okkkkswwwwso.',
  '....okkksssssoo.',
  '.....oooooooo...',
];
const BLANK = '................';
const FLIPPER_OUT = [
  'oooookkkwwwwwwwo',
  'okkkkkkkwwwwwwwo',
  '.ooookkkwwwwwwwo',
  '..okkkkkwwwwwwwo',
];

const CHICK = [
  '...oooo...',
  '..okkkko..',
  '.okkkkkko.',
  '.okkwwwko.',
  '.okwwowwo.',
  '.oqwwwwyyo',
  '.oqqwwwoo.',
  'oqqqqqqqo.',
  'oqQqqqqqqo',
  'oqQqqqqqqo',
  '.oQQqqqqo.',
  '..oooooo..',
];

const CAT = [
  '..............o...o.',
  '.oo..........oco.oco',
  'oco..........occccco',
  'oco.........occgccgo',
  '.oco........occclplo',
  '.oco.ooooooooollllo.',
  '..occcCccCccccclllo.',
  '..occcCccCcccccllo..',
  '..occccccccccccco...',
  '...occccccccccco....',
];

const CAT_SIT = [
  '...........o...o.',
  '..........oco.oco',
  '..........occccco',
  '.........occgccgo',
  '.........occclplo',
  '..........ollllo.',
  '.........occlllo.',
  '........occcllo..',
  '.oo....occCcllo..',
  'oco...occCccllo..',
  'oco..occCcccllo..',
  '.oco.occccccllo..',
  '..ocooccccocllo..',
  '...oocccccocllo..',
  '....ooooooooooo..',
];

// A penguin far off, drawn small, and the skateboard it rides.
const SKATER = [
  '..ooo...',
  '.okkko..',
  '.okwwwo.',
  '.okwowyy',
  'okkwwwo.',
  '.okwwwo.',
  '..oooo..',
];
const BOARD = ['..y..y..', 'orrrrrro', '.oo..oo.'];

// Pingu, in white earmuffs and a light blue scarf, with his big red beak. The
// helper swaps in other eyes and rows, for his other poses.
const PINGU = [
  '......ooooo......',
  '....ookwkkkoo....',
  '...okkwkkkkkko...',
  '..okkwwwkkwwkko..',
  '..okwwwwwkwokko..',
  '..okwwwwwkkkkoo..',
  '..okkwwwkkkkonnno',
  '...okksskkkonnNo.',
  '...offffffffooo..',
  '..offFfffffFfo...',
  '..oFokkwwwwwwwo..',
  '..oFokkwwwwwwwo..',
  '..ofokkwwwwwwwo..',
  '...ookkkwwwwwwo..',
  '...okkkkswwwwso..',
  '....okkksssssoo..',
  '.....oooooooo....',
];
const PINGU_EYES = {
  happy: ['..okkwwwkkkwkko..', '..okwwwwwkwkwko..'],
  wide: ['..okkwwwkkwwwko..', '..okwwwwwkwowko..'],
  low: ['..okkwwwkkkkkko..', '..okwwwwwkwwkko..'],
};
const pingu = (eyes, rows = {}) => PINGU.map((r, j) => rows[j] ?? (eyes && (j === 3 || j === 4) ? PINGU_EYES[eyes][j - 3] : r));
const BLANK17 = '.................';
const PINGU_FEET = ['.....yyy..yyy....', '...yyy.....yyy...', '......yyyyyy.....'];
// the front flipper wrapped round in a hug, held out low to push, and raised
const HUG = { 11: '..oFokkkkkkkkkkoo', 12: '..ofokkwwwwwwwkko' };
const PUSH = { 12: '..ofokkwwwwwwwoko', 13: '...ookkkwwwwwwkko', 14: '...okkkkswwwwsoo.' };
const LIFT = {
  2: '...okkwkkkkkko.o.', 3: '..okkwwwkkkwkkoko', 4: '..okwwwwwkwkwkoko', 5: '..okwwwwwkkkkooko',
  9: '..offFfffffFfokko', 10: '..oFokkwwwwwwwko.',
};
const lean = (rows) => rows.map((r, j) => (j < 8 ? '.' + r.slice(0, 16) : r));

// A snowball of diameter d, outlined, its shaded side turned from the light.
// Anchored at its foot; `right` anchors it at its right-hand edge instead.
function snowball(d, right = false) {
  const n = d + 2;
  const c = n / 2;
  const inside = (i, j) => (i + 0.5 - c) ** 2 + (j + 0.5 - c) ** 2 <= (d / 2) ** 2;
  const rows = Array.from({ length: n }, (_, j) => Array.from({ length: n }, (_, i) => {
    if (inside(i, j)) return i - j < -d * 0.35 ? 's' : 'w';
    return [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([a, b]) => inside(i + a, j + b)) ? 'o' : '.';
  }).join(''));
  return { x: right ? n : n >> 1, rows };
}
// the snowman's face, drawn over a head of diameter 6
const FACE = ['........', '........', '..v..v..', '........', '...pp...', '..o..o..', '...oo...', '........'];

// The shadow a penguin casts on the igloo wall while it reads by the lamp.
const READER = [
  '.....SSSS.............',
  '....SSSSSS............',
  '...SSSSSSSS...........',
  '...SSSSSSSS...........',
  '...SSSSSSSSS..........',
  '...SSSSSSSSSS.........',
  '...SSSSSSSSSSS........',
  '..SSSSSSSSS...........',
  '..SSSSSSSSSS...S.....S',
  '.SSSSSSSSSSS...SSS.SSS',
  '.SSSSSSSSSSSS...SSSSS.',
  '.SSSSSSSSSSSSSSSSS....',
  '.SSSSSSSSSSSS.........',
  '.SSSSSSSSSSS..........',
  '..SSSSSSSSSS..........',
  '...SSSSSSSS...........',
  '....SSSSS.SSSS........',
];

const SPRITES = {
  p_stand: { x: 9, rows: [BLANK, ...PENGUIN, '.....yyy..yyy...'] },
  p_walkA: { x: 9, rows: [BLANK, ...PENGUIN, '...yyy.....yyy..'] },
  p_walkB: { x: 9, rows: [...PENGUIN, '......yyyyyy....', BLANK] },
  p_flap: { x: 9, rows: [BLANK, ...PENGUIN.slice(0, 8), ...FLIPPER_OUT, ...PENGUIN.slice(12), '.....yyy..yyy...'] },
  p_slide: {
    x: 10,
    rows: [
      '............oooo....',
      '.......oooookkkkoo..',
      '....oookkkkkkkkwwoo.',
      '.yoookkkkkkkkkwwowo.',
      'yyokkkkkkkkkkwwwwyyo',
      '.yokkkkwwwwwwwwwwoo.',
      '...oowwwwwwwwwwwso..',
      '.....ooooooooooo....',
    ],
  },
  chick_a: { x: 5, rows: ['..........', ...CHICK, '.yy....yy.'] },
  chick_b: { x: 5, rows: [...CHICK, '...yyyy...', '..........'] },
  cat_stand: { x: 10, rows: [...CAT, '...ococo....ococo...', '...ococo....ococo...', '...ooooo....ooooo...'] },
  cat_walkA: { x: 10, rows: [...CAT, '..ocoooco..ocoooco..', '.oco..oco.oco..oco..', '.oo....oo.oo....oo..'] },
  cat_walkB: { x: 10, rows: ['....................', ...CAT, '....ococo..ococo....', '....ooooo..ooooo....'] },
  // gathering itself before a jump, and absorbing the landing
  cat_crouch: { x: 10, rows: ['....................', '....................', ...CAT, '...ooooo....ooooo...'] },
  // mid-leap: front paws reaching, hind legs and tail trailing
  cat_jump: {
    x: 11,
    rows: [
      '...............o...o..',
      '..............oco.oco.',
      'oo............occccco.',
      'oco..........occgccgo.',
      '.oco.........occclplo.',
      '..ocooooooooooollllo..',
      '...occcCccCccccclllo..',
      '...occcCccCcccccllcco.',
      '...occcccccccccccoocco',
      '..occoooooooooooo..oo.',
      '.occo.................',
      'occo..................',
      '.oo...................',
    ],
  },
  cat_sitA: { x: 10, rows: CAT_SIT },
  cat_sitB: {
    x: 10,
    rows: [
      ...CAT_SIT.slice(0, 8),
      '.......occCcllo..',
      'ooo...occCccllo..',
      'occo.occCcccllo..',
      ...CAT_SIT.slice(11),
    ],
  },
  // curled up, lifted onto the cushion of the bed
  cat_sleep: {
    x: 10,
    rows: [
      '............o...o...',
      '...ooooooo.oco.oco..',
      '..occCccCccocccccco.',
      '.occCccCcccococcoco.',
      'occcCccccccocclplco.',
      'occccccccccollllllo.',
      'occccCCCCCCCCCCccco.',
      '.ooooooooooooooooo..',
      ...Array(6).fill('....................'),
    ],
  },
  ...catBed('MUEZZA'),
  // riding, crouching to pump, facing us halfway through a turn, grabbing the
  // tail, and the board turning over in a kickflip: edge on, then upside down
  sk_ride: { x: 4, rows: [...SKATER, ...BOARD] },
  sk_crouch: { x: 4, rows: ['........', ...SKATER.slice(0, 4), ...SKATER.slice(5), ...BOARD] },
  sk_front: { x: 4, rows: ['..ooo...', '.okkko..', 'okwkwko.', 'okkykko.', 'kowwwok.', '.owwwo..', '..ooo...', '..y.y...', '.orrro..', '.o...o..'] },
  sk_grab: { x: 4, rows: ['........', ...SKATER.slice(0, 3), 'ookwowyy', 'okokwwo.', 'oko.oo..', 'oko.y.yo', ...BOARD.slice(1)] },
  sk_flipA: { x: 4, rows: [...SKATER, '..y..y..', '.oooooo.', '.oRRRRo.', '.oooooo.'] },
  sk_flipB: { x: 4, rows: [...SKATER, '..y..y..', '.oo..oo.', 'orrrrrro'] },
  // Pingu standing, walking, beaming, hugging his snowman with a little bounce,
  // startled, glum, pushing a snowball, lifting it, and holding up a hat
  pg_stand: { x: 9, rows: [BLANK17, ...pingu(), PINGU_FEET[0]] },
  pg_walkA: { x: 9, rows: [BLANK17, ...pingu(), PINGU_FEET[1]] },
  pg_walkB: { x: 9, rows: [...pingu(), PINGU_FEET[2], BLANK17] },
  pg_happy: { x: 9, rows: [BLANK17, ...pingu('happy'), PINGU_FEET[0]] },
  pg_hugA: { x: 9, rows: [BLANK17, ...pingu('happy', HUG), PINGU_FEET[0]] },
  pg_hugB: { x: 9, rows: [...pingu('happy', HUG), PINGU_FEET[0], BLANK17] },
  pg_shock: {
    x: 9,
    rows: [BLANK17, ...pingu('wide', { 10: 'oooFokwwwwwwwwo..', 11: 'okkkokwwwwwwwwo..', 12: '.ooookwwwwwwwwo..' }), PINGU_FEET[0]],
  },
  pg_sad: { x: 9, rows: [BLANK17, BLANK17, ...pingu('low').slice(0, 7), ...pingu().slice(8), PINGU_FEET[0]] },
  pg_pushA: { x: 9, rows: [BLANK17, ...lean(pingu(null, PUSH)), PINGU_FEET[1]] },
  pg_pushB: { x: 9, rows: [...lean(pingu(null, PUSH)), PINGU_FEET[2], BLANK17] },
  pg_lift: { x: 9, rows: [BLANK17, ...pingu('happy', LIFT), PINGU_FEET[0]] },
  pg_place: {
    x: 9,
    rows: ['.............ooo.', '............ohhho', '............oiiio', ...pingu('happy', LIFT), PINGU_FEET[0]],
  },
  // his snowman: snowballs growing as he rolls them, which make its body and
  // head, its face and pink hat, and the heap of snow it tumbles into, in three
  // sizes for the snow he takes from it
  ...Object.fromEntries([2, 3, 4, 5, 6, 7, 8, 9].map((d) => [`sm_ball${d}`, snowball(d, true)])),
  sm_head: { x: 8, rows: snowball(6).rows.map((r, j) => [...r].map((ch, i) => (FACE[j][i] === '.' ? ch : FACE[j][i])).join('')) },
  sm_hat: { x: 4, rows: ['...oo...', '..ohho..', '.ohhhho.', 'ohhhhhho', 'oiiiiiio', '.oooooo.'] },
  sm_heapC: {
    x: 7,
    rows: ['.....oo.......', '...oowwo.oo...', '..owwswowwsoo.', '.owwswwwwswwwo', 'owwwswwswwwswo', 'oooooooooooooo'],
  },
  sm_heapB: { x: 5, rows: ['...oo.....', '..owwo.oo.', '.owwsowwso', 'owwswwwswo', 'oooooooooo'] },
  sm_heapA: { x: 3, rows: ['..oo..', '.owwo.', 'owswwo', 'oooooo'] },
  // reading, a page lifting, standing up and falling over, and glancing up
  reader_read: { x: 6, rows: READER },
  reader_turnA: {
    x: 6,
    rows: [...READER.slice(0, 7), '..SSSSSSSSS.........S.', '..SSSSSSSSSS...S...S.S', '.SSSSSSSSSSS...SSSSSSS', ...READER.slice(10)],
  },
  reader_turnB: {
    x: 6,
    rows: [
      ...READER.slice(0, 6), '...SSSSSSSSSSS....S...', '..SSSSSSSSS.......S...', '..SSSSSSSSSS...S..S..S',
      '.SSSSSSSSSSS...SSSSSSS', ...READER.slice(10),
    ],
  },
  reader_turnC: {
    x: 6,
    rows: [...READER.slice(0, 7), '..SSSSSSSSS.....S.....', '..SSSSSSSSSS...SS....S', '.SSSSSSSSSSS...SSSSSSS', ...READER.slice(10)],
  },
  reader_look: {
    x: 6,
    rows: [
      ...READER.slice(0, 4), '...SSSSSSSSSSS........', '...SSSSSSSSSSSSS......', '...SSSSSSSSS..........',
      '..SSSSSSSSS...........', ...READER.slice(8),
    ],
  },
};

// A round pet bed with a name on its front. The back half is drawn behind the
// cat and the front half in front of it, so the cat sits inside.
function catBed(name) {
  const GLYPHS = {
    A: ['.#.', '#.#', '###', '#.#', '#.#'],
    E: ['###', '#..', '##.', '#..', '###'],
    M: ['#...#', '##.##', '#.#.#', '#...#', '#...#'],
    U: ['#.#', '#.#', '#.#', '#.#', '###'],
    Z: ['###', '..#', '.#.', '#..', '###'],
  };
  const text = [0, 1, 2, 3, 4].map((r) =>
    [...name].map((ch) => GLYPHS[ch][r].replaceAll('#', 'L').replaceAll('.', 'B')).join('B'));
  const w = text[0].length + 6; // the name, 2px of rim and 1px of outline each side
  const cx = w / 2;
  const px = Array.from({ length: 15 }, () => Array(w).fill('.'));
  const inside = (i, j, rx, ry) => ((i + 0.5 - cx) / rx) ** 2 + ((j + 0.5 - 8) / ry) ** 2 <= 1;
  // rows 1-6: the raised back, an arch with the hollow and a fleecy cushion inside
  for (let j = 1; j < 7; j++)
    for (let i = 1; i < w - 1; i++) {
      if (!inside(i, j, cx - 1, 7)) continue;
      if (inside(i, j, cx - 4, 4.5)) px[j][i] = j < 5 ? 'b' : (i * 3 + j * 2) % 7 ? 'u' : 'U';
      else px[j][i] = inside(i, j - 1, cx - 1, 7) ? 'B' : 'H';
    }
  // rows 7-13: the front bolster with the name stitched on
  px[7].fill('H', 2, w - 2);
  px[7][1] = px[7][w - 2] = 'B';
  text.forEach((row, r) => { px[8 + r] = [...`.BB${row}BB.`]; });
  px[13].fill('b', 2, w - 2);
  // outline everything
  const filled = (i, j) => px[j]?.[i] !== undefined && px[j][i] !== '.' && px[j][i] !== 'o';
  for (let j = 0; j < px.length; j++)
    for (let i = 0; i < w; i++)
      if (px[j][i] === '.' && [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => filled(i + dx, j + dy))) px[j][i] = 'o';
  const rows = px.map((r) => r.join(''));
  const x = w >> 1;
  return {
    bed_back: { x, rows: [...rows.slice(0, 7), ...rows.slice(7).map(() => '.'.repeat(w))] },
    bed_front: { x, rows: rows.slice(7) },
  };
}

// ---------------------------------------------------------------- helpers

const f = (n) => +n.toFixed(3);
const pct = (t, total) => `${f((t / total) * 100)}%`;

// Pixels -> one <path> per colour, merging horizontal runs.
function pixelPaths(pixels, colors) {
  const rows = new Map();
  for (const [key, c] of pixels) {
    const [x, y] = key.split(',').map(Number);
    if (!rows.has(y)) rows.set(y, []);
    rows.get(y).push([x, c]);
  }
  const byColor = new Map();
  for (const y of [...rows.keys()].sort((a, b) => a - b)) {
    const cells = rows.get(y).sort((a, b) => a[0] - b[0]);
    for (let i = 0; i < cells.length;) {
      const [x, c] = cells[i];
      let n = 1;
      while (i + n < cells.length && cells[i + n][0] === x + n && cells[i + n][1] === c) n++;
      byColor.set(c, `${byColor.get(c) || ''}M${x} ${y}h${n}v1h-${n}z`);
      i += n;
    }
  }
  return [...byColor].map(([c, d]) => `<path fill="${colors[c] ?? c}" d="${d}"/>`).join('');
}

function spritePixels({ x: ax, rows }) {
  const px = new Map();
  rows.forEach((row, j) => [...row].forEach((ch, i) => {
    if (ch !== '.') px.set(`${i - ax},${j - rows.length}`, ch);
  }));
  return px;
}

class Grid {
  constructor() { this.px = new Map(); }
  set(x, y, c) { if (x >= 0 && x < W && y >= 0 && y < H) this.px.set(`${x},${y}`, c); }
  get(x, y) { return this.px.get(`${x},${y}`); }
  svg(colors) { return pixelPaths(this.px, colors); }
}

function insidePoly(x, y, pts) {
  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i];
    const [xj, yj] = pts[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

function fillPoly(grid, pts, c) {
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  for (let y = Math.floor(Math.min(...ys)); y <= Math.max(...ys); y++)
    for (let x = Math.floor(Math.min(...xs)); x <= Math.max(...xs); x++)
      if (insidePoly(x + 0.5, y + 0.5, pts)) grid.set(x, y, c);
}

// Paints an outline colour around everything in `shape` that touches empty space.
function outline(grid, shape, c) {
  for (const key of shape.px.keys()) {
    const [x, y] = key.split(',').map(Number);
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]])
      if (!shape.get(x + dx, y + dy)) grid.set(x + dx, y + dy, c);
  }
}

// Small deterministic PRNG so every build produces the same scene.
function rng(seed) {
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 2 ** 32;
  };
}

// ---------------------------------------------------------------- scenery

function moon(theme) {
  const g = new Grid();
  for (let y = 0; y < 24; y++)
    for (let x = 244; x < 268; x++) {
      const d = Math.hypot(x + 0.5 - 255, y + 0.5 - 12);
      if (theme === 'dark') {
        // crescent: a disc with a second disc cut out of it
        const cut = Math.hypot(x + 0.5 - 258, y + 0.5 - 10);
        if (d <= 6.2 && cut > 5.6) g.set(x, y, cut <= 6.6 ? 'moonShade' : 'moon');
      } else if (d <= 5.2) g.set(x, y, 'moon');
      else if (d <= 6.2) g.set(x, y, 'moonShade');
    }
  return g;
}

// Kept clear of the two text lines in the middle.
const STARS = [
  [8, 6], [22, 3], [36, 9], [14, 14], [44, 4], [4, 24], [30, 30], [58, 26], [70, 30], [96, 27],
  [128, 31], [160, 28], [190, 32], [214, 27], [236, 30], [238, 4], [272, 22], [276, 6], [234, 16],
  [266, 36], [52, 36], [110, 38], [176, 38], [146, 40],
];

// Stands in the snowfield in front of the horizon, half buried in a drift.
function iceberg() {
  const g = new Grid();
  const shape = new Grid();
  const base = 60;
  const facets = [
    ['iceDeep', [[3, base], [7, 47], [13, 39], [18, 34], [23, 25], [30, 12], [31, 31], [27, base]]],
    // the far side of the shaded face, turned furthest from the light
    ['iceShade', [[3, base], [7, 47], [13, 39], [18, 34], [23, 25], [25, 26], [21, 37], [18, 46], [16, base]]],
    ['iceLit', [[30, 12], [35, 20], [39, 17], [42, 33], [38, base], [27, base], [31, 31]]],
    ['iceMid', [[39, 17], [44, 26], [50, 30], [56, 38], [63, 42], [70, 48], [77, 53], [86, base], [38, base], [42, 33]]],
    ['iceLit', [[50, 30], [56, 38], [63, 42], [70, 48], [77, 53], [86, base], [62, base], [54, 41]]],
    ['iceTop', [[30, 12], [35, 20], [33, 24], [31, 18]]],
    ['iceTop', [[39, 17], [42, 22], [40, 25]]],
    ['iceTop', [[50, 30], [55, 37], [53, 38]]],
    // a smaller berg further out
    ['iceMid', [[-4, base], [-1, 49], [4, 44], [9, 50], [12, base]]],
    ['iceLit', [[4, 44], [9, 50], [12, base], [6, base]]],
  ];
  for (const [c, pts] of facets) {
    fillPoly(g, pts, c);
    fillPoly(shape, pts, 1);
  }
  // the light catches the ridge and the right-hand edges a step brighter
  const RIM = { iceMid: 'iceLit', iceLit: 'iceTop' };
  for (const [key, c] of [...g.px]) {
    const [x, y] = key.split(',').map(Number);
    const ridge = c === 'iceLit' && ['iceDeep', 'iceShade'].includes(g.get(x - 1, y));
    if (RIM[c] && (ridge || !shape.get(x + 1, y))) g.set(x, y, ridge ? 'iceTop' : RIM[c]);
  }
  outline(g, shape, 'iceOut');
  // the drift it sits in
  for (let x = -6; x < 98; x++) {
    const k = 1 - ((x - 44) / 52) ** 2;
    const top = Math.round(base + 1 - 4 * Math.max(0, k));
    for (let y = top; y <= base + 1; y++) g.set(x, y, y === top ? 'snowRim' : 'snowFar');
  }
  return g;
}

function ridge() {
  const g = new Grid();
  for (let x = 56; x < 232; x++) {
    const h = Math.round(2 + 1.6 * Math.sin(x / 9) + 1.2 * Math.sin(x / 4.3 + 1) + Math.sin(x / 23));
    for (let y = HORIZON - h; y < HORIZON; y++) g.set(x, y, 'ridge');
  }
  return g;
}

function ground() {
  const g = new Grid();
  for (let y = HORIZON; y < H; y++)
    for (let x = 0; x < W; x++) {
      let c = y < 58 ? 'snowFar' : y < 72 ? 'snowMid' : 'snowNear';
      // dithered seams between the bands
      if ((y === 57 || y === 71) && (x + y) % 2 === 0) c = y === 57 ? 'snowMid' : 'snowNear';
      g.set(x, y, c);
    }
  for (let x = 0; x < W; x++) g.set(x, HORIZON, 'snowRim');
  // wind-swept streaks catching the light
  const streaks = [[22, 51, 10], [96, 50, 7], [154, 55, 12], [204, 49, 6], [58, 62, 9], [126, 67, 12],
    [236, 66, 10], [18, 76, 12], [178, 79, 14], [102, 86, 10], [262, 83, 9]];
  for (const [cx, y, n] of streaks) {
    for (let x = cx - n; x <= cx + n; x++) g.set(x, y, 'snowHi');
    for (let x = cx - n + 3; x <= cx + n - 3; x++) g.set(x, y - 1, 'snowHi');
  }
  return g;
}

// A halfpipe built of snow far back by the horizon, between the iceberg and
// the igloo: two snow banks whose inner faces curve down into quarter pipes
// glazed with ice, an icy flat between them, and outer sides that run down into
// the snowfield like drifts.
const PARK = { x: 152, floor: 47, flat: 5, r: 8, top: 5, slope: 7 };

function halfpipe() {
  const { x: cx, floor, flat, r, top, slope } = PARK;
  const ground = floor + 2; // under the ice of the flat
  const lip = floor - r; // the row the tops of the banks are on
  const reach = flat + r + top + slope;
  const g = new Grid();
  for (let x = cx - reach; x < cx + reach; x++) {
    const dx = Math.abs(x + 0.5 - cx);
    const down = Math.min(1, Math.max(0, (dx - flat - r - top) / slope)); // how far down the outer side
    const crest = lip + (ground - lip) * down * down * (3 - 2 * down);
    for (let y = lip; y < ground; y++) {
      // how far in from the ice, and from the snow on top and outside
      const ice = dx <= flat ? y - floor : dx <= flat + r ? Math.hypot(dx - flat, y + 0.5 - lip) - r : Infinity;
      const snow = dx <= flat + r ? y - lip : y + 0.5 - crest;
      const depth = Math.min(ice, snow);
      if (depth < 0) continue;
      if (ice <= snow) g.set(x, y, ice < 1 ? 'iceLit' : ice < 2 ? 'iceMid' : 'bank');
      else g.set(x, y, snow < 1 ? 'snowRim' : 'bank');
    }
  }
  // the ice is glazed thicker along the lips, where the boards come up
  for (const x of [cx - flat - r - 1, cx + flat + r]) g.set(x, lip, 'iceTop');
  return g;
}

// The entrance tunnel, drawn by hand: its open end faces left, framed by a
// keystone, two arch stones and two jamb stones per side, and its side runs
// back into the dome in staggered courses. Its top and its seams carry on round
// the dome, so the two read as one igloo. Coloured like the body of the dome:
// lit blocks, with seams a step darker.
const TUNNEL = [
  '...OOOOOOOOOOOOOOO',
  '.OOMLLMEELLLLMLLLO',
  'OLLMLLMLELLLLMLLLO',
  'OLLMLLMLLELLLMLLLO',
  'OLLLxXLLLELLLMLLLO',
  'OMMxXXXMMEMMMMMMMO',
  'OLLxXXXLLELMLLLMLO',
  'OLLxXXXLLELMLLLMLO',
  'OMMxXXXMMELMLLLMLO',
  'OLLxXXXLLELMLLLMLO',
  'OLLxXXXLLELMLLLMLO',
];
// O marks the silhouette, which is left to the shared outline pass (or becomes a
// seam where it lies over the dome); E marks the edge between the two faces.
const TUNNEL_COLORS = {
  E: 'iglooMid', S: 'iglooSeam', D: 'iglooDark', M: 'iglooMid', L: 'iglooLit', H: 'iglooHi',
  X: 'doorDeep', x: 'door',
};

// The middle of the dome and the row just below the igloo.
const IGLOO = { cx: 247, base: 57 };

// A snow-block igloo in the same flat, outlined style as the rest of the scene:
// a dome of block courses lit from the top right, with the tunnel on its left.
// Returns the igloo and, separately, the lamplight that glows out of it.
function igloo() {
  const TONES = ['iglooSeam', 'iglooDark', 'iglooMid', 'iglooLit', 'iglooHi'];
  const rad = Math.PI / 180;
  const g = new Grid();
  const seams = new Grid(); // the seam tone at each pixel of the dome
  const parts = new Grid(); // whether each pixel of the dome is block or seam

  // the dome: a pixel semicircle cut into courses of blocks
  const { cx, base } = IGLOO;
  const r = 25;
  const seamRows = [5, 10, 15, 19];
  const blocks = [7, 7, 6, 5, 3]; // across each course, from the bottom
  for (let h = 0; h < r; h++) {
    const y = base - 1 - h;
    const half = Math.round(Math.sqrt(r * r - (h + 0.5) ** 2));
    const k = seamRows.filter((s) => s < h).length;
    const foot = Math.sqrt(r * r - ((k ? seamRows[k - 1] + 1 : 0) + 0.5) ** 2);
    const joints = [];
    for (let j = 1 - (k % 2); j < blocks[k]; j++) {
      const lon = -90 + (180 * (j + (k % 2) * 0.5)) / blocks[k];
      if (Math.abs(lon) < 80) joints.push(Math.floor(cx + foot * Math.sin(lon * rad)));
    }
    for (let x = cx - half; x < cx + half; x++) {
      const nx = (x + 0.5 - cx) / r;
      const ny = (h + 0.5) / r;
      const z = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny));
      const light = nx * 0.5 + ny * 0.55 + z * 0.67;
      // only the rim falls into shade, so the lit body reaches round to the tunnel
      const rim = z + nx * 0.3 + ny * 0.25;
      const band = light > 0.97 ? 4 : rim > 0.4 ? 3 : rim > 0.2 ? 2 : 1;
      seams.set(x, y, TONES[band === 4 ? 2 : band - 1]);
      const seam = seamRows.includes(h) || joints.includes(x);
      g.set(x, y, seam ? seams.get(x, y) : TONES[band]);
      parts.set(x, y, seam ? 'glowSeam' : 'glow');
    }
  }
  const solid = new Grid();
  for (const key of g.px.keys()) solid.px.set(key, 1);

  // the tunnel stands on the same ground as the dome, sticking out on its left
  const tx = cx - r - 6;
  const tunnel = new Grid();
  TUNNEL.forEach((row, j) => [...row].forEach((ch, i) => {
    const x = tx + i;
    const y = base - TUNNEL.length + j;
    if (ch === 'O') { if (solid.get(x, y)) tunnel.set(x, y, seams.get(x, y)); }
    else if (ch !== '.') tunnel.set(x, y, TUNNEL_COLORS[ch]);
  }));
  for (const [key, c] of tunnel.px) {
    g.px.set(key, c);
    solid.px.set(key, 1);
    // its blocks let the light through as well; the doorway is lit on its own
    if (c === 'door' || c === 'doorDeep') parts.px.delete(key);
    else parts.px.set(key, c === 'iglooLit' ? 'glow' : 'glowSeam');
  }
  outline(g, solid, 'iglooOut');
  for (let x = tx - 1; x < cx + r + 1; x++) {
    if (!solid.get(x, base)) g.set(x, base, 'shadow');
  }
  return { body: g, light: lamplight(parts, tx) };
}

// A lamp burns inside, just behind the reader. Its light is drawn as a layer of
// its own over the igloo so that it can flicker: it glows through the ice in
// dithered rings, carries on down the tunnel, fills the doorway and spills out
// of it across the snow.
const LAMP = { x: 250, y: 47, rx: 20, ry: 17 };

function lamplight(parts, tx) {
  const { base } = IGLOO;
  const BAYER = [[0, 2], [3, 1]];
  const dither = (x, y) => (BAYER[y % 2][x % 2] - 1.5) / 30;
  // the tunnel passes the light on to the door, never brighter than the dome's
  // outer ring, so the glow only ever fades on its way out
  const passage = { x: tx + 13, y: base - 5.5, rx: 13, ry: 8, max: 1 };
  const glow = (x, y, { x: lx, y: ly, rx, ry, max = 3 }) => {
    const d = Math.hypot((x + 0.5 - lx) / rx, (y + 0.5 - ly) / ry) + dither(x, y);
    return Math.min(max, d < 0.4 ? 3 : d < 0.72 ? 2 : d < 1 ? 1 : 0);
  };
  const g = new Grid();
  for (const [key, part] of parts.px) {
    const [x, y] = key.split(',').map(Number);
    const level = Math.max(glow(x, y, LAMP), glow(x, y, passage));
    if (level) g.set(x, y, part + level);
  }
  TUNNEL.forEach((row, j) => [...row].forEach((ch, i) => {
    if (ch === 'X' || ch === 'x') g.set(tx + i, base - TUNNEL.length + j, ch === 'X' ? 'doorLit' : 'doorJamb');
  }));
  // the doorway throws a low, wide patch of light out across the snow: a
  // bright core in a dimmer fringe, given row by row as tunnel columns
  const SPILL = [[-2, 9, 2, 7], [-5, 8, -1, 5], [-8, 4]];
  SPILL.forEach(([from, to, coreFrom = 0, coreTo = -1], k) => {
    for (let i = from; i <= to; i++) g.set(tx + i, base + k, i >= coreFrom && i <= coreTo ? 'spill2' : 'spill1');
  });
  return g;
}

// The penguin reading inside, seen only as its shadow on the ice: now and then
// it turns a page or glances up.
function reader() {
  const period = 13;
  const beats = [
    [0, 'read'], [3.6, 'turnA'], [3.74, 'turnB'], [3.88, 'turnC'], [4.02, 'read'], [7.4, 'look'], [8.9, 'read'],
    [10.6, 'turnA'], [10.74, 'turnB'], [10.88, 'turnC'], [11.02, 'read'],
  ];
  const frames = [...new Set(beats.map(([, v]) => v))];
  const css = frames.flatMap((frame) => [
    stepKeyframes(`rd-${frame}`, beats.map(([t, v]) => ({ t, v: v === frame ? 1 : 0 })), period, (v) => `opacity:${v}`),
    `.rd-${frame}{animation:rd-${frame} ${period}s steps(1,end) infinite}`,
  ]);
  const svg = frames.map((frame, i) => `<g class="rd-${frame}"${i ? ' opacity="0"' : ''}>${use(`reader_${frame}`)}</g>`).join('');
  return { svg: `<g transform="translate(${IGLOO.cx - 3} ${IGLOO.base})" opacity=".62">${svg}</g>`, css: css.join('\n') };
}

// One penguin has a session on the halfpipe. It rests on the left deck, drops
// in over the coping and pumps up speed: a kick turn just below the lip first,
// then airs that climb a little higher each time, turning round at the top and
// now and then grabbing the board, a kickflip across the flat, and at last an
// air back up onto the deck for another rest. It swings like a pendulum, slow
// near the top and fast across the flat, crouching through the bottom and
// leaning with the curve.
function skater() {
  const { x: cx, floor, flat, r } = PARK;
  const lip = floor - r;
  const GRAVITY = 26; // pixels per second squared
  const UP = 'cubic-bezier(.33,.67,.67,1)'; // slowing to a stop, as anything thrown up does
  const DOWN = 'cubic-bezier(.33,0,.67,.33)'; // and gathering speed again
  const rad = Math.PI / 180;
  // where the wheels touch a wall `deg` degrees up from its foot, and the lean
  const wall = (side, deg) => [cx + side * (flat + r * Math.sin(deg * rad)), lip + r * Math.cos(deg * rad), -side * deg];
  // how long it takes between two angles on a wall with the energy to reach
  // height h, summed in small steps since the speed changes all the way
  const along = (h, from, to) => {
    let dt = 0;
    for (let i = 0; i < 40; i++) {
      const deg = from + ((to - from) * (i + 0.5)) / 40;
      dt += (r * Math.abs(to - from) * rad) / 40 / Math.sqrt(2 * GRAVITY * (h - r * (1 - Math.cos(deg * rad))));
    }
    return dt;
  };

  const coping = cx - flat - r; // the left lip
  const rest = [coping - 3, lip, 0];
  let t = 0;
  const path = [{ t, x: rest[0], y: lip, a: 0, ease: 'linear' }];
  const face = [{ t, v: 1 }];
  const beats = [[0, 'ride']];
  const hops = [];
  const go = (dt, [x, y, a], ease = 'linear') => {
    path.at(-1).ease = ease;
    t += dt;
    path.push({ t, x, y, a, ease: 'linear' });
  };
  const wait = (dt) => go(dt, [path.at(-1).x, path.at(-1).y, path.at(-1).a]);
  const pose = (v, at = t) => beats.push([at, v]);
  // turning round shows it facing us for a moment
  const turn = (v, after = 'ride') => {
    pose('front', t - 0.08);
    face.push({ t, v });
    pose(after, t + 0.08);
  };
  // up a wall with the energy to reach height h; past the lip that is an air
  const climb = (side, h) => {
    const top = h < r ? Math.acos(1 - h / r) / rad : 90;
    let deg = 0;
    for (const next of [...[20, 40, 60, 75].filter((d) => d < top - 6), top]) {
      go(along(h, deg, next), wall(side, next), next === top && h < r ? UP : 'linear');
      deg = next;
    }
    return top;
  };
  const descend = (side, h, top) => {
    let deg = top;
    for (const next of [...[75, 60, 40, 20].filter((d) => d < top - 6), 0]) {
      go(along(h, next, deg), wall(side, next), deg === top && h <= r ? DOWN : 'linear');
      deg = next;
    }
  };
  // across the flat towards a wall, crouching low to pump, maybe kickflipping
  const cross = (side, h, kickflip) => {
    const dt = (2 * flat) / Math.sqrt(2 * GRAVITY * h);
    pose('crouch');
    if (kickflip) {
      const pop = t + dt / 2 - 0.22;
      hops.push({ t: pop, d: 0.4, h: 3 });
      beats.push([pop, 'ride'], [pop + 0.06, 'flipA'], [pop + 0.15, 'flipB'], [pop + 0.27, 'flipA'], [pop + 0.38, 'crouch']);
    }
    go(dt, [cx + side * flat, floor, 0]);
    pose('ride');
  };
  const visit = (side, h, grab) => {
    const top = climb(side, h);
    if (h < r) {
      // a kick turn: a moment at the top to pivot round on the tail
      wait(0.12);
      turn(-side);
      wait(0.12);
    } else {
      const [x, y, a] = wall(side, 90);
      const up = Math.sqrt((2 * (h - r)) / GRAVITY);
      if (grab) pose('grab', t + 0.1);
      go(up, [x, y - (h - r), a], UP);
      turn(-side, grab ? 'grab' : 'ride');
      go(up, [x, y, a], DOWN);
      if (grab) pose('ride', t - 0.1);
    }
    descend(side, h, top);
  };

  wait(2);
  go(0.6, [coping - 1, lip, 0], 'ease-in');
  go(0.3, wall(-1, 90), 'cubic-bezier(.5,0,1,1)'); // tipping in over the coping
  descend(-1, r, 90);
  const run = [[r * 0.8], [r + 1.5], [r + 2.5, true], [r + 3, false, true], [r + 3.5, true]];
  run.forEach(([h, grab, kickflip], i) => {
    const side = i % 2 ? -1 : 1;
    cross(side, h, kickflip);
    visit(side, h, grab);
  });
  // and an air back onto the deck, rolling to a stop where it started
  const last = 2.5; // how high it flies over the lip on the way out
  cross(-1, r + last);
  climb(-1, r + last);
  const up = Math.sqrt((2 * last) / GRAVITY);
  go(up, [coping - 2, lip - last, 45], UP);
  go(up, [coping - 2, lip, 0], DOWN);
  pose('crouch');
  pose('ride', t + 0.25);
  go(0.5, rest, UP);
  wait(0.6);
  turn(1);
  wait(1.4);

  const total = t;
  const timing = `${f(total)}s infinite`;
  const css = [
    `@keyframes skm{${path.map(({ t: at, x, y, a, ease }) =>
      `${pct(at, total)}{transform:translate(${f(x)}px,${f(y)}px) rotate(${f(a)}deg);animation-timing-function:${ease}}`).join('')}}`,
    `.skm{animation:skm ${timing} linear}`,
    stepKeyframes('skf', face, total, (v) => `transform:scaleX(${v})`),
    `.skf{animation:skf ${timing} steps(1,end)}`,
  ];
  const lift = hops.flatMap(({ t: at, d, h }) => [
    `${pct(at, total)}{transform:translateY(0);animation-timing-function:${UP}}`,
    `${pct(at + d / 2, total)}{transform:translateY(-${h}px);animation-timing-function:${DOWN}}`,
    `${pct(at + d, total)}{transform:translateY(0)}`,
  ]);
  css.push(`@keyframes sky{0%{transform:translateY(0)}${lift.join('')}100%{transform:translateY(0)}}`, `.sky{animation:sky ${timing} linear}`);
  beats.sort((a, b) => a[0] - b[0]);
  const frames = ['ride', 'crouch', 'front', 'grab', 'flipA', 'flipB'];
  for (const frame of frames) {
    css.push(stepKeyframes(`sk-${frame}`, beats.map(([at, v]) => ({ t: at, v: v === frame ? 1 : 0 })), total, (v) => `opacity:${v}`));
    css.push(`.sk-${frame}{animation:sk-${frame} ${timing} steps(1,end)}`);
  }
  const body = frames.map((frame, i) => `<g class="sk-${frame}"${i ? ' opacity="0"' : ''}>${use(`sk_${frame}`)}</g>`).join('');
  return {
    svg: `<g class="skm" transform="translate(${rest[0]} ${lip})"><g class="sky"><g class="skf">${body}</g></g></g>`,
    css: css.join('\n'),
  };
}

// ---------------------------------------------------------------- actors

// Turns a list of steps into keyframes for position, facing, pose and hops.
// Steps: ['walk', x] ['slide', x, seconds] ['jump', x, seconds, height]
// ['move', x, seconds, pose] ['face', ±1] ['hop', seconds, height]
// ['until', time, pose] ['mark', name] or [pose, seconds] to hold a pose. Marks
// note the time, for others to fall in with. The path has to end where it
// started and is padded with a rest up to `period`, so the loop is seamless.
function plan({ x, dir, speed, pose = 'stand', period, steps }) {
  const start = x;
  let t = 0;
  const marks = {};
  const move = [{ t, x, ease: 'linear' }];
  const face = [{ t, v: dir }];
  const poses = [{ t, v: pose }];
  const hops = [];
  const setPose = (v) => { if (poses.at(-1).v !== v) poses.push({ t, v }); };
  const setFace = (v) => { if (face.at(-1).v !== v) face.push({ t, v }); };
  const moveTo = (to, d, ease = 'linear') => {
    if (move.at(-1).t === t) move.at(-1).ease = ease;
    else move.push({ t, x, ease });
    t += d;
    x = to;
    move.push({ t, x, ease: 'linear' });
  };
  for (const [kind, a, b, c] of steps) {
    if (kind === 'walk') {
      if (a === x) throw new Error('zero-length walk');
      setFace(Math.sign(a - x));
      setPose('walk');
      moveTo(a, Math.abs(a - x) / speed);
    } else if (kind === 'slide') {
      setFace(Math.sign(a - x));
      setPose('slide');
      moveTo(a, b, 'cubic-bezier(.2,.75,.35,1)');
    } else if (kind === 'jump') {
      // a hop carried forward at an even pace, so the two trace an arc
      setFace(Math.sign(a - x));
      setPose('jump');
      hops.push({ t, d: b, h: c });
      moveTo(a, b);
    } else if (kind === 'move') {
      // getting about in some other pose, such as pushing something along
      setFace(Math.sign(a - x));
      setPose(c);
      moveTo(a, b);
    } else if (kind === 'until') {
      if (a < t) throw new Error(`already ${f(t)}s in, past ${f(a)}s`);
      setPose(b);
      t = a;
    } else if (kind === 'mark') {
      marks[a] = t;
    } else if (kind === 'face') {
      setFace(a);
    } else if (kind === 'hop') {
      setPose('stand');
      hops.push({ t, d: a, h: b });
      t += a;
    } else {
      setPose(kind === 'lie' ? 'slide' : kind);
      t += a;
    }
  }
  if (x !== start) throw new Error(`path ends at ${x} but starts at ${start}`);
  if (face.at(-1).v !== dir) throw new Error('path ends facing the wrong way');
  if (t > period) throw new Error(`path takes ${f(t)}s, longer than the ${period}s period`);
  setPose(pose === 'walk' ? 'stand' : pose);
  t = period;
  return { total: t, move, face, poses, hops, start, dir, marks };
}

function stepKeyframes(name, list, total, prop) {
  const frames = list.map(({ t, v }) => `${pct(t, total)}{${prop(v)}}`);
  return `@keyframes ${name}{${frames.join('')}100%{${prop(list[0].v)}}}`;
}

function actorCss(id, p) {
  const { total } = p;
  const css = [];
  const timing = `${f(total)}s infinite`;
  const move = p.move.map(({ t, x, ease }) =>
    `${pct(t, total)}{transform:translateX(${f(x - p.start)}px);animation-timing-function:${ease}}`);
  css.push(`@keyframes ${id}m{${move.join('')}}`);
  css.push(`.${id}m{animation:${id}m ${timing} linear}`);
  css.push(stepKeyframes(`${id}f`, p.face, total, (v) => `transform:scaleX(${v})`));
  css.push(`.${id}f{animation:${id}f ${timing} steps(1,end)}`);
  for (const pose of new Set(p.poses.map((s) => s.v))) {
    const list = [...p.poses.reduce((acc, s) => acc.set(s.t, s.v === pose ? 1 : 0), new Map())]
      .map(([t, v]) => ({ t, v }));
    css.push(stepKeyframes(`${id}-${pose}`, list, total, (v) => `opacity:${v}`));
    css.push(`.${id}-${pose}{animation:${id}-${pose} ${timing} steps(1,end)}`);
  }
  if (p.hops.length) {
    const frames = ['0%{transform:translateY(0)}'];
    for (const { t, d, h } of p.hops) {
      frames.push(`${pct(t, total)}{transform:translateY(0);animation-timing-function:cubic-bezier(.3,.6,.5,1)}`);
      frames.push(`${pct(t + d / 2, total)}{transform:translateY(-${h}px);animation-timing-function:cubic-bezier(.5,0,.7,.4)}`);
      frames.push(`${pct(t + d, total)}{transform:translateY(0)}`);
    }
    css.push(`@keyframes ${id}y{${frames.join('')}100%{transform:translateY(0)}}`);
    css.push(`.${id}y{animation:${id}y ${timing} linear}`);
  }
  return css.join('\n');
}

const use = (sprite, cls = '', opacity = 1) =>
  `<use href="#${sprite}"${cls ? ` class="${cls}"` : ''}${opacity === 1 ? '' : ` opacity="${opacity}"`}/>`;

// What a character looks like in each pose. `extra` is drawn on top (the blink).
const LOOKS = {
  penguin: {
    walk: () => use('p_walkA', 'wa wp') + use('p_walkB', 'wb wp', 0),
    stand: (extra) => use('p_stand') + extra,
    flap: () => use('p_flap', 'wa wf') + use('p_stand', 'wb wf', 0),
    slide: () => use('p_slide'),
  },
  chick: {
    walk: () => use('chick_a', 'wa wk') + use('chick_b', 'wb wk', 0),
    stand: () => use('chick_a'),
  },
  cat: {
    walk: () => use('cat_walkA', 'wa wc') + use('cat_walkB', 'wb wc', 0),
    stand: () => use('cat_stand'),
    sit: () => use('cat_sitA', 'wa ws') + use('cat_sitB', 'wb ws', 0),
    sleep: () => use('cat_sleep'),
    crouch: () => use('cat_crouch'),
    jump: () => use('cat_jump'),
  },
  pingu: {
    walk: () => use('pg_walkA', 'wa wp') + use('pg_walkB', 'wb wp', 0),
    stand: () => use('pg_stand'),
    happy: () => use('pg_happy'),
    hug: () => use('pg_hugA', 'wa ws') + use('pg_hugB', 'wb ws', 0),
    shock: () => use('pg_shock'),
    sad: () => use('pg_sad'),
    push: () => use('pg_pushA', 'wa wp') + use('pg_pushB', 'wb wp', 0),
    pick: () => use('pg_pushA'),
    lift: () => use('pg_lift'),
    place: () => use('pg_place'),
  },
};

// Drawn over a character while it holds a pose, at (x, y) from its feet.
const EXTRAS = {
  cat: { sleep: (theme) => snores(theme, 6, -19) },
  pingu: { hug: (theme) => hearts(theme, 3, -25), shock: (theme) => bang(theme, -1, -24) },
};

// Three z's drifting up from a sleeping head at (x, y).
function snores(theme, x, y) {
  const big = 'M0 0h5v1h-5zM3 1h1v1h-1zM2 2h1v1h-1zM1 3h1v1h-1zM0 4h5v1h-5z';
  const small = 'M0 0h4v1h-4zM2 1h1v1h-1zM1 2h1v1h-1zM0 3h4v1h-4z';
  const zs = [small, small, big].map((d, i) =>
    `<path class="zz" style="animation-delay:${f(-i * 0.9)}s" d="${d}" fill="${theme.zzz}"/>`).join('');
  return `<g transform="translate(${x} ${y})">${zs}</g>`;
}

// Hearts floating up from a hug at (x, y).
function hearts(theme, x, y) {
  const hs = [0, 1, 2].map((i) =>
    `<path class="ht" style="animation-delay:${f(-i * 1.1)}s" d="M${i * 2 - 2} 0h1v1h-1zM${i * 2} 0h1v1h-1zM${i * 2 - 2} 1h3v1h-3zM${i * 2 - 1} 2h1v1h-1z" fill="${theme.p}"/>`).join('');
  return `<g transform="translate(${x} ${y})">${hs}</g>`;
}

// A startled '!' at (x, y).
function bang(theme, x, y) {
  return `<path d="M${x} ${y}h1v3h-1zM${x} ${y + 4}h1v1h-1z" fill="${theme.accent}"/>`;
}

function actorSvg(theme, actor, p) {
  const { id, kind, lane, blinkDelay = 0, shadow = 12, companion, bed } = actor;
  const poses = [...new Set(p.poses.map((s) => s.v))];
  const flip = p.dir < 0 ? ' transform="scale(-1 1)"' : '';
  const shadowPath = (w, dx = 0) => `<path class="sh" d="M${dx - w / 2} 0h${w}v1h-${w}z"/>`;
  // one group per pose; only the active one is visible
  const body = (look) => poses.map((pose) => {
    const blink = `<rect class="blink" x="2" y="-13" width="1" height="1" fill="${theme.w}" opacity="0" style="animation-delay:${blinkDelay}s"/>`;
    const draw = look[pose] ?? look.stand;
    return `<g class="${id}-${pose}"${pose === p.poses[0].v ? '' : ' opacity="0"'}>${draw(blink)}</g>`;
  }).join('');
  let main = `<g class="${id}f"${flip}>${body(LOOKS[kind])}</g>`;
  if (p.hops.length) main = `<g class="${id}y">${main}</g>`;
  // a companion keeps a fixed offset and copies the poses it knows
  let follower = '';
  if (companion) {
    const { kind: ck, dx } = companion;
    follower = `${shadowPath(8, dx)}<g transform="translate(${dx} 0)"><g class="${id}f"${flip}>${body(LOOKS[ck])}</g></g>`;
  }
  for (const [pose, draw] of Object.entries(EXTRAS[kind] ?? {})) {
    if (!poses.includes(pose)) continue;
    const shown = p.poses[0].v === pose ? '' : ' opacity="0"';
    main += `<g class="${id}-${pose}"${shown}>${draw(theme)}</g>`;
  }
  const figure = `<g class="${id}m">${shadowPath(shadow)}${follower}${main}</g>`;
  // a bed sits at the starting spot, wrapped around whoever is in it
  const [behind, before] = bed ? [shadowPath(30) + use('bed_back'), use('bed_front')] : ['', ''];
  return `<g transform="translate(${p.start} ${lane})">${behind}${figure}${before}</g>`;
}

// Where a plan has its actor at time t.
function whereAt(p, t) {
  const i = p.move.findIndex((k) => k.t > t);
  if (i < 1) return p.move.at(-1).x;
  const [a, b] = [p.move[i - 1], p.move[i]];
  return a.x + ((b.x - a.x) * (t - a.t)) / (b.t - a.t);
}

// Pingu's snowman, at the front on the right, and the snow it is made of. A
// heap is left of the last one: Pingu rolls the body out of it and the head out
// of what remains, lifts the head on and gives it its hat, until Muezza pounces
// and the lot tumbles back into a heap. It keeps time with the marks the two of
// them leave in their plans.
const SNOWMAN = { x: 232, lane: 83 };

function snowman({ m, pg }) {
  const { x, lane } = SNOWMAN;
  const heap = [x + 18, lane + 1];
  const dropped = [x - 20, lane + 2]; // where the hat comes down
  const front = lane + 2; // the head is rolled a little in front of the body
  const knock = m.marks.pounce;
  const fallen = knock + 0.5;
  const { body, bodyDone, head, headDone, lift, pick, place } = pg.marks;
  const lifted = lift + 1;
  const placed = place + 0.8;
  const UP = 'cubic-bezier(.33,.67,.67,1)';
  const DOWN = 'cubic-bezier(.33,0,.67,.33)';
  // a snowball rolls along just ahead of Pingu's flippers, by its right-hand edge
  const edge = (t) => whereAt(pg, t) - 7;
  const stand = edge(bodyDone); // where the body ends up
  const onBody = [stand - 2, lane - 10];
  const hat = [x, onBody[1] - 7];

  const css = [];
  const travel = (name, keys) => {
    const frames = keys.map(([t, [kx, ky], ease = 'linear']) =>
      `${pct(t, PERIOD)}{transform:translate(${f(kx)}px,${f(ky)}px);animation-timing-function:${ease}}`);
    css.push(`@keyframes ${name}{${frames.join('')}}`, `.${name}{animation:${name} ${PERIOD}s linear infinite}`);
  };
  // shown between `from` and `to`, or hidden then if `hide` is set
  const shown = (name, from, to, hide = false) => {
    const list = [{ t: 0, v: hide ? 1 : 0 }, { t: from, v: hide ? 0 : 1 }, { t: to, v: hide ? 1 : 0 }];
    css.push(stepKeyframes(name, list, PERIOD, (v) => `opacity:${v}`), `.${name}{animation:${name} ${PERIOD}s steps(1,end) infinite}`);
    return `<g class="${name}"${hide ? '' : ' opacity="0"'}>`;
  };
  // a snowball growing a size at a time as it is rolled, the last size kept on
  const growing = (name, from, to, sizes, until) => sizes.map((d, i) => {
    const step = (to - from) / sizes.length;
    return `${shown(`${name}${d}`, from + i * step, i === sizes.length - 1 ? until : from + (i + 1) * step)}${use(`sm_ball${d}`)}</g>`;
  }).join('');

  travel('smb', [
    [0, [edge(body), lane]], [body, [edge(body), lane]], [bodyDone, [stand, lane]],
    [knock, [stand, lane], 'cubic-bezier(.2,.7,.4,1)'], [fallen, [heap[0] + 6, lane]], [fallen + 0.05, [edge(body), lane]],
    [PERIOD, [edge(body), lane]],
  ]);
  travel('smh', [
    [0, [edge(head), front]], [head, [edge(head), front]], [headDone, [edge(headDone), front]],
    [lift, [edge(headDone), front], UP], [lift + 0.6, [onBody[0] + 3, onBody[1] - 4], DOWN], [lifted, onBody],
    [knock, onBody, UP], [knock + 0.2, [onBody[0] + 8, onBody[1] - 3], DOWN], [fallen, [heap[0] + 4, heap[1]]],
    [fallen + 0.05, [edge(head), front]], [PERIOD, [edge(head), front]],
  ]);
  travel('smc', [
    [0, dropped], [placed - 0.05, dropped], [placed, hat], [knock, hat, UP],
    [knock + 0.3, [x - 9, hat[1] - 5], DOWN], [knock + 0.65, dropped], [PERIOD, dropped],
  ]);
  const svg = [
    // the heap shrinks as the snow is rolled up out of it
    `<g transform="translate(${heap[0]} ${heap[1]})">`,
    `${shown('smxc', body + 2.3, fallen, true)}${use('sm_heapC')}</g>`,
    `${shown('smxb', body + 2.3, head + 1.2)}${use('sm_heapB')}</g>`,
    `${shown('smxa', head + 1.2, head + 2.4)}${use('sm_heapA')}</g></g>`,
    `<g class="smb">${growing('smb', body, bodyDone, [2, 3, 4, 5, 6, 7, 8, 9], fallen)}</g>`,
    `<g class="smh">${growing('smh', head, headDone, [2, 3, 4, 5, 6], lifted)}${shown('smhf', lifted, fallen)}${use('sm_head')}</g></g>`,
    `${shown('smcs', pick + 0.3, placed, true)}<g class="smc">${use('sm_hat')}</g></g>`,
  ].join('');
  return { svg, css: css.join('\n') };
}

// ---------------------------------------------------------------- cast

// Everyone shares one period so the scene can be choreographed.
const PERIOD = 56;

// Back to front. Lanes are the y of the ground each actor walks on.
const CAST = [
  {
    // lives by the igloo and gets excited now and then
    id: 'e', kind: 'penguin', lane: 59, blinkDelay: -1.3,
    plan: { x: 200, dir: -1, speed: 6, steps: [
      ['stand', 2.5], ['flap', 1.2], ['walk', 178], ['stand', 2], ['hop', 0.45, 4], ['stand', 0.3],
      ['hop', 0.45, 4], ['stand', 2], ['walk', 258], ['stand', 4], ['flap', 1], ['stand', 2],
      ['walk', 200], ['stand', 3], ['face', 1], ['stand', 2.5], ['flap', 0.8], ['stand', 1.5], ['face', -1],
    ] },
  },
  {
    // the wanderer at the back
    id: 'a', kind: 'penguin', lane: 65, blinkDelay: -3.1,
    plan: { x: 150, dir: -1, speed: 7, pose: 'walk', steps: [
      ['walk', 96], ['stand', 2.5], ['face', 1], ['stand', 1], ['face', -1], ['stand', 0.8],
      ['walk', 62], ['stand', 2.5], ['walk', 176], ['stand', 3], ['walk', 130], ['stand', 2], ['face', 1],
      ['stand', 1], ['walk', 150], ['stand', 0.8], ['face', -1],
    ] },
  },
  {
    // a parent with its chick in tow
    id: 'c', kind: 'penguin', lane: 71, blinkDelay: -2.2, companion: { kind: 'chick', dx: -13 },
    plan: { x: 120, dir: 1, speed: 5.5, pose: 'walk', steps: [
      ['walk', 208], ['stand', 3], ['walk', 96], ['stand', 2], ['flap', 1], ['stand', 1.5], ['face', 1],
      ['stand', 1], ['walk', 120],
    ] },
  },
  {
    // Muezza naps while Pingu builds his snowman, then jumps out for a round,
    // pounces on the snowman to play, and runs back to bed when it falls apart
    id: 'm', kind: 'cat', lane: 78, shadow: 16, bed: true,
    plan: { x: 30, dir: 1, speed: 12, pose: 'sleep', steps: [
      ['sleep', 25.5], ['sit', 2], ['jump', 64, 0.7, 10], ['crouch', 0.25], ['walk', 120], ['sit', 3], ['walk', 206],
      ['sit', 1.2], ['crouch', 0.7], ['jump', 216, 0.45, 4], ['mark', 'pounce'], ['stand', 0.3], ['hop', 0.4, 5],
      ['face', -1], ['move', 64, 5, 'walk'], ['stand', 0.4], ['crouch', 0.3], ['jump', 30, 0.7, 10], ['sit', 1.5],
      ['face', 1], ['sit', 1.2],
    ] },
  },
  {
    // walks to the left edge and belly-slides back across the field
    id: 'b', kind: 'penguin', lane: 84, blinkDelay: -0.4,
    plan: { x: 170, dir: -1, speed: 7, pose: 'walk', steps: [
      ['walk', 74], ['stand', 1.5], ['face', 1], ['stand', 0.8], ['slide', 160, 5], ['lie', 1],
      ['stand', 2], ['walk', 120], ['stand', 2.5], ['flap', 1], ['stand', 1.5], ['walk', 170],
      ['stand', 1], ['face', -1],
    ] },
  },
  {
    // Pingu builds a snowman out of a heap of snow, hugs it, steps back to
    // admire it, and gets a fright when Muezza knocks it back into a heap
    id: 'pg', kind: 'pingu', lane: 86, shadow: 12,
    plan: ({ m }) => ({ x: 258, dir: -1, speed: 6, steps: [
      ['stand', 0.6], ['mark', 'body'], ['move', 245, 7, 'push'], ['mark', 'bodyDone'], ['stand', 0.4], ['face', 1],
      ['walk', 258], ['face', -1], ['stand', 0.3], ['mark', 'head'], ['move', 253, 3.5, 'push'], ['mark', 'headDone'],
      ['stand', 0.3], ['mark', 'lift'], ['lift', 1], ['hop', 0.4, 3], ['walk', 222], ['mark', 'pick'], ['pick', 0.6],
      ['face', 1], ['mark', 'place'], ['place', 0.8], ['happy', 1.5], ['until', m.marks.pounce - 9.5, 'hug'],
      ['walk', 258], ['face', -1], ['until', m.marks.pounce - 1.5, 'happy'], ['until', m.marks.pounce + 0.15, 'stand'],
      ['shock', 1.3], ['sad', 3],
    ] }),
  },
];

// ---------------------------------------------------------------- text

const LINES = [
  [['Currently building '], ['Muezza', true], [' and learning new things along the way.']],
  [['I enjoy dabbling in all kinds of tech.']],
];
const FONT = `ui-monospace,SFMono-Regular,'SF Mono',Menlo,Consolas,'Liberation Mono',monospace`;
const FONT_SIZE = 14;
const ADV = 8.4; // 0.6em, the advance of the common monospace fonts
const LINE_Y = [30, 54];
const TYPE_START = 0.9;
const TYPE_EVERY = 0.042;
const LINE_PAUSE = 0.55;

// Every glyph is its own <text> at a fixed cell, so the typing lines up no
// matter which monospace font the viewer ends up with.
function typedText(theme) {
  const lines = LINES.map((parts) => parts.flatMap(([s, bold]) => [...s].map((ch) => ({ ch, bold }))));
  const glyphs = [];
  const caret = []; // where the caret is at which time
  let at = TYPE_START;
  lines.forEach((chars, li) => {
    const x0 = Math.round((W * PX - chars.length * ADV) / 2);
    const y = LINE_Y[li];
    if (li > 0) at += LINE_PAUSE;
    caret.push({ t: li > 0 ? at - 0.25 : 0, x: x0, y });
    caret.push({ t: at, x: x0, y, typing: chars.length });
    chars.forEach(({ ch, bold }, i) => {
      if (ch === ' ') return;
      const style = bold ? ` font-weight="700" fill="${theme.accent}"` : '';
      glyphs.push(`<text x="${f(x0 + (i + 0.5) * ADV)}" y="${y}"${style} class="ch" style="animation-delay:${f(at + i * TYPE_EVERY)}s">${ch}</text>`);
    });
    at += chars.length * TYPE_EVERY;
    caret.push({ t: at, x: x0 + chars.length * ADV, y });
  });
  const end = at;
  // the caret rests after the last glyph; keyframes move it relative to that
  const rest = caret.at(-1);
  const frames = caret.map(({ t, x, y, typing }) =>
    `${pct(t, end)}{transform:translate(${f(x - rest.x)}px,${y - rest.y}px);animation-timing-function:${typing ? `steps(${typing},start)` : 'steps(1,end)'}}`);
  const css = [
    '@keyframes type{from{opacity:0}to{opacity:1}}',
    '.ch{animation:type .01s linear both}',
    `@keyframes caret{${frames.join('')}}`,
    `.caret{animation:caret ${f(end)}s linear both}`,
    '@keyframes blinker{0%{opacity:1}50%{opacity:0}}',
    `.blinker{animation:blinker 1.06s steps(1,end) ${f(end)}s infinite}`,
  ];
  const svg = `<g font-family="${FONT}" font-size="${FONT_SIZE}" fill="${theme.text}" text-anchor="middle">${glyphs.join('')}</g>`
    + `<g class="caret"><rect class="blinker" x="${f(rest.x + 2)}" y="${rest.y - 12}" width="${ADV - 1}" height="15" fill="${theme.accent}"/></g>`;
  return { svg, css: css.join('\n') };
}

// ---------------------------------------------------------------- snowfall

function snowfall() {
  const r = rng(42);
  const flakes = [];
  for (let i = 0; i < 34; i++) {
    const x = Math.floor(r() * W);
    flakes.push({
      x,
      // flakes under the text start below it, the rest fall from the top
      top: x > 44 && x < 236 ? 22 : -2,
      land: HORIZON + 2 + Math.floor(r() * (H - HORIZON - 4)),
      dur: f(9 + r() * 9),
      delay: f(-r() * 18),
      sway: f(2.2 + r() * 2),
      big: r() > 0.85,
    });
  }
  return flakes;
}

// ---------------------------------------------------------------- build

function build(name) {
  const theme = THEMES[name];
  const css = [];

  const defs = Object.entries(SPRITES)
    .map(([id, s]) => `<g id="${id}">${pixelPaths(spritePixels(s), theme)}</g>`)
    .join('');

  // sky and land, faded out towards both edges
  let backdrop = '';
  if (name === 'dark') {
    backdrop += STARS.map(([x, y], i) => {
      const twinkle = i % 3 === 0 ? ` class="tw" style="animation-delay:${f(-i * 0.7)}s"` : '';
      const big = i % 7 === 3;
      const d = big ? `M${x} ${y - 1}h1v3h-1zM${x - 1} ${y}h3v1h-3z` : `M${x} ${y}h1v1h-1z`;
      return `<path d="${d}" fill="${theme.star}" opacity="${big ? 0.9 : 0.55}"${twinkle}/>`;
    }).join('');
  }
  backdrop += [moon(name), ridge(), ground(), iceberg()].map((g) => g.svg(theme)).join('');
  backdrop += [[92, 62], [118, 54], [196, 66], [70, 74], [150, 83], [246, 76], [12, 66], [204, 51]]
    .map(([x, y], i) => `<path class="tw" style="animation-delay:${f(-i * 1.3)}s" d="M${x} ${y}h1v1h-1z" fill="${theme.sparkle}"/>`)
    .join('');
  css.push('@keyframes tw{0%,100%{opacity:.15}50%{opacity:1}}');
  css.push('.tw{animation:tw 3.2s ease-in-out infinite}');

  // the skatepark and its skater
  const rider = skater();
  css.push(rider.css);

  // the igloo, with a flickering lamp and a reader inside
  const home = igloo();
  const lamp = reader();
  css.push(lamp.css);
  css.push('@keyframes lamp{0%,100%{opacity:1}9%{opacity:.86}14%{opacity:.97}31%{opacity:.9}38%{opacity:1}57%{opacity:.84}63%{opacity:.95}80%{opacity:.89}}');
  css.push('.lamp{animation:lamp 2.7s linear infinite}');

  // a plan can be written around the plans before it, to keep time with them
  const plans = {};
  const actors = CAST.map((actor) => {
    const p = plan({ period: PERIOD, ...(typeof actor.plan === 'function' ? actor.plan(plans) : actor.plan) });
    plans[actor.id] = p;
    css.push(actorCss(actor.id, p));
    return actorSvg(theme, actor, p);
  });
  // Pingu's snowman stands just behind him
  const props = snowman(plans);
  css.push(props.css);
  actors.splice(CAST.findIndex((actor) => actor.id === 'pg'), 0, props.svg);

  // walk cycles, flapping, tail swish, blinking
  css.push('@keyframes fr{0%{opacity:1}50%{opacity:0}}');
  css.push('.wa,.wb{animation:fr .5s steps(1,end) infinite}');
  css.push('.wp{animation-duration:.52s}.wp.wb{animation-delay:-.26s}');
  css.push('.wk{animation-duration:.32s}.wk.wb{animation-delay:-.16s}');
  css.push('.wc{animation-duration:.4s}.wc.wb{animation-delay:-.2s}');
  css.push('.wf{animation-duration:.24s}.wf.wb{animation-delay:-.12s}');
  css.push('.ws{animation-duration:1.7s}.ws.wb{animation-delay:-.85s}');
  css.push('@keyframes zz{0%{transform:translate(0,0);opacity:0}15%,75%{opacity:1}100%{transform:translate(5px,-10px);opacity:0}}');
  css.push('.zz{opacity:0;animation:zz 2.7s linear infinite}');
  css.push('@keyframes ht{0%{transform:translate(0,0);opacity:0}20%,70%{opacity:1}100%{transform:translate(-2px,-8px);opacity:0}}');
  css.push('.ht{opacity:0;animation:ht 3.3s linear infinite}');
  css.push('@keyframes blink{0%{opacity:0}95%{opacity:1}98%{opacity:0}}');
  css.push('.blink{animation:blink 4.6s steps(1,end) infinite}');
  css.push(`.sh{fill:${theme.shadow}}`);

  const flakes = snowfall();
  const falls = new Map();
  const snow = flakes.map(({ x, top, land, dur, delay, sway, big }) => {
    const key = `${top < 0 ? 'a' : 'b'}${land}`;
    falls.set(key, land - top);
    const d = `M${x} ${top}${big ? 'h2v2h-2z' : 'h1v1h-1z'}`;
    return `<g class="sw" style="animation-duration:${sway}s;animation-delay:${f(delay / 3)}s"><path class="fall f${key}" style="animation-duration:${dur}s;animation-delay:${delay}s" d="${d}" fill="${theme.flake}"/></g>`;
  }).join('');
  for (const [key, dy] of falls)
    css.push(`@keyframes f${key}{0%{transform:translateY(0);opacity:0}8%{opacity:.9}88%{opacity:.9}100%{transform:translateY(${dy}px);opacity:0}}.f${key}{animation-name:f${key}}`);
  css.push('.fall{opacity:0;animation-timing-function:linear;animation-iteration-count:infinite}');
  css.push('@keyframes sw{from{transform:translateX(-1.5px)}to{transform:translateX(1.5px)}}');
  css.push('.sw{animation:sw 3s ease-in-out infinite alternate}');

  const text = typedText(theme);
  css.push(text.css);

  css.push('@media (prefers-reduced-motion:reduce){*{animation:none!important}.fall{opacity:0}}');

  const alt = 'Currently building Muezza and learning new things along the way. I enjoy dabbling in all kinds of tech. Below, five penguins wander across a snowfield between an iceberg and a glowing igloo, where another reads a book by lamplight, seen only as its shadow on the ice. Far back by the horizon, a penguin has a session on a small halfpipe: it drops in, pumps up speed, turns in the air over the lips, kickflips across the flat and airs back onto the deck for a rest. In front on the right, Pingu in white earmuffs and a light blue scarf rolls a snowman out of a heap of snow, gives it a pink hat and hugs it, while Muezza the cat naps in a bed labeled MUEZZA. Then she wakes, jumps out, pounces on the snowman to play, knocks it back into a heap and runs back to bed.';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W * PX}" height="${H * PX}" viewBox="0 0 ${W * PX} ${H * PX}" role="img" aria-label="${alt}">
<style>
${css.join('\n')}
</style>
<defs>
<linearGradient id="edge"><stop offset="0" stop-color="#000"/><stop offset=".07" stop-color="#fff"/><stop offset=".93" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient>
<linearGradient id="foot" x2="0" y2="1"><stop offset="0" stop-opacity="0"/><stop offset="1"/></linearGradient>
<mask id="fade" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="url(#edge)"/><rect y="${H - 5}" width="${W}" height="5" fill="url(#foot)"/></mask>
${defs}
</defs>
<g transform="scale(${PX})" shape-rendering="crispEdges">
<g mask="url(#fade)">${backdrop}</g>
${halfpipe().svg(theme)}
${rider.svg}
${home.body.svg(theme)}
<g class="lamp">${home.light.svg(theme)}${lamp.svg}</g>
${actors.join('')}
${snow}
</g>
${text.svg}
</svg>
`;
}

for (const name of Object.keys(THEMES)) {
  const svg = build(name);
  writeFileSync(`${OUT}home-${name}.svg`, svg);
  console.log(`home-${name}.svg  ${(svg.length / 1024).toFixed(1)} KB`);
}

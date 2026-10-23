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

// A snow-block igloo in the same flat, outlined style as the rest of the scene:
// a dome of block courses lit from the top right, with the tunnel on its left.
function igloo() {
  const TONES = ['iglooSeam', 'iglooDark', 'iglooMid', 'iglooLit', 'iglooHi'];
  const rad = Math.PI / 180;
  const g = new Grid();
  const seams = new Grid(); // the seam tone at each pixel of the dome

  // the dome: a pixel semicircle cut into courses of blocks
  const cx = 247;
  const base = 57; // the row just below the igloo
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
  }
  outline(g, solid, 'iglooOut');
  for (let x = tx - 1; x < cx + r + 1; x++) {
    if (!solid.get(x, base)) g.set(x, base, 'shadow');
  }
  return g;
}

// ---------------------------------------------------------------- actors

// Turns a list of steps into keyframes for position, facing, pose and hops.
// Steps: ['walk', x] ['slide', x, seconds] ['face', ±1] ['hop', seconds, height]
// or [pose, seconds] to hold a pose. The path has to end where it started and
// is padded with a rest up to `period`, so the loop is seamless.
function plan({ x, dir, speed, pose = 'stand', period, steps }) {
  const start = x;
  let t = 0;
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
  for (const [kind, a, b] of steps) {
    if (kind === 'walk') {
      if (a === x) throw new Error('zero-length walk');
      setFace(Math.sign(a - x));
      setPose('walk');
      moveTo(a, Math.abs(a - x) / speed);
    } else if (kind === 'slide') {
      setFace(Math.sign(a - x));
      setPose('slide');
      moveTo(a, b, 'cubic-bezier(.2,.75,.35,1)');
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
  return { total: t, move, face, poses, hops, start, dir };
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
  },
};

// Three z's drifting up from a sleeping head at (x, y).
function snores(theme, x, y) {
  const big = 'M0 0h5v1h-5zM3 1h1v1h-1zM2 2h1v1h-1zM1 3h1v1h-1zM0 4h5v1h-5z';
  const small = 'M0 0h4v1h-4zM2 1h1v1h-1zM1 2h1v1h-1zM0 3h4v1h-4z';
  const zs = [small, small, big].map((d, i) =>
    `<path class="zz" style="animation-delay:${f(-i * 0.9)}s" d="${d}" fill="${theme.zzz}"/>`).join('');
  return `<g transform="translate(${x} ${y})">${zs}</g>`;
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
  if (poses.includes('sleep')) {
    const shown = p.poses[0].v === 'sleep' ? '' : ' opacity="0"';
    main += `<g class="${id}-sleep"${shown}>${snores(theme, 6, -19)}</g>`;
  }
  const figure = `<g class="${id}m">${shadowPath(shadow)}${follower}${main}</g>`;
  // a bed sits at the starting spot, wrapped around whoever is in it
  const [behind, before] = bed ? [shadowPath(30) + use('bed_back'), use('bed_front')] : ['', ''];
  return `<g transform="translate(${p.start} ${lane})">${behind}${figure}${before}</g>`;
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
    // Muezza naps in the bed, makes a round and comes back to it
    id: 'm', kind: 'cat', lane: 78, shadow: 16, bed: true,
    plan: { x: 30, dir: 1, speed: 12, pose: 'sleep', steps: [
      ['sleep', 5], ['sit', 2], ['walk', 120], ['sit', 4], ['walk', 206], ['stand', 0.8], ['face', -1],
      ['stand', 0.5], ['walk', 170], ['sit', 3.5], ['walk', 30], ['sit', 1.5], ['face', 1], ['sit', 1.2],
    ] },
  },
  {
    // walks to the left edge and belly-slides back across the whole field
    id: 'b', kind: 'penguin', lane: 84, blinkDelay: -0.4,
    plan: { x: 170, dir: -1, speed: 7, pose: 'walk', steps: [
      ['walk', 74], ['stand', 1.5], ['face', 1], ['stand', 0.8], ['slide', 232, 5.5], ['lie', 1],
      ['stand', 2], ['walk', 120], ['stand', 2.5], ['flap', 1], ['stand', 1.5], ['walk', 170],
      ['stand', 1], ['face', -1],
    ] },
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

  const actors = CAST.map((actor) => {
    const p = plan({ period: PERIOD, ...actor.plan });
    css.push(actorCss(actor.id, p));
    return actorSvg(theme, actor, p);
  }).join('');

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

  const alt = 'Currently building Muezza and learning new things along the way. I enjoy dabbling in all kinds of tech. Below, five penguins wander across a snowfield between an iceberg and an igloo, while Muezza the cat naps in a bed labeled MUEZZA and goes for a stroll.';
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
${igloo().svg(theme)}
${actors}
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

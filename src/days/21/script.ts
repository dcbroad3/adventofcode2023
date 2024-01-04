import { getLines } from 'src/helpers';

const directions: [number, number][] = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

function getStart(input: string[][]): [number, number] {
  for (let r = 0; r < input.length; r++) {
    for (let c = 0; c < input[0].length; c++) {
      if (input[r][c] === 'S') return [r, c];
    }
  }

  return [-1, -1];
}

function key(r: number, c: number): string {
  return `${r},${c}`;
}

function fill(sr: number, sc: number, ss: number, grid: string[][]): number {
  const ans = new Set<string>();
  const seen = new Set<string>();
  const q: [number, number, number][] = [[sr, sc, ss]];

  while (q.length) {
    const [r, c, s] = q.shift()!;
    if (s % 2 === 0) ans.add(key(r, c));
    if (s === 0) continue;

    for (const [dr, dc] of directions) {
      const nr = r + dr;
      const nc = c + dc;
      const k = key(nr, nc);
      const val = grid[nr]?.[nc];
      if (val == null || val === '#' || seen.has(k)) continue;

      seen.add(k);
      q.push([nr, nc, s - 1]);
    }
  }

  return ans.size;
}

export function day21part1(): number {
  const grid = getLines(21).map((l) => l.split(''));
  const [sr, sc] = getStart(grid);
  const steps = 64;
  return fill(sr, sc, steps, grid);
}

export function day21part2(): number {
  const grid = getLines(21).map((l) => l.split(''));
  const [sr, sc] = getStart(grid);
  const steps = 26501365;
  const size = grid.length;
  const gridWidth = Math.floor(steps / size) - 1;
  const odd = Math.pow(Math.floor(gridWidth / 2) * 2 + 1, 2);
  const even = Math.pow(Math.floor((gridWidth + 1) / 2) * 2, 2);

  const oddPoints = fill(sr, sc, size * 2 + 1, grid);
  const evenPoints = fill(sr, sc, size * 2, grid);

  const cornerTop = fill(size - 1, sc, size - 1, grid);
  const cornerRight = fill(sr, 0, size - 1, grid);
  const cornerBottom = fill(0, sc, size - 1, grid);
  const cornerLeft = fill(sr, size - 1, size - 1, grid);

  const smallSteps = Math.floor(size / 2) - 1;
  const smallTopRight = fill(size - 1, 0, smallSteps, grid);
  const smallBottomRight = fill(0, 0, smallSteps, grid);
  const smallBottomLeft = fill(0, size - 1, smallSteps, grid);
  const smallTopLeft = fill(size - 1, size - 1, smallSteps, grid);

  const largeSteps = Math.floor((size * 3) / 2) - 1;
  const largeTopRight = fill(size - 1, 0, largeSteps, grid);
  const largeBottomRight = fill(0, 0, largeSteps, grid);
  const largeBottomLeft = fill(0, size - 1, largeSteps, grid);
  const largeTopLeft = fill(size - 1, size - 1, largeSteps, grid);

  const result =
    odd * oddPoints +
    even * evenPoints +
    cornerTop +
    cornerRight +
    cornerBottom +
    cornerLeft +
    (gridWidth + 1) *
      (smallTopRight + smallBottomRight + smallBottomLeft + smallTopLeft) +
    gridWidth *
      (largeTopRight + largeBottomRight + largeBottomLeft + largeTopLeft);

  return result;
}

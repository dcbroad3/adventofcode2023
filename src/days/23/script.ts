import { getLines } from 'src/helpers';

type Point = [number, number];

function getDistance(dirs: Record<string, Point[]>): number {
  const grid = getLines(23).map((l) => l.split(''));
  const start: Point = [0, grid[0].indexOf('.')];
  const end: Point = [grid.length - 1, grid[grid.length - 1].indexOf('.')];
  const points: Point[] = [start, end];

  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      if (grid[r][c] === '#') continue;
      let neighbors = 0;
      for (const [nr, nc] of [
        [r - 1, c],
        [r + 1, c],
        [r, c - 1],
        [r, c + 1],
      ]) {
        const v = grid[nr]?.[nc];
        if (v != null && v !== '#') neighbors++;
      }

      if (neighbors > 2) points.push([r, c]);
    }
  }

  const graph: Record<string, Record<string, number>> = {};
  const pointsSet = new Set(points.map((p) => p.join(',')));
  points.forEach((pt) => {
    const [sr, sc] = pt;
    const stack = [[0, sr, sc]];
    const startKey = pt.join(',');
    const seen = new Set([startKey]);

    while (stack.length) {
      const [n, r, c] = stack.pop()!;
      const destKey = [r, c].join(',');
      if (n !== 0 && pointsSet.has(destKey)) {
        if (graph[startKey] == null) graph[startKey] = {};
        graph[startKey][destKey] = n;
        continue;
      }

      for (const [dr, dc] of dirs[grid[r][c]]) {
        const nr = r + dr;
        const nc = c + dc;
        const key = [nr, nc].join(',');
        const v = grid[nr]?.[nc];
        if (v != null && v !== '#' && !seen.has(key)) {
          stack.push([n + 1, nr, nc]);
          seen.add(key);
        }
      }
    }
  });

  const endKey = end.join(',');
  const seen = new Set();
  function dfs(pt: string): number {
    if (pt === endKey) return 0;

    let m = -Infinity;
    seen.add(pt);
    for (const nx of Object.keys(graph[pt])) {
      if (seen.has(nx)) continue;
      m = Math.max(m, dfs(nx) + graph[pt][nx]);
    }

    seen.delete(pt);

    return m;
  }

  const startKey = start.join(',');
  return dfs(startKey);
}

const allDirs: Point[] = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

export function day23part1(): number {
  const dirs: Record<string, Point[]> = {
    '^': [[-1, 0]],
    v: [[1, 0]],
    '<': [[0, -1]],
    '>': [[0, 1]],
    '.': allDirs,
  };
  return getDistance(dirs);
}

export function day23part2(): number {
  const dirs: Record<string, Point[]> = {
    '^': allDirs,
    v: allDirs,
    '<': allDirs,
    '>': allDirs,
    '.': allDirs,
  };
  return getDistance(dirs);
}

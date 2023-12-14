import { getLines } from 'src/helpers';

function testMirror(values: string | string[], index: number): boolean {
  for (let i = 0; i < values.length; i++) {
    const right = values[index + i];
    const left = values[index - i - 1];
    if (!right || !left) return true;
    if (right !== left) return false;
  }

  return true;
}

function getSetMatches(set: string[]): [number[], number[]] {
  let verticals: number[] = [];
  let horizontals: number[] = [];

  for (let i = 1; i < set[0].length; i++) {
    if (testMirror(set[0], i)) verticals.push(i);
  }

  const firstCol = set.map((s) => s[0]);
  for (let i = 1; i < set.length; i++) {
    if (testMirror(firstCol, i)) horizontals.push(i);
  }

  for (let i = 1; i < set.length; i++) {
    if (!verticals.length) break;
    verticals = verticals.filter((v) => testMirror(set[i], v));
  }

  for (let i = 1; i < set[0].length; i++) {
    if (!horizontals.length) break;
    const col = set.map((s) => s[i]);
    horizontals = horizontals.filter((v) => testMirror(col, v));
  }

  return [verticals, horizontals];
}

function getSets(): string[][] {
  const lines = getLines(13);
  return lines.reduce(
    (e: string[][], line) => {
      if (!line) e.push([]);
      else e[e.length - 1].push(line);
      return e;
    },
    [[]]
  );
}

export function getValue(matches: [number[], number[]]): number {
  const [verticals, horizontals] = matches;
  const vertical = verticals.reduce((v, i) => (v += i), 0);
  const horizontal = horizontals.reduce((v, i) => (v += i * 100), 0);
  return vertical + horizontal;
}

export function day13part1(): number {
  return getSets().reduce((n, s) => (n += getValue(getSetMatches(s))), 0);
}

export function day13part2(): number {
  const sets = getSets();
  let sum = 0;

  for (const set of sets) {
    const original = getSetMatches(set).map((m) => new Set(m));
    let value = 0;
    for (let r = 0; r < set.length; r++) {
      const row = set[r];
      for (let c = 0; c < row.length; c++) {
        const char = set[r][c] === '.' ? '#' : '.';
        const test = set.map((s, r2) =>
          r2 === r ? s.substring(0, c) + char + s.substring(c + 1) : s
        );
        const matches = getSetMatches(test).map((m, i) =>
          m.filter((v) => !original[i].has(v))
        ) as [number[], number[]];
        value = getValue(matches);

        if (value) break;
      }

      if (value) break;
    }

    sum += value;
  }

  return sum;
}

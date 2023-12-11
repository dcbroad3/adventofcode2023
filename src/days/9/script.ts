import { getLines } from 'src/helpers';

function getDifferences(): number[][][] {
  const lines = getLines(9);
  const readings = lines.map((l) => l.split(' ').map((x) => Number(x)));
  return readings.map((r) => {
    const differences = [r];
    for (let i = 0; i < r.length; i++) {
      const current = differences[i];
      const next = current.map((a, j) => current[j + 1] - a);
      next.pop();
      if (next.every((n) => n === 0)) break;
      differences.push(next);
    }

    return differences;
  });
}

export function day9part1(): number {
  const differences = getDifferences();
  return differences.reduce((r, n) => {
    let next = 0;
    for (let i = n.length - 1; i >= 0; i--) {
      const row = n[i];
      next += row[row.length - 1];
    }

    return (r += next);
  }, 0);
}

export function day9part2(): number {
  const differences = getDifferences();
  return differences.reduce((r, n) => {
    let next = 0;
    for (let i = n.length - 1; i >= 0; i--) {
      const row = n[i];
      next = row[0] - next;
    }

    return (r += next);
  }, 0);
}

import { getLines } from 'src/helpers';

export function day14part1(): number {
  const lines = getLines(14);
  let sum = 0;
  for (let c = 0; c < lines[0].length; c++) {
    let v = lines.length;
    for (let r = 0; r < lines.length; r++) {
      if (lines[r][c] === 'O') sum += v--;
      if (lines[r][c] === '#') v = lines.length - r - 1;
    }
  }

  return sum;
}

function tiltWest(value: string[][]): void {
  for (let r = 0; r < value.length; r++) {
    const row = value[r];
    let v = 0;
    for (let c = 0; c < row.length; c++) {
      if (row[c] === 'O') {
        // Move left
        row.splice(c, 1);
        row.splice(v, 0, 'O');
      }

      if (row[c] === '#') v = c + 1;
    }
  }
}
function rotateClockwise(value: string[][]): string[][] {
  return value.map((r, i) => r.map((c, j) => value[value.length - 1 - j][i]));
}

function getWestLoad(value: string[][]): number {
  return value.reduce((result, row) => {
    const rowValue = row.reduce((w, c, i) => {
      if (c === 'O') return (w += row.length - i);
      return w;
    }, 0);

    return (result += rowValue);
  }, 0);
}

function getString(value: string[][]): string {
  return value.map((r) => r.join('')).join('\r\n');
}

export function day14part2(): number {
  let lines = getLines(14).map((l) => l.split(''));
  lines = rotateClockwise(lines);
  lines = rotateClockwise(lines);

  const map = new Map<string, number>();
  let iteration = 0;
  let loop = 0;
  for (let c = 0; c < 1000000000; c++) {
    for (let i = 0; i < 4; i++) {
      lines = rotateClockwise(lines);
      tiltWest(lines);
    }

    const current = getString(lines);
    if (!map.has(current)) map.set(current, c);
    else {
      iteration = c;
      loop = map.get(current)!;
      break;
    }
  }

  const index = ((1000000000 - loop) % (iteration - loop)) + loop - 1;
  const puzzle = Array.from(map.keys()).find((k) => map.get(k) === index)!;
  let result = puzzle?.split('\r\n').map((l) => l.split(''));
  result = rotateClockwise(result);
  return getWestLoad(result);
}

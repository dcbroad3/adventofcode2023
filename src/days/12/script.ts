import { getLines } from 'src/helpers';

const cache: Record<string, number> = {};

function recursive(row: string, pattern: number[]): number {
  if (pattern.length === 0) return row.indexOf('#') === -1 ? 1 : 0;

  const key = row + ' ' + pattern.join(',');
  if (cache[key] != null) return cache[key];

  let sum = 0;
  const len = pattern[0];
  for (let i = 0; i <= row.length - len; i++) {
    const str = row.substring(i, i + len).split('');

    if (str.every((c) => c !== '.') && row[i + len] !== '#') {
      sum += recursive(row.substring(i + len + 1), pattern.slice(1));
    }

    if (row[i] === '#') break;
  }

  cache[key] = sum;
  return sum;
}

export function day12part1(): number {
  const lines = getLines(12);
  let sum = 0;
  for (const line of lines) {
    const [input, patternStr] = line.split(' ');
    const pattern = patternStr.split(',').map((v) => Number(v));
    sum += recursive(input, pattern);
  }

  return sum;
}

export function day12part2(): number {
  const lines = getLines(12);

  let sum = 0;
  for (const line of lines) {
    let [input, patternStr] = line.split(' ');
    input = new Array(5).fill(input).join('?');
    patternStr = new Array(5).fill(patternStr).join(',');
    const pattern = patternStr.split(',').map((v) => Number(v));
    sum += recursive(input, pattern);
  }

  return sum;
}

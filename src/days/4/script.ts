import { getLines } from 'src/helpers';

function getWinCount(line: string): number {
  const [_, cardData] = line.split(': ');
  const [winningStr, resultStr] = cardData.split(' | ');
  const winning = new Set(winningStr.split(' ').filter((s) => !!s));
  const result = resultStr.split(' ').filter((s) => !!s);
  return result.filter((r) => winning.has(r)).length;
}

export function day4part1(): number {
  const lines = getLines(4);
  return lines.reduce((s, line) => {
    const won = getWinCount(line);
    if (won) s += Math.pow(2, won - 1);
    return s;
  }, 0);
}

export function day4part2(): number {
  const lines = getLines(4);
  const linesWon = lines.reduce((e: Record<number, number>, line, i) => {
    e[i] = getWinCount(line);
    return e;
  }, {});

  let sum = 0;
  const lineValue: Record<number, number> = {};
  for (let i = lines.length - 1; i >= 0; i--) {
    let v = 1;
    for (let w = 1; w <= linesWon[i]; w++) v += lineValue[i + w] ?? 0;
    lineValue[i] = v;
    sum += v;
  }

  return sum;
}

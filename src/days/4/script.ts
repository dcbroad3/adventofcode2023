import { getLines } from 'src/helpers';

export function day4part1(): void {
  const lines = getLines('src/days/4/input.txt');
  const sum = lines.reduce((s, line) => {
    const [_, cardData] = line.split(': ');
    const [winningStr, resultStr] = cardData.split(' | ');
    const winning = new Set(winningStr.split(' ').filter((s) => !!s));
    const result = resultStr.split(' ').filter((s) => !!s);
    const won = result.filter((r) => winning.has(r)).length;
    if (won) s += Math.pow(2, won - 1);
    return s;
  }, 0);

  console.log('Answer:', sum);
}

export function day4part2(): void {
  const lines = getLines('src/days/4/input.txt');
  const linesWon = lines.reduce((e: Record<number, number>, line, i) => {
    const [_, cardData] = line.split(': ');
    const [winningStr, resultStr] = cardData.split(' | ');
    const winning = new Set(winningStr.split(' ').filter((s) => !!s));
    const result = resultStr.split(' ').filter((s) => !!s);
    const won = result.filter((r) => winning.has(r)).length;
    e[i] = won;
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

  console.log('Answer:', sum);
}

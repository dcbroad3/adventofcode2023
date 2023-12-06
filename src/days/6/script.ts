import { getLines } from 'src/helpers';

function getNumbers(line: string): number[] {
  return Array.from(line.matchAll(/(\d+)/g)).map((m) => Number(m[0]));
}

function getRaces(): [number, number][] {
  const [times, distances] = getLines(6).map((line) => getNumbers(line));
  return times.map((time, i) => [time, distances[i]]);
}

function getLongRace(): [number, number] {
  const [time, distance] = getLines(6)
    .map((line) => getNumbers(line))
    .map((n) => Number(n.join('')));
  return [time, distance];
}

function solveQuadratic(a: number, b: number, c: number): [number, number] {
  const sqrt = Math.pow(Math.pow(b, 2) - 4 * a * c, 0.5);
  const minus = (-b - sqrt) / (2 * a);
  const plus = (-b + sqrt) / (2 * a);
  return minus < plus ? [minus, plus] : [plus, minus];
}

function getWins(race: [number, number]): number {
  const [time, distance] = race;
  const [low, high] = solveQuadratic(-1, time, -distance);
  const lowInt = Math.ceil(low);
  const highInt = Math.floor(high);
  return highInt - lowInt + 1;
}

export function day6part1(): number {
  return getRaces().reduce((r, race) => r * getWins(race), 1);
}

export function day6part2(): number {
  return getWins(getLongRace());
}

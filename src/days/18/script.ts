import { getLines } from 'src/helpers';

type Direction = 'U' | 'D' | 'L' | 'R';
const direction: Record<Direction, [number, number]> = {
  U: [-1, 0],
  D: [1, 0],
  L: [0, -1],
  R: [0, 1],
};

interface Step {
  direction: Direction;
  distance: number;
}

function getArea(steps: Step[]): number {
  const points: [number, number][] = [[0, 0]];
  let r = 0,
    c = 0,
    b = 0;
  steps.forEach((s) => {
    const [dr, dc] = direction[s.direction];
    r += dr * s.distance;
    c += dc * s.distance;
    b += s.distance;
    points.push([r, c]);
  });

  const last = points.length - 1;
  let area = 0;
  for (let i = 0; i < points.length; i++) {
    const x = points[i][0];
    const y1 = i === 0 ? points[last][1] : points[i - 1][1];
    const y2 = i === last ? points[0][1] : points[i + 1][1];
    const value = x * (y1 - y2);
    area += value;
  }

  area = Math.abs(area) / 2;
  const i = area - b / 2 + 1;
  return i + b;
}

export function day18part1(): number {
  const lines = getLines(18);
  const steps = lines.map((l): Step => {
    const data = l.split(' ');
    const direction = data[0] as Direction;
    const distance = Number(data[1]);
    return { direction, distance };
  });

  return getArea(steps);
}

export function day18part2(): number {
  const lines = getLines(18);
  const directionMap: Record<string, Direction> = {
    ['0']: 'R',
    ['1']: 'D',
    ['2']: 'L',
    ['3']: 'U',
  };
  const steps = lines.map((l): Step => {
    const data = l.split(' ');
    const distanceHex = data[2].substring(2, 7);
    const distance = parseInt(distanceHex, 16);
    const directionNum = data[2].substring(7, 8);
    const direction = directionMap[directionNum];
    return { direction, distance };
  });

  return getArea(steps);
}

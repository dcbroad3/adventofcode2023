import { getLines } from 'src/helpers';

type Coords = [number, number, number];
type Brick = [Coords, Coords];

interface Solution {
  bricks: Brick[];
  supports: Record<number, Set<number>>;
  supportedBy: Record<number, Set<number>>;
}

function overlapsXY(a: Brick, b: Brick): boolean {
  for (let axis = 0; axis < 2; axis++) {
    if (a[0][axis] > b[1][axis] || a[1][axis] < b[0][axis]) return false;
  }

  return true;
}

function sort(bricks: Brick[]): void {
  bricks.sort((a, b) => a[0][2] - b[0][2]);
}

function getSolution(): Solution {
  const bricks: Brick[] = getLines(22).map(
    (line) =>
      line
        .split('~')
        .map((c) => c.split(',').map((n) => Number(n)) as Coords) as Brick
  );

  sort(bricks);

  bricks.forEach((brick, index) => {
    let maxZ = 1;
    for (let i = 0; i < index; i++) {
      const check = bricks[i];
      if (overlapsXY(brick, check)) maxZ = Math.max(maxZ, check[1][2] + 1);
    }

    brick[1][2] -= brick[0][2] - maxZ;
    brick[0][2] = maxZ;
  });

  sort(bricks);

  const supports: Record<number, Set<number>> = {};
  const supportedBy: Record<number, Set<number>> = {};
  for (let i = 0; i < bricks.length; i++) {
    supports[i] = new Set();
    supportedBy[i] = new Set();
  }

  bricks.forEach((upper, u) => {
    for (let l = 0; l < u; l++) {
      const lower = bricks[l];
      if (overlapsXY(lower, upper) && upper[0][2] === lower[1][2] + 1) {
        supports[l].add(u);
        supportedBy[u].add(l);
      }
    }
  });

  return { bricks, supports, supportedBy };
}

export function day22part1(): number {
  const { bricks, supports, supportedBy } = getSolution();

  let sum = 0;
  for (let i = 0; i < bricks.length; i++) {
    if (Array.from(supports[i]).every((j) => supportedBy[j].size > 1)) sum++;
  }

  return sum;
}

export function day22part2(): number {
  const { bricks, supports, supportedBy } = getSolution();

  let sum = 0;
  for (let i = 0; i < bricks.length; i++) {
    const q = Array.from(supports[i]).filter((j) => supportedBy[j].size === 1);
    const result = new Set(q);
    result.add(i);
    while (q.length) {
      const j = q.shift()!;
      for (const k of supports[j]) {
        if (result.has(k)) continue;

        if (Array.from(supportedBy[k]).every((s) => result.has(s))) {
          q.push(k);
          result.add(k);
        }
      }
    }

    sum += result.size - 1;
  }

  return sum;
}

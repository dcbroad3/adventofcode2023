import { getLines } from 'src/helpers';

class Hailstone {
  sx: number;
  sy: number;
  sz: number;
  vx: number;
  vy: number;
  vz: number;
  a: number;
  b: number;
  c: number;

  get position(): [number, number, number] {
    return [this.sx, this.sy, this.sz];
  }

  get velocity(): [number, number, number] {
    return [this.vx, this.vy, this.vz];
  }

  constructor(data: string) {
    const values = data
      .split(' @ ')
      .map((p) => p.split(', ').map((n) => Number(n)));
    [this.sx, this.sy, this.sz] = values[0];
    [this.vx, this.vy, this.vz] = values[1];

    this.a = this.vy;
    this.b = -this.vx;
    this.c = this.vy * this.sx - this.vx * this.sy;
  }
}

function getHailstones(): Hailstone[] {
  return getLines(24).map((l) => new Hailstone(l));
}

// Based on: https://github.com/yongjun21/advent-of-code/blob/master/2023/day24.js

export function day24part1(): number {
  const hailstones = getHailstones();
  const min = 200000000000000;
  const max = 400000000000000;

  let total = 0;
  for (let i = 0; i < hailstones.length; i++) {
    const hs1 = hailstones[i];
    for (let j = 0; j < i; j++) {
      const hs2 = hailstones[j];
      // Check for parallel hailstones
      if (hs1.a * hs2.b === hs1.b * hs2.a) continue;

      const q = hs1.a * hs2.b - hs2.a * hs1.b;
      const x = (hs1.c * hs2.b - hs2.c * hs1.b) / q;
      const y = (hs2.c * hs1.a - hs1.c * hs2.a) / q;

      if (x < min || x > max || y < min || y > max) continue;

      if (
        [hs1, hs2].every(
          (hs) => (x - hs.sx) * hs.vx >= 0 && (y - hs.sy) * hs.vy >= 0
        )
      ) {
        total++;
      }
    }
  }

  return total;
}

function* getPrimeFactors(number: number): Generator<number> {
  let found: number | undefined;
  for (let f = 2; f <= Math.floor(Math.sqrt(number)); f++) {
    if (number % f === 0) {
      yield f;
      found = f;
      break;
    }
  }

  if (found == null) yield number;
  else yield* getPrimeFactors(number / found);
}

function* getFactors(number: number): Generator<number> {
  if (number === 1) {
    yield 1;
    return;
  }

  const tally = new Map();
  for (const prime of getPrimeFactors(number)) {
    const count = tally.get(prime) ?? 0;
    tally.set(prime, count + 1);
  }

  const tallyEntries = [...tally.entries()];
  const unvisited: number[][] = [];
  unvisited.push([]);

  while (unvisited.length > 0) {
    const next = unvisited.pop()!;
    if (next.length >= tallyEntries.length) {
      yield tallyEntries.reduce(
        (product, [prime], i) => product * Math.pow(prime, next[i]),
        1
      );
    } else {
      for (let k = tallyEntries[next.length][1]; k >= 0; k--)
        unvisited.push([...next, k]);
    }
  }
}

function solveLinear(
  a: number,
  b: number,
  c: number,
  d: number,
  e: number,
  f: number
): [number, number] | null {
  const det = a * d - b * c;
  if (det === 0) return null;

  const invA = d / det;
  const invB = -b / det;
  const invC = -c / det;
  const invD = a / det;

  return [invA * e + invC * f, invB * e + invD * f];
}

function findSingleThrow(input: Hailstone[]): number {
  const candidateXYZ: [number[] | null, number[] | null, number[] | null] = [
    null,
    null,
    null,
  ];
  outer: for (let i = 0; i < input.length - 1; i++) {
    for (let j = i + 1; j < input.length; j++) {
      for (let k = 0; k < 3; k++) {
        if (candidateXYZ[k]?.length === 1) continue;
        if (input[i].velocity[k] === input[j].velocity[k]) {
          const dx = input[i].position[k] - input[j].position[k];
          const factors = [...getFactors(Math.abs(dx))];
          const candidates: number[] = [];
          factors.forEach((f) => {
            candidates.push(input[i].velocity[k] + f, input[i].velocity[k] - f);
          });
          if (candidateXYZ[k])
            candidateXYZ[k] = candidateXYZ[k]!.filter((v) =>
              candidates.includes(v)
            );
          else candidateXYZ[k] = [...new Set(candidates)];
        }
      }
      if (candidateXYZ.every((candidates) => candidates?.length === 1))
        break outer;
    }
  }

  const velocityXYZ = candidateXYZ.map((candidates) => candidates![0]);

  const indices = [0, 1];

  const dvx0 = input[indices[0]].velocity[0] - velocityXYZ[0];
  const dvx1 = input[indices[1]].velocity[0] - velocityXYZ[0];
  const dvy0 = input[indices[0]].velocity[1] - velocityXYZ[1];
  const dvy1 = input[indices[1]].velocity[1] - velocityXYZ[1];

  const positionXY = solveLinear(
    -dvy0,
    -dvy1,
    dvx0,
    dvx1,
    dvx0 * input[indices[0]].position[1] - dvy0 * input[indices[0]].position[0],
    dvx1 * input[indices[1]].position[1] - dvy1 * input[indices[1]].position[0]
  );

  const positionZ =
    input[indices[0]].position[2] +
    ((positionXY![0] - input[indices[0]].position[0]) /
      (velocityXYZ[0] - input[indices[0]].velocity[0])) *
      (velocityXYZ[2] - input[indices[0]].velocity[2]);

  return (
    Math.round(positionXY![0]) +
    Math.round(positionXY![1]) +
    Math.round(positionZ)
  );
}

export function day24part2(): number {
  const hailstones = getHailstones();
  return findSingleThrow(hailstones);
}

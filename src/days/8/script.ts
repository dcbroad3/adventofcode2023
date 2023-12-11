import { getLines } from 'src/helpers';

function getMaps(): [number[], Record<string, [string, string]>] {
  const lines = getLines(8);
  const directions = lines[0].split('').map((l) => (l === 'L' ? 0 : 1));
  const nodes = lines
    .slice(1)
    .reduce((e: Record<string, [string, string]>, l) => {
      const [key, mapStr] = l.split(' = ');
      const [left, right] = mapStr.substring(1, 9).split(', ');
      e[key] = [left, right];
      return e;
    }, {});
  return [directions, nodes];
}

function getHcf(a: number, b: number): number {
  const max = a > b ? a : b;
  for (let i = max; i > 0; i--) {
    if (a % i === 0 && b % i === 0) return i;
  }

  return -1;
}

function getLcm(a: number, b: number): number {
  return (a * b) / getHcf(a, b);
}

export function day8part1(): number {
  const [directions, nodes] = getMaps();
  let step = 0;
  let node = 'AAA';
  for (;;) {
    const direction = directions[step % directions.length];
    node = nodes[node][direction];
    step++;
    if (node === 'ZZZ') return step;
  }
}

export function day8part2(): number {
  const [directions, nodes] = getMaps();
  let step = 0;
  let current = Object.keys(nodes).filter((n) => n.endsWith('A'));
  const complete: number[] = [];
  while (current.length) {
    const direction = directions[step++ % directions.length];
    current = current
      .map((n) => {
        return nodes[n][direction];
      })
      .filter((n) => {
        if (n[2] === 'Z') {
          complete.push(step);
          return false;
        }

        return true;
      });
  }

  while (complete.length > 1) {
    let nums: [number, number] | undefined;
    let minDiff: number | undefined;
    for (let i = 0; i < complete.length; i++) {
      for (let j = 0; j < complete.length; j++) {
        if (i !== j) {
          const diff = Math.abs(complete[i] - complete[j]);
          if (minDiff == null || diff < minDiff) {
            minDiff = diff;
            nums = [i, j];
          }
        }
      }
    }

    if (nums == null) throw 'Failed to find minimum results';

    const [i, j] = nums;
    const result = getLcm(complete[i], complete[j]);

    if (i > j) {
      complete.splice(i, 1);
      complete.splice(j, 1);
    } else {
      complete.splice(j, 1);
      complete.splice(i, 1);
    }

    complete.push(result);
  }

  return complete[0];
}

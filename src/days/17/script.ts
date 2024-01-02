import { getLines } from 'src/helpers';

const allDirections: [number, number][] = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
];

interface Step {
  r: number;
  c: number;
  dr: number;
  dc: number;
  n: number;
}

interface Node<T> {
  key: number;
  value: T;
}

function parent(index: number): number {
  return Math.floor((index - 1) / 2);
}

class PriorityQueue<T> {
  heap: Node<T>[] = [];

  constructor(value?: Node<T>[]) {
    if (value != null) this.heap = value;
  }

  get length(): number {
    return this.heap.length;
  }

  left(index: number): number {
    return 2 * index + 1;
  }
  right(index: number): number {
    return 2 * index + 2;
  }
  hasLeft(index: number): boolean {
    return this.left(index) < this.heap.length;
  }
  hasRight(index: number): boolean {
    return this.right(index) < this.heap.length;
  }

  swap(a: number, b: number): void {
    const tmp = this.heap[a];
    this.heap[a] = this.heap[b];
    this.heap[b] = tmp;
  }

  insert(item: T, priority: number): void {
    this.heap.push({ key: priority, value: item });
    let i = this.heap.length - 1;
    while (i > 0) {
      const p = parent(i);
      if (this.heap[p].key < this.heap[i].key) break;
      this.swap(i, p);
      i = p;
    }
  }

  pop(): Node<T> | null {
    if (this.heap.length === 0) return null;

    this.swap(0, this.heap.length - 1);
    const item = this.heap.pop()!;

    let current = 0;
    while (this.hasLeft(current)) {
      let smallerChild = this.left(current);
      if (
        this.hasRight(current) &&
        this.heap[this.right(current)].key < this.heap[this.left(current)].key
      )
        smallerChild = this.right(current);

      if (this.heap[smallerChild].key > this.heap[current].key) break;

      this.swap(current, smallerChild);
      current = smallerChild;
    }

    return item;
  }
}

export function day17part1(): number {
  const lines = getLines(17);
  const grid = lines.map((l) => l.split('').map((v) => Number(v)));
  const seen = new Set<string>();

  const pq = new PriorityQueue<Step>([
    { key: 0, value: { r: 0, c: 0, dr: 0, dc: 0, n: 0 } },
  ]);

  while (pq.length) {
    const current = pq.pop()!;
    const hl = current.key;
    const { r, c, dc, dr, n } = current.value;

    if (r === grid.length - 1 && c === grid[0].length - 1) {
      console.log(pq, [hl, r, c, dc, dr, n]);
      return hl;
    }
    if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length) continue;
    const key = [r, c, dc, dr, n].join(',');
    if (seen.has(key)) continue;
    seen.add(key);

    if (n < 3 && !(dr === 0 && dc === 0)) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < grid.length && nc >= 0 && nc < grid[0].length)
        pq.insert({ r: nr, c: nc, dr, dc, n: n + 1 }, hl + grid[nr][nc]);
    }

    for (const [ndr, ndc] of allDirections) {
      if (!(ndr === dr && ndc === dc) && !(ndr === -dr && ndc === -dc)) {
        const nr = r + ndr;
        const nc = c + ndc;
        if (nr >= 0 && nr < grid.length && nc >= 0 && nc < grid[0].length)
          pq.insert(
            { r: nr, c: nc, dr: ndr, dc: ndc, n: 1 },
            hl + grid[nr][nc]
          );
      }
    }
  }

  return -1;
}

export function day17part2(): number {
  const lines = getLines(17);
  const grid = lines.map((l) => l.split('').map((v) => Number(v)));
  const seen = new Set<string>();

  const pq = new PriorityQueue<Step>([
    { key: 0, value: { r: 0, c: 0, dr: 0, dc: 0, n: 0 } },
  ]);

  while (pq.length) {
    const current = pq.pop()!;
    const hl = current.key;
    const { r, c, dc, dr, n } = current.value;

    if (r === grid.length - 1 && c === grid[0].length - 1) {
      console.log(pq, [hl, r, c, dc, dr, n]);
      return hl;
    }
    if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length) continue;
    const key = [r, c, dc, dr, n].join(',');
    if (seen.has(key)) continue;
    seen.add(key);

    if (n < 10 && !(dr === 0 && dc === 0)) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < grid.length && nc >= 0 && nc < grid[0].length)
        pq.insert({ r: nr, c: nc, dr, dc, n: n + 1 }, hl + grid[nr][nc]);
    }

    if (n > 3 || n === 0) {
      for (const [ndr, ndc] of allDirections) {
        if (!(ndr === dr && ndc === dc) && !(ndr === -dr && ndc === -dc)) {
          const nr = r + ndr;
          const nc = c + ndc;
          if (nr >= 0 && nr < grid.length && nc >= 0 && nc < grid[0].length)
            pq.insert(
              { r: nr, c: nc, dr: ndr, dc: ndc, n: 1 },
              hl + grid[nr][nc]
            );
        }
      }
    }
  }

  return -1;
}

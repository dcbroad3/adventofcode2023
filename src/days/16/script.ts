import { getLines } from 'src/helpers';

type Direction = 'up' | 'right' | 'down' | 'left';

const allDirections: Direction[] = ['up', 'right', 'down', 'left'];

const defaultVisited: Record<Direction, boolean> = {
  up: false,
  right: false,
  down: false,
  left: false,
};

function visitMulti(
  cells: [number, number, Direction][],
  lines: string[][],
  visited: Record<Direction, boolean>[][]
): [number, number, Direction][] {
  const result: [number, number, Direction][] = [];

  for (const [row, col, direction] of cells) {
    if (visited[row][col][direction]) continue;
    visited[row][col][direction] = true;

    switch (direction) {
      case 'up': {
        const cell = lines[row][col];
        if (cell === '.' || cell === '|') {
          if (row > 0) result.push([row - 1, col, 'up']);
          continue;
        }

        if ((cell === '/' || cell === '-') && col < lines[row].length - 1)
          result.push([row, col + 1, 'right']);

        if ((cell === '\\' || cell === '-') && col > 0)
          result.push([row, col - 1, 'left']);

        break;
      }
      case 'right': {
        const cell = lines[row][col];
        if (cell === '.' || cell === '-') {
          if (col < lines[row].length - 1) result.push([row, col + 1, 'right']);
          continue;
        }

        if ((cell === '/' || cell === '|') && row > 0)
          result.push([row - 1, col, 'up']);

        if ((cell === '\\' || cell === '|') && row < lines.length - 1)
          result.push([row + 1, col, 'down']);

        break;
      }
      case 'down': {
        const cell = lines[row][col];
        if (cell === '.' || cell === '|') {
          if (row < lines.length - 1) result.push([row + 1, col, 'down']);
          continue;
        }

        if ((cell === '\\' || cell === '-') && col < lines[row].length - 1)
          result.push([row, col + 1, 'right']);

        if ((cell === '/' || cell === '-') && col > 0)
          result.push([row, col - 1, 'left']);

        break;
      }
      case 'left': {
        const cell = lines[row][col];
        if (cell === '.' || cell === '-') {
          if (col > 0) result.push([row, col - 1, 'left']);
          continue;
        }

        if ((cell === '\\' || cell === '|') && row > 0)
          result.push([row - 1, col, 'up']);

        if ((cell === '/' || cell === '|') && row < lines.length - 1)
          result.push([row + 1, col, 'down']);

        break;
      }
    }
  }

  return result;
}

function getEnergizedCells(
  start: [number, number, Direction],
  lines: string[][]
): number {
  const visited = lines.map((l) => l.map(() => ({ ...defaultVisited })));

  let visit: [number, number, Direction][] = [start];
  while (visit.length) visit = visitMulti(visit, lines, visited);

  return visited.reduce(
    (sum, row) =>
      (sum += row.reduce(
        (rowSum, cell) =>
          allDirections.some((d) => cell[d]) ? ++rowSum : rowSum,
        0
      )),
    0
  );
}

export function day16part1(): number {
  const lines = getLines(16).map((l) => l.split(''));
  return getEnergizedCells([0, 0, 'right'], lines);
}

export function day16part2(): number {
  const lines = getLines(16).map((l) => l.split(''));
  let max = 0;

  for (const direction of allDirections) {
    if (direction === 'up' || direction === 'down') {
      const row = direction === 'down' ? 0 : lines[0].length - 1;
      for (let col = 0; col < lines[0].length; col++) {
        const result = getEnergizedCells([row, col, direction], lines);
        if (result > max) max = result;
      }
    } else {
      const col = direction === 'right' ? 0 : lines.length - 1;
      for (let row = 0; row < lines.length; row++) {
        const result = getEnergizedCells([row, col, direction], lines);
        if (result > max) max = result;
      }
    }
  }

  return max;
}

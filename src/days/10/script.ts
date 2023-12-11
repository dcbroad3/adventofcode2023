import { getLines } from 'src/helpers';

type Cell = '.' | 'S' | '|' | '-' | 'L' | 'J' | '7' | 'F';

enum Direction {
  Top = 0,
  Right = 1,
  Left = 2,
  Bottom = 3,
}

/** Map pipe segments to whether they point north ('N') or not ('X') */
const simpleMap: Record<Cell, string> = {
  '.': '.',
  S: 'X',
  '|': 'N',
  '-': 'X',
  L: 'N',
  J: 'N',
  '7': 'X',
  F: 'X',
};

const connectionMap: Record<Cell, Partial<Record<Direction, Direction>>> = {
  ['.']: {},
  ['S']: {},
  ['|']: {
    [Direction.Top]: Direction.Top,
    [Direction.Bottom]: Direction.Bottom,
  },
  ['-']: {
    [Direction.Right]: Direction.Right,
    [Direction.Left]: Direction.Left,
  },
  ['L']: {
    [Direction.Left]: Direction.Top,
    [Direction.Bottom]: Direction.Right,
  },
  ['J']: {
    [Direction.Right]: Direction.Top,
    [Direction.Bottom]: Direction.Left,
  },
  ['7']: {
    [Direction.Top]: Direction.Left,
    [Direction.Right]: Direction.Bottom,
  },
  ['F']: {
    [Direction.Top]: Direction.Right,
    [Direction.Left]: Direction.Bottom,
  },
};

const directionMap: Record<Direction, [number, number]> = {
  [Direction.Top]: [-1, 0],
  [Direction.Right]: [0, 1],
  [Direction.Bottom]: [1, 0],
  [Direction.Left]: [0, -1],
};

const topConnections = ['|', '7', 'F'];
const rightConnections = ['-', 'J', '7'];
const bottomConnections = ['|', 'L', 'J'];
const leftConnections = ['-', 'L', 'F'];

export function day10part1(): number {
  const lines = getLines(10).map((l) => l.split('')) as Cell[][];
  let direction: Direction | undefined;
  let x = 0,
    y = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (let j = 0; j < line.length; j++) {
      if (line[j] === 'S') {
        (x = i), (y = j);
        if (topConnections.includes(lines[i - 1][j])) {
          direction = Direction.Top;
        } else if (rightConnections.includes(lines[i][j + 1])) {
          direction = Direction.Right;
        } else if (bottomConnections.includes(lines[i + 1][j])) {
          direction = Direction.Bottom;
        } else if (leftConnections.includes(lines[i][j - 1])) {
          direction = Direction.Left;
        }
        break;
      }
    }

    if (direction != null) break;
  }

  let s = 0;
  while (direction != null) {
    const [i, j] = directionMap[direction];
    x += i;
    y += j;
    s++;
    direction = connectionMap[lines[x][y]][direction];
  }

  return s / 2;
}

export function day10part2(): number {
  const lines = getLines(10).map((l) => l.split('')) as Cell[][];
  let direction: Direction | undefined;
  let x = 0,
    y = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (let j = 0; j < line.length; j++) {
      if (line[j] === 'S') {
        (x = i), (y = j);
        if (topConnections.includes(lines[i - 1][j])) {
          direction = Direction.Top;
          simpleMap['S'] = 'N'; // Start cell points north, note this for later
        } else if (rightConnections.includes(lines[i][j + 1])) {
          direction = Direction.Right;
        } else if (bottomConnections.includes(lines[i + 1][j])) {
          direction = Direction.Bottom;
        } else if (leftConnections.includes(lines[i][j - 1])) {
          direction = Direction.Left;
        }
        break;
      }
    }

    if (direction != null) break;
  }

  const sketch = lines.map((l) => [...l]) as string[][];

  // Mark path with N or X, depending on whether pointing north (N)
  while (direction != null) {
    const [i, j] = directionMap[direction];
    sketch[x][y] = simpleMap[lines[x][y]];
    x += i;
    y += j;
    direction = connectionMap[lines[x][y]][direction];
  }

  // Replace non-path elements with .
  for (let i = 0; i < sketch.length; i++) {
    const line = sketch[i];
    for (let j = 0; j < line.length; j++) {
      if (!['X', 'N'].includes(line[j])) line[j] = '.';
    }
  }

  // Scan each row counting north-pointing tiles to count interior cells
  let count = 0;
  for (let i = 0; i < sketch.length; i++) {
    const line = sketch[i];
    let inside = false;
    for (let j = 0; j < line.length; j++) {
      if (line[j] === 'N') {
        inside = !inside;
      } else if (line[j] !== 'X' && inside) {
        count++;
      }
    }
  }

  return count;
}

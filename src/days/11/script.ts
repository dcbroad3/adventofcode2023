import { getLines } from 'src/helpers';

function getNonEmpty(
  lines: string[]
): [Record<number, boolean>, Record<number, boolean>] {
  const nonEmptyRows: Record<number, boolean> = {};
  const nonEmptyCols: Record<number, boolean> = {};

  for (let r = 0; r < lines.length; r++) {
    const line = lines[r];
    for (let c = 0; c < line.length; c++) {
      if (line[c] === '#') {
        nonEmptyRows[r] = true;
        nonEmptyCols[c] = true;
      }
    }
  }

  return [nonEmptyRows, nonEmptyCols];
}

export function day11part1(): number {
  const lines = getLines(11);
  const [nonEmptyRows, nonEmptyCols] = getNonEmpty(lines);

  const emptyRow = '.'.repeat(lines[0].length);
  for (let r = lines.length - 1; r >= 0; r--) {
    if (!nonEmptyRows[r]) {
      lines.splice(r, 0, emptyRow);
    }
  }

  for (let c = lines[0].length - 1; c >= 0; c--) {
    if (!nonEmptyCols[c]) {
      for (let r = 0; r < lines.length; r++) {
        const line = lines[r];
        lines[r] = line.slice(0, c) + '.' + line.slice(c);
      }
    }
  }

  let sum = 0;
  for (let r1 = 0; r1 < lines.length; r1++) {
    const line1 = lines[r1];
    for (let c1 = 0; c1 < line1.length; c1++) {
      if (line1[c1] === '#') {
        for (let r2 = r1; r2 < lines.length; r2++) {
          const line2 = lines[r2];
          const initialCol = r1 === r2 ? c1 + 1 : 0;
          for (let c2 = initialCol; c2 < line2.length; c2++) {
            if (line2[c2] === '#') {
              const distance = Math.abs(r1 - r2) + Math.abs(c1 - c2);
              sum += distance;
            }
          }
        }
      }
    }
  }

  return sum;
}

export function day11part2(): number {
  const lines = getLines(11);
  const [nonEmptyRows, nonEmptyCols] = getNonEmpty(lines);
  const multiply = 1000000;

  let sum = 0;
  for (let r1 = 0; r1 < lines.length; r1++) {
    const line1 = lines[r1];
    for (let c1 = 0; c1 < line1.length; c1++) {
      if (line1[c1] === '#') {
        for (let r2 = r1; r2 < lines.length; r2++) {
          const line2 = lines[r2];
          const initialCol = r1 === r2 ? c1 + 1 : 0;
          for (let c2 = initialCol; c2 < line2.length; c2++) {
            if (line2[c2] === '#') {
              const distance = Math.abs(r1 - r2) + Math.abs(c1 - c2);
              let [min, max] = r1 < r2 ? [r1, r2] : [r2, r1];
              let x = 0;
              for (let i = min; i < max; i++) {
                if (!nonEmptyRows[i]) x++;
              }

              [min, max] = c1 < c2 ? [c1, c2] : [c2, c1];
              for (let i = min; i < max; i++) {
                if (!nonEmptyCols[i]) x++;
              }

              sum += distance + x * (multiply - 1);
            }
          }
        }
      }
    }
  }

  return sum;
}

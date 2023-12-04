import { getLines } from 'src/helpers';

function isSymbol(x: string | null | undefined): boolean {
  if (x == null || x === '.') return false;
  return isNaN(Number(x));
}

function checkIndexIsSymbol(
  lines: string[],
  lineIndex: number,
  charIndex: number
): boolean {
  return isSymbol(lines[lineIndex]?.[charIndex]);
}

function indexTouchesSymbol(
  lines: string[],
  lineIndex: number,
  charIndex: number
): boolean {
  return (
    // Check above
    checkIndexIsSymbol(lines, lineIndex - 1, charIndex - 1) ||
    checkIndexIsSymbol(lines, lineIndex - 1, charIndex) ||
    checkIndexIsSymbol(lines, lineIndex - 1, charIndex + 1) ||
    // Check current row
    checkIndexIsSymbol(lines, lineIndex, charIndex - 1) ||
    checkIndexIsSymbol(lines, lineIndex, charIndex + 1) ||
    // Check below
    checkIndexIsSymbol(lines, lineIndex + 1, charIndex - 1) ||
    checkIndexIsSymbol(lines, lineIndex + 1, charIndex) ||
    checkIndexIsSymbol(lines, lineIndex + 1, charIndex + 1)
  );
}

function checkIndexIsGear(
  lines: string[],
  lineIndex: number,
  charIndex: number,
  gears: Set<number>
): void {
  if (lines[lineIndex]?.[charIndex] === '*')
    gears.add(lineIndex * lines[lineIndex].length + charIndex);
}

function checkIndexTouchesGear(
  lines: string[],
  gears: Set<number>,
  lineIndex: number,
  charIndex: number
): void {
  // Check above
  checkIndexIsGear(lines, lineIndex - 1, charIndex - 1, gears);
  checkIndexIsGear(lines, lineIndex - 1, charIndex, gears);
  checkIndexIsGear(lines, lineIndex - 1, charIndex + 1, gears);

  // Check current row
  checkIndexIsGear(lines, lineIndex, charIndex - 1, gears);
  checkIndexIsGear(lines, lineIndex, charIndex + 1, gears);

  // Check below
  checkIndexIsGear(lines, lineIndex + 1, charIndex - 1, gears);
  checkIndexIsGear(lines, lineIndex + 1, charIndex, gears);
  checkIndexIsGear(lines, lineIndex + 1, charIndex + 1, gears);
}

export function day3part1(): number {
  const lines = getLines(3);
  return lines.reduce((s, line, lineIndex) => {
    let numStr = '';
    let isPart = false;
    for (let charIndex = 0; charIndex < line.length; charIndex++) {
      const char = line[charIndex];
      if (!isNaN(Number(char))) {
        numStr += char;

        // Check whether this digit touches a character other than .
        if (
          isPart === false &&
          indexTouchesSymbol(lines, lineIndex, charIndex)
        ) {
          isPart = true;
        }
      }

      if (isNaN(Number(char)) || charIndex + 1 === line.length) {
        if (numStr.length && isPart) s += Number(numStr);
        numStr = '';
        isPart = false;
      }
    }
    return s;
  }, 0);
}

export function day3part2(): number {
  const lines = getLines(3);
  const gearMap: Record<string, number[]> = {};
  lines.forEach((line, lineIndex) => {
    let numStr = '';
    const gears = new Set<number>();
    for (let charIndex = 0; charIndex < line.length; charIndex++) {
      const char = line[charIndex];
      if (!isNaN(Number(char))) {
        numStr += char;
        checkIndexTouchesGear(lines, gears, lineIndex, charIndex);
      }

      if (isNaN(Number(char)) || charIndex + 1 === line.length) {
        if (numStr.length && gears.size) {
          const num = Number(numStr);
          gears.forEach((g) => {
            if (gearMap[g] == null) {
              gearMap[g] = [num];
            } else {
              gearMap[g].push(num);
            }
          });
        }
        numStr = '';
        gears.clear();
      }
    }
  });

  return Object.keys(gearMap).reduce((s, g) => {
    if (gearMap[g].length === 2) {
      const ratio = gearMap[g][0] * gearMap[g][1];
      s += ratio;
    }
    return s;
  }, 0);
}

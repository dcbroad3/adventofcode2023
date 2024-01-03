import fs from 'fs';

export function getLines(day: number): string[] {
  return fs.readFileSync(`src/days/${day}/input.txt`).toString().split('\r\n');
}

export function writeOutput(day: number, text: string): void {
  fs.writeFileSync(`src/days/${day}/output.txt`, text);
}

function getHcf(a: number, b: number): number {
  const max = a > b ? a : b;
  for (let i = max; i > 0; i--) {
    if (a % i === 0 && b % i === 0) return i;
  }

  return -1;
}

export function getLcm(a: number, b: number): number {
  return (a * b) / getHcf(a, b);
}

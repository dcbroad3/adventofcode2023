import fs from 'fs';

export function getLines(day: number): string[] {
  return fs.readFileSync(`src/days/${day}/input.txt`).toString().split('\r\n');
}

export function writeOutput(day: number, text: string): void {
  fs.writeFileSync(`src/days/${day}/output.txt`, text);
}

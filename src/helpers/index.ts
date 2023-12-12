import fs from 'fs';

export function getLines(day: number): string[] {
  const text = fs.readFileSync(`src/days/${day}/input.txt`).toString();
  return text.split('\r\n').filter((l) => !!l);
}

export function writeOutput(day: number, text: string): void {
  fs.writeFileSync(`src/days/${day}/output.txt`, text);
}

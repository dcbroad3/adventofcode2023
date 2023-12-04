import fs from 'fs';

export function getLines(day: number): string[] {
  const text = fs.readFileSync(`src/days/${day}/input.txt`).toString();
  return text.split('\r\n').filter((l) => !!l);
}

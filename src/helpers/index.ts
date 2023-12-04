import fs from 'fs';

export function getLines(path: string): string[] {
  const text = fs.readFileSync(path).toString();
  return text.split('\r\n').filter((l) => !!l);
}

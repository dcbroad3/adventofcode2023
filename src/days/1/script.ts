import fs from 'fs';

const numberStr = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
];

function getNumber(value: string): number {
  let result = numberStr.indexOf(value);
  if (result !== -1) return result;
  result = Number(value);
  if (!isNaN(result)) return result;
  throw 'Invalid number: ' + value;
}

function calculateCalibration(includeTextNumbers: boolean): void {
  const text = fs.readFileSync('src/days/1/input.txt').toString();
  const lines = text.split('\r\n').filter((l) => !!l);
  let sum = 0;
  lines.forEach((line) => {
    const firstRegex = includeTextNumbers
      ? /.*?(one|two|three|four|five|six|seven|eight|nine|\d)/
      : /.*?(\d)/;
    const lastRegex = includeTextNumbers
      ? /.*(one|two|three|four|five|six|seven|eight|nine|\d)/
      : /.*(\d)/;
    const firstMatch = line.match(firstRegex);
    const lastMatch = line.match(lastRegex);
    if (!firstMatch || !lastMatch)
      throw 'Failed to parse digits from line: ' + line;
    const first = getNumber(firstMatch[1]);
    const last = getNumber(lastMatch[1]);
    const value = Number(`${first}${last}`);
    sum += value;
    console.log(line, value, sum);
  });
  console.log('Answer:', sum);
}

export function day1part1(): void {
  calculateCalibration(false);
}

export function day1part2(): void {
  calculateCalibration(true);
}

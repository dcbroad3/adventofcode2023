import { getLines } from 'src/helpers';

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
  const lines = getLines('src/days/1/input.txt');
  const sum = lines.reduce((s, line) => {
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
    s += value;
    console.log(line, value, s);
    return s;
  }, 0);

  console.log('Answer:', sum);
}

export function day1part1(): void {
  calculateCalibration(false);
}

export function day1part2(): void {
  calculateCalibration(true);
}

import { fnMap } from './days';

const dayStr = process.argv[2];
const partStr = process.argv[3];

if (!dayStr || !partStr)
  throw 'Specify a day (1-25) and part (1-2) to run. E.G. `npm run aoc 1 1` to run day 1, part 1.';

const day = Number(process.argv[2]);
const part = Number(process.argv[3]);

function runAoc(day: number, part: number): number {
  const fn = fnMap[day]?.[part];
  if (fn == null) throw `No script available for day ${day} part ${part}.`;
  return fn();
}

console.time('Time');
console.log('Answer:', runAoc(day, part));
console.timeEnd('Time');

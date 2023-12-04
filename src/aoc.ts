import * as D from './days';

const dayStr = process.argv[2];
const partStr = process.argv[3];

if (!dayStr || !partStr)
  throw 'Specify a day (1-25) and part (1-2) to run. E.G. `npm run aoc 1 1` to run day 1, part 1.';

const day = Number(process.argv[2]);
const part = Number(process.argv[3]);

function runAoc(day: number, part: number): void {
  switch (day) {
    case 1:
      switch (part) {
        case 1:
          return D.day1part1();
        case 2:
          return D.day1part2();
      }
      break;
    case 2:
      switch (part) {
        case 1:
          return D.day2part1();
        case 2:
          return D.day2part2();
        default:
          break;
      }
      break;
    case 3:
      switch (part) {
        case 1:
          return D.day3part1();
        case 2:
          return D.day3part2();
        default:
          break;
      }
      break;
  }

  console.log(`No script available for day ${day} part ${part}.`);
}

runAoc(day, part);

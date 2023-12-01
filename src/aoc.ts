import { day1part1, day1part2 } from './days/1/script';

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
          return day1part1();
        case 2:
          return day1part2();
      }
  }

  console.log(`No script available for day ${day} part ${part}.`);
}

runAoc(day, part);

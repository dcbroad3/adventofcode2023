import { day1part1, day1part2 } from './days/1/script';

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

  console.log(`No script available for day ${day} part ${part}`);
}

runAoc(day, part);

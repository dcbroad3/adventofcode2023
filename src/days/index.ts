import { day1part1, day1part2 } from './1/script';
import { day2part1, day2part2 } from './2/script';
import { day3part1, day3part2 } from './3/script';
import { day4part1, day4part2 } from './4/script';
import { day5part1, day5part2 } from './5/script';

export const fnMap: Record<number, Record<number, () => number>> = {
  1: {
    1: day1part1,
    2: day1part2,
  },
  2: {
    1: day2part1,
    2: day2part2,
  },
  3: {
    1: day3part1,
    2: day3part2,
  },
  4: {
    1: day4part1,
    2: day4part2,
  },
  5: {
    1: day5part1,
    2: day5part2,
  },
};

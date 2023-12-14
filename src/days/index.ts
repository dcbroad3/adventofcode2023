import { day1part1, day1part2 } from './1/script';
import { day10part1, day10part2 } from './10/script';
import { day11part1, day11part2 } from './11/script';
import { day12part1, day12part2 } from './12/script';
import { day13part1, day13part2 } from './13/script';
import { day2part1, day2part2 } from './2/script';
import { day3part1, day3part2 } from './3/script';
import { day4part1, day4part2 } from './4/script';
import { day5part1, day5part2 } from './5/script';
import { day6part1, day6part2 } from './6/script';
import { day7part1, day7part2 } from './7/script';
import { day8part1, day8part2 } from './8/script';
import { day9part1, day9part2 } from './9/script';

export const fnMap: Record<number, Record<number, () => number>> = {
  1: { 1: day1part1, 2: day1part2 },
  2: { 1: day2part1, 2: day2part2 },
  3: { 1: day3part1, 2: day3part2 },
  4: { 1: day4part1, 2: day4part2 },
  5: { 1: day5part1, 2: day5part2 },
  6: { 1: day6part1, 2: day6part2 },
  7: { 1: day7part1, 2: day7part2 },
  8: { 1: day8part1, 2: day8part2 },
  9: { 1: day9part1, 2: day9part2 },
  10: { 1: day10part1, 2: day10part2 },
  11: { 1: day11part1, 2: day11part2 },
  12: { 1: day12part1, 2: day12part2 },
  13: { 1: day13part1, 2: day13part2 },
};

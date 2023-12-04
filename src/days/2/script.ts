import { getLines } from 'src/helpers';

export function day2part1(): number {
  const lines = getLines(2);
  const expected: Record<string, number> = {
    red: 12,
    green: 13,
    blue: 14,
  };
  return lines.reduce((s, line) => {
    const [gameStr, resultStr] = line.split(': ');
    const game = Number(gameStr.substring(5));
    const sets = resultStr.split('; ');
    const valid = sets.every((setStr) => {
      const colors = setStr.split(', ');
      return colors.every((colorStr) => {
        const [num, color] = colorStr.split(' ');
        if (Number(num) > expected[color]) return false;
        return true;
      });
    });

    if (valid) s += game;
    return s;
  }, 0);
}

export function day2part2(): number {
  const lines = getLines(2);
  return lines.reduce((s, line) => {
    const [_, resultStr] = line.split(': ');
    const sets = resultStr.split('; ');
    const minimum: Record<string, number> = {};
    sets.forEach((setStr) => {
      const colors = setStr.split(', ');
      colors.forEach((colorStr) => {
        const [numStr, color] = colorStr.split(' ');
        const num = Number(numStr);
        if (minimum[color] == null || minimum[color] < num)
          minimum[color] = num;
      });
    });

    const power = Object.keys(minimum)
      .map((k) => minimum[k])
      .reduce((p, n) => p * n, 1);
    s += power;
    return s;
  }, 0);
}

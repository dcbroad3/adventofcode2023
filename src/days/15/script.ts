import { getLines } from 'src/helpers';

const cache = new Map<string, number>();
function getHash(value: string): number {
  const cached = cache.get(value);
  if (cached != null) return cached;
  const result = value
    .split('')
    .reduce((hash, char) => ((hash += char.charCodeAt(0)) * 17) % 256, 0);
  cache.set(value, result);
  return result;
}

export function day15part1(): number {
  const [sequence] = getLines(15);
  const steps = sequence.split(',');
  return steps.reduce((sum, step) => (sum += getHash(step)), 0);
}

export function day15part2(): number {
  const [sequence] = getLines(15);
  const steps = sequence.split(',');

  const map = new Map<number, { label: string; focalLength: number }[]>();

  steps.forEach((s) => {
    if (s.endsWith('-')) {
      const [label] = s.split('-');
      const box = getHash(label);
      const lenses = map.get(box);
      if (lenses == null) return;
      const index = lenses.findIndex((l) => l.label === label);
      if (index !== -1) lenses.splice(index, 1);
      if (lenses.length === 0) map.delete(box);
    } else {
      const [label, numStr] = s.split('=');
      const box = getHash(label);
      const focalLength = Number(numStr);
      if (!map.has(box)) map.set(box, []);
      const lenses = map.get(box)!;
      const index = lenses?.findIndex((l) => l.label === label);
      if (index != null && index !== -1) {
        lenses.splice(index, 1, { label, focalLength });
        if (lenses.length === 0) map.delete(box);
      } else {
        lenses.push({ label, focalLength });
      }
    }
  });

  return Array.from(map.keys()).reduce((sum, key) => {
    map.get(key)?.forEach((lens, slot) => {
      const a = key + 1;
      const b = slot + 1;
      const c = lens.focalLength;
      const power = a * b * c;
      sum += power;
    });
    return sum;
  }, 0);
}

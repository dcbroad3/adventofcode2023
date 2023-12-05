import { getLines } from 'src/helpers';

interface Entry {
  destStart: number;
  sourceStart: number;
  range: number;
}

interface Almanac {
  seeds: number[];
  seedToSoil: Entry[];
  soilToFertilizer: Entry[];
  fertilizerToWater: Entry[];
  waterToLight: Entry[];
  lightToTemperature: Entry[];
  temperatureToHumidity: Entry[];
  humidityToLocation: Entry[];
}

type AlmanacMapKey = keyof Omit<Almanac, 'seeds'>;

const keys: AlmanacMapKey[] = [
  'seedToSoil',
  'soilToFertilizer',
  'fertilizerToWater',
  'waterToLight',
  'lightToTemperature',
  'temperatureToHumidity',
  'humidityToLocation',
];

function getKey(header: string): AlmanacMapKey {
  switch (header) {
    case 'seed-to-soil map:':
      return 'seedToSoil';
    case 'soil-to-fertilizer map:':
      return 'soilToFertilizer';
    case 'fertilizer-to-water map:':
      return 'fertilizerToWater';
    case 'water-to-light map:':
      return 'waterToLight';
    case 'light-to-temperature map:':
      return 'lightToTemperature';
    case 'temperature-to-humidity map:':
      return 'temperatureToHumidity';
    case 'humidity-to-location map:':
      return 'humidityToLocation';
    default:
      throw `Unrecognized header: ${header}`;
  }
}

function addEntries(entries: Entry[], line: string): void {
  const [destStart, sourceStart, range] = line.split(' ').map((n) => Number(n));
  entries.push({ destStart, sourceStart, range });
}

function sortEntries(entries: Entry[]): void {
  entries.sort((a, b) => a.sourceStart - b.sourceStart);
}

function getAlmanac(): Almanac {
  const lines = getLines(5);
  const almanac: Almanac = {
    seeds: [],
    seedToSoil: [],
    soilToFertilizer: [],
    fertilizerToWater: [],
    waterToLight: [],
    lightToTemperature: [],
    temperatureToHumidity: [],
    humidityToLocation: [],
  };
  let key: AlmanacMapKey | undefined;
  lines.forEach((line, i) => {
    if (!line) return;

    if (i === 0) {
      almanac.seeds = line
        .substring(7)
        .split(' ')
        .map((s) => Number(s));
    } else if (line.endsWith('map:')) {
      if (key) sortEntries(almanac[key]);
      key = getKey(line);
    } else if (key != null) {
      addEntries(almanac[key], line);
    }
  });
  return almanac;
}

function convertValue(value: number, entries: Entry[]): number {
  const entry = entries.find(
    (e) => e.sourceStart <= value && e.sourceStart + e.range >= value
  );
  if (entry) return value + (entry.destStart - entry.sourceStart);
  return value;
}

/** Fills all gaps in map entries with their default mappings */
function fillVoidEntries(entries: Entry[]): void {
  const entriesToAdd: Entry[] = [];
  if (entries[0].sourceStart !== 0) {
    entriesToAdd.push({
      sourceStart: 0,
      destStart: 0,
      range: entries[0].sourceStart - 1,
    });
  }

  if (entries.length > 1) {
    for (let i = 1; i < entries.length; i++) {
      const last = entries[i - 1];
      const current = entries[i];
      const lastEnd = last.sourceStart + last.range;
      const currentStart = current.sourceStart;
      const diff = currentStart - lastEnd;
      if (diff > 1) {
        entriesToAdd.push({
          sourceStart: currentStart + 1,
          destStart: currentStart + 1,
          range: diff - 1,
        });
      }
    }
  }

  const lastEntry = entries[entries.length - 1];
  const lastSource = lastEntry.sourceStart + lastEntry.range + 1;
  entriesToAdd.push({
    sourceStart: lastSource,
    destStart: lastSource,
    range: Infinity,
  });

  entries.push(...entriesToAdd);
  sortEntries(entries);
}

/** Merges overlapping intervals to their minimum set */
function mergeIntervals(intervals: [number, number][]): [number, number][] {
  intervals.sort((a, b) => a[0] - b[0]);

  const result = [intervals[0]];

  for (let i = 1; i < intervals.length; i++) {
    const current = intervals[i];
    const [currentStart, currentEnd] = current;
    const top = result[result.length - 1];
    const [_, topEnd] = top;

    if (topEnd < currentStart) {
      result.push(current);
    } else if (topEnd < currentEnd) {
      top[1] = currentEnd;
    }
  }

  return result;
}

function convertInterval(
  interval: [number, number],
  entries: Entry[]
): [number, number][] {
  const [start, end] = interval;
  const filtered = entries.filter(
    (e) => start <= e.sourceStart + e.range && end >= e.sourceStart
  );
  return filtered.map((entry): [number, number] => {
    const diff = entry.destStart - entry.sourceStart;
    const entryEnd = entry.sourceStart + entry.range;
    const convertedStart =
      entry.sourceStart < start ? start : entry.sourceStart;
    const convertedEnd = entryEnd > end ? end : entryEnd;
    return [convertedStart + diff, convertedEnd + diff];
  });
}

function convertIntervals(
  intervals: [number, number][],
  entries: Entry[]
): [number, number][] {
  const result = intervals.reduce((result: [number, number][], interval) => {
    result.push(...convertInterval(interval, entries));
    return result;
  }, []);
  return mergeIntervals(result);
}

export function day5part1(): number {
  const almanac = getAlmanac();
  const locations = almanac.seeds.map((seed) => {
    let result = seed;
    keys.forEach((k) => (result = convertValue(result, almanac[k])));
    return result;
  });

  return Math.min(...locations);
}

export function day5part2(): number {
  const almanac = getAlmanac();
  keys.forEach((k) => fillVoidEntries(almanac[k]));

  const seeds: [number, number][] = [];
  for (let i = 0; i < almanac.seeds.length - 1; i += 2) {
    const start = almanac.seeds[i];
    const length = almanac.seeds[i + 1];
    seeds.push([start, start + length]);
  }

  let result = seeds;
  keys.forEach((k) => (result = convertIntervals(result, almanac[k])));
  return result[0][0];
}

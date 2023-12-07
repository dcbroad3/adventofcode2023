import { getLines } from 'src/helpers';

const valueMap: Record<string, number> = {
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  T: 10,
  J: 11,
  Q: 12,
  K: 13,
  A: 14,
};
enum HandType {
  HighCard = 0,
  OnePair = 1,
  TwoPair = 2,
  ThreeKind = 3,
  FullHouse = 4,
  FourKind = 5,
  FiveKind = 6,
}
interface HandData {
  type: HandType;
  values: number[];
  bid: number;
  line: string;
}

function getHandType(values: number[]): HandType {
  const map = new Map<number, number>();
  let wild = 0;
  values.forEach((v) =>
    v === 1 ? wild++ : map.set(v, map.has(v) ? map.get(v)! + 1 : 1)
  );
  const counts = Array.from(map.keys())
    .map((k) => map.get(k)!)
    .sort((a, b) => b - a);

  switch ((counts[0] ?? 0) + wild) {
    case 5:
      return HandType.FiveKind;
    case 4:
      return HandType.FourKind;
    case 3: {
      if (counts[1] === 2) return HandType.FullHouse;
      return HandType.ThreeKind;
    }
    case 2: {
      if (counts[1] === 2) return HandType.TwoPair;
      return HandType.OnePair;
    }
    default:
      return HandType.HighCard;
  }
}

function getHandData(line: string, jokerWild: boolean): HandData {
  const [handStr, bidStr] = line.split(' ');
  const values = Array.from(handStr).map((c) =>
    c === 'J' && jokerWild ? 1 : valueMap[c]
  );
  const bid = Number(bidStr);
  return {
    type: getHandType(values),
    values,
    bid,
    line,
  };
}

function getWinnings(jokerWild: boolean): number {
  const lines = getLines(7);
  const hands = lines.map((l) => getHandData(l, jokerWild));
  hands.sort((a, b) => {
    if (a.type !== b.type) return a.type - b.type;

    for (let i = 0; i < a.values.length; i++) {
      if (a.values[i] !== b.values[i]) return a.values[i] - b.values[i];
    }

    return 0;
  });

  let sum = 0;
  hands.forEach((h, i) => {
    sum += h.bid * (i + 1);
  });
  return sum;
}

export function day7part1(): number {
  return getWinnings(false);
}

export function day7part2(): number {
  return getWinnings(true);
}

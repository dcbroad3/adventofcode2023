import { getLcm, getLines } from 'src/helpers';

enum ModuleType {
  Broadcaster = 0,
  FlipFlop = 1,
  Conjunction = 2,
}

type PulseType = 'hi' | 'lo';

interface Pulse {
  type: PulseType;
  source: string;
  destination: string;
}

interface ModuleBase {
  type: ModuleType;
  destinations: string[];
}

interface Broadcaster extends ModuleBase {
  type: ModuleType.Broadcaster;
}

interface FlipFlop extends ModuleBase {
  type: ModuleType.FlipFlop;
  value: boolean;
}

interface Conjunction extends ModuleBase {
  type: ModuleType.Conjunction;
  inputs: Record<string, PulseType>;
}

type Module = Broadcaster | FlipFlop | Conjunction;

interface State {
  count: Record<PulseType, number>;
  frequency: Record<string, number | null>;
  modules: Record<string, Module>;
}

function getState(): State {
  const lines = getLines(20);
  const modules: Record<string, Module> = {};
  for (const line of lines) {
    const [id, destinationStr] = line.split(' -> ');
    const destinations = destinationStr.split(', ');
    if (id.startsWith('%')) {
      // FlipFlop
      modules[id.substring(1)] = {
        type: ModuleType.FlipFlop,
        destinations,
        value: false,
      };
    } else if (id.startsWith('&')) {
      // Conjunction
      modules[id.substring(1)] = {
        type: ModuleType.Conjunction,
        destinations,
        inputs: {},
      };
    } else {
      // Broadcaster
      modules[id] = { type: ModuleType.Broadcaster, destinations };
    }
  }

  // Set up initial pulses for conjunction modules
  for (const key of Object.keys(modules)) {
    const module = modules[key];
    for (const destinationId of module.destinations) {
      const destination = modules[destinationId];
      if (destination?.type === ModuleType.Conjunction) {
        destination.inputs[key] = 'lo';
      }
    }
  }

  const count: Record<PulseType, number> = { hi: 0, lo: 0 };

  const source = modules['ll'] as Conjunction;

  return {
    modules,
    count,
    frequency: Object.keys(source.inputs).reduce(
      (freq: Record<string, number | null>, b) => {
        freq[b] = null;
        return freq;
      },
      {}
    ),
  };
}

function pressButton(state: State, i: number): void {
  let pulses: Pulse[] = [
    { type: 'lo', source: 'button', destination: 'broadcaster' },
  ];
  while (pulses.length) {
    const next: Pulse[] = [];
    for (const pulse of pulses) {
      state.count[pulse.type]++;

      const destination = state.modules[pulse.destination];
      if (destination == null) continue;

      if (
        pulse.destination === 'll' &&
        pulse.type === 'hi' &&
        state.frequency[pulse.source] == null
      ) {
        state.frequency[pulse.source] = i;
      }

      const source = pulse.destination;
      switch (destination.type) {
        case ModuleType.Broadcaster: {
          destination.destinations.forEach((d) => {
            next.push({ type: pulse.type, source, destination: d });
          });
          break;
        }
        case ModuleType.FlipFlop: {
          if (pulse.type === 'lo') {
            destination.value = !destination.value;
            const type = destination.value ? 'hi' : 'lo';
            destination.destinations.forEach((d) => {
              next.push({ type, source, destination: d });
            });
          }
          break;
        }
        case ModuleType.Conjunction: {
          destination.inputs[pulse.source] = pulse.type;
          const type = Object.keys(destination.inputs).every(
            (i) => destination.inputs[i] === 'hi'
          )
            ? 'lo'
            : 'hi';
          destination.destinations.forEach((d) => {
            next.push({ type, source, destination: d });
          });
          break;
        }
      }
    }

    pulses = next;
  }
}

export function day20part1(): number {
  const state = getState();
  for (let i = 0; i < 1000; i++) pressButton(state, i);
  return state.count.hi * state.count.lo;
}

export function day20part2(): number {
  const state = getState();
  let i = 0;
  for (;;) {
    i++;
    pressButton(state, i);
    if (Object.keys(state.frequency).every((f) => state.frequency[f] != null))
      break;
  }

  const values = Object.keys(state.frequency).map(
    (f) => state.frequency[f]
  ) as number[];

  while (values.length > 1) {
    values.sort((a, b) => b - a);
    const a = values.pop() as number;
    const b = values.pop() as number;
    values.push(getLcm(a, b));
  }

  return values[0];
}

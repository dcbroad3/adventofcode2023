import { getLines } from 'src/helpers';

interface Rule {
  field: keyof Part;
  operator: '>' | '<';
  value: number;
  result: string;
}

interface Part {
  x: number;
  m: number;
  a: number;
  s: number;
}

function getPuzzle(): [Record<string, (Rule | string)[]>, Part[]] {
  const lines = getLines(19);
  const rules: Record<string, (Rule | string)[]> = {};
  const parts: Part[] = [];
  let section = 0;
  for (const line of lines) {
    if (!line) {
      section++;
    } else if (section === 0) {
      const [name, puzzleStr] = line.split('{');
      const parts = puzzleStr.substring(0, puzzleStr.length - 1).split(',');
      rules[name] = parts.map((p) => {
        const split = p.split(':');
        if (split.length > 1) {
          const [compare, result] = split;
          const operator = compare.indexOf('<') !== -1 ? '<' : '>';
          const [prop, value] = compare.split(operator);
          return {
            field: prop as keyof Part,
            operator,
            value: Number(value),
            result,
          };
        }

        return p;
      });
    } else {
      const values = line
        .substring(1, line.length - 1)
        .split(',')
        .map((v) => Number(v.split('=')[1]));
      parts.push({ x: values[0], m: values[1], a: values[2], s: values[3] });
    }
  }

  return [rules, parts];
}

export function day19part1(): number {
  const [rules, parts] = getPuzzle();
  let sum = 0;
  for (const part of parts) {
    let workflowId = 'in';

    for (;;) {
      if (workflowId === 'A') {
        sum += part.x + part.m + part.a + part.s;
        break;
      } else if (workflowId === 'R') {
        break;
      }

      const workflow = rules[workflowId];
      for (const step of workflow) {
        if (typeof step === 'string') {
          workflowId = step;
          break;
        } else if (step.operator === '>') {
          if (part[step.field] > step.value) {
            workflowId = step.result;
            break;
          }
        } else {
          if (part[step.field] < step.value) {
            workflowId = step.result;
            break;
          }
        }
      }
    }
  }

  return sum;
}

type Values = Record<keyof Part, [number, number]>;
interface Test {
  id: string;
  values: Values;
}

const fields: (keyof Part)[] = ['x', 'm', 'a', 's'];
function getValidResults(values: Values): number {
  return fields.reduce((sum, field) => {
    return sum * (values[field][1] - values[field][0] + 1);
  }, 1);
}

export function day19part2(): number {
  const [rules] = getPuzzle();

  let sum = 0;
  let test: Test[] = [
    {
      id: 'in',
      values: {
        x: [1, 4000],
        m: [1, 4000],
        a: [1, 4000],
        s: [1, 4000],
      },
    },
  ];
  while (test.length) {
    const next: Test[] = [];
    for (const t of test) {
      if (t.id === 'A') {
        // Add valid results for this range
        sum += getValidResults(t.values);
        continue;
      } else if (t.id === 'R') {
        // Reject, continue
        continue;
      }

      const values = t.values;
      for (const rule of rules[t.id]) {
        if (typeof rule === 'string') {
          // Set up new rule to test with same values
          next.push({ id: rule, values });
        } else {
          const testValues: Values = {
            x: [values.x[0], values.x[1]],
            m: [values.m[0], values.m[1]],
            a: [values.a[0], values.a[1]],
            s: [values.s[0], values.s[1]],
          };
          if (rule.operator === '>') {
            if (testValues[rule.field][1] > rule.value) {
              // Set up new values
              if (testValues[rule.field][0] < rule.value) {
                testValues[rule.field][0] = rule.value + 1;
                values[rule.field][1] = rule.value;
              }

              next.push({ id: rule.result, values: testValues });
            } // Otherwise not possible
          } else {
            if (testValues[rule.field][0] < rule.value) {
              // Set up new values
              if (testValues[rule.field][1] > rule.value) {
                testValues[rule.field][1] = rule.value - 1;
                values[rule.field][0] = rule.value;
              }

              next.push({ id: rule.result, values: testValues });
            } // Otherwise not possible
          }
        }
      }
    }

    test = next;
  }

  return sum;
}

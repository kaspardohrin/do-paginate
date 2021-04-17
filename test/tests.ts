import paginate from '../src/paginate'

type Parameters = [
  index_current: number,
  items_per_page: number,
  items_total: number,
  offset: number,
]

type TestCase = [
  tag: string,
  expected: Array<number>,
  input: Parameters,
]

const test_cases: Array<TestCase> = [
  [
    'i IS FIRST',
    [1, 2, 3, 4, 5],
    [1, 10, 1000, 2],
  ],

  [
    'i IS LAST',
    [16, 17, 18, 19, 20],
    [20, 10, 200, 2],
  ],

  [
    'i IS MIDDLE',
    [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    [10, 10, 1000, 5],
  ],

  [
    'OFFSET > CONTENT',
    [1, 2, 3, 4, 5],
    [1, 10, 50, 5],
  ],

  [
    'INDEX > CONTENT',
    [1, 2, 3, 4, 5],
    [6, 10, 50, 2],
  ],

  [
    'N/PAGE > CONTENT',
    [1],
    [1, 25, 10, 5],
  ],

  [
    'i WAY OVER & OFFSET > CONTENT',
    [1, 2, 3, 4, 5],
    [500, 10, 50, 10],
  ],

  [
    'ALL NEGATIVE',
    [1],
    [-1, -1, -1, -1],
  ],

  [
    'ALL NaN',
    [1],
    [NaN, NaN, NaN, NaN],
  ],

  [
    'ALL -NaN',
    [1],
    [-NaN, -NaN, -NaN, -NaN],
  ],

  [
    'Infinity',
    Array.from({ length: 1e5 * 2 + 1 }, (_, i) => i++ + (1e15 - 1e5)),
    [Infinity, 25, Infinity, Infinity],
  ],

  [
    '+-Infinity',
    Array.from({ length: 1e5 * 2 + 1 }, (_, i) => i++ + 1),
    [-Infinity, 25, Infinity, Infinity],
  ],

  [
    '-Infinity',
    [1],
    [-Infinity, 25, -Infinity,-Infinity],
  ],

]

const equals = (x: Array<number>, y: Array<number>): boolean => {

  for (let i = 0; i < x.length; i++) {
    if (x[i] !== y[i]) return false
  }
  return true
}

const evaluate = ([tag, expected, [i, n, t, o]]: TestCase): boolean => {

  const start: [number, number] = process.hrtime()

  const received: Array<number> = paginate(i, n, t, o)

  const equal: boolean = equals(expected, received)

  const [s, ns]: [number, number] = process.hrtime(start)

  const _ms: number = (s + (ns / 1e9) * 1e3)

  return (equal)
    ? (console.info(
      `\x1b[32m\x1b[1m %s\x1b[0m \x1b[32m%s\x1b[0m \x1b[1m%s\x1b[0m`,
      `${tag}`,
      `passed in:`,
      `${_ms.toFixed(3)}ms`,
    ),
      true
    )
    // this is end of the function, and for conveniency im mutating `received` and/or `expected` above 20 elements
    : (console.error(
      `\x1b[41m %s \x1b[0m \x1b[31m%s \n \x1b[1m%s\n \x1b[31m%s\x1b[0m`,
      `${tag}`,
      `failed`,
      (expected.length < 20) ? `expected: ${expected}` : `expected [${expected.shift()}, ..., ${expected.pop()}]`,
      (received.length < 20) ? `received: ${received}` : `received [${received.shift()}, ..., ${received.pop()}]`,
    ),
      false
    )
}

const run = (tc: Array<TestCase>): void => {
  const start: [number, number] = process.hrtime()

  const results: Array<boolean> = tc.map((x: TestCase, _: number) => evaluate(x))

  const score: number = results.reduce((cum: number, x: boolean) => (x) ? cum += 1 : cum, 0)

  const [s, ns]: [number, number] = process.hrtime(start)

  const _s: number = s + (ns / 1e9)

  console.info(
    `\n${(tc.length === score) ? '\x1b[32m' : '\x1b[33m'}\x1b[1m%s %s\x1b[0m`,
    `${score}/${results.length}`,
    `tests passed!`
  )

  console.info(
    `\n\x1b[33m%s\x1b[0m`,
    `done testing ${tc.length} test-case(s) in ${_s.toFixed(3)}s`,
  )
}

run(test_cases)

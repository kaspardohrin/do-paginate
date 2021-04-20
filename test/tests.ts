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
    'INDEX, LIMIT, CONTENT, OFFSET ARE FRACTION >x.0, <x.5',
    [20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
    [25.01, 10.01, 500.01, 5.01],
  ],

  [
    'INDEX, LIMIT, CONTENT, OFFSET ARE FRACTION >x.5, <(x-1).0',
    [20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
    [25.99, 10.99, 500.99, 5.99],
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
    'CONTENT JUST BARELY OVER N/PAGES',
    [1, 2],
    [1, 10, 11, 5],
  ],

  [
    'i WAY OVER && OFFSET > CONTENT',
    [1, 2, 3, 4, 5, 6],
    [500, 10, 51, 10],
  ],

  [
    'ALL 1',
    [1],
    [1, 1, 1, 1],
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
    '-Infinity',
    [1],
    [-Infinity, 25, -Infinity, -Infinity],
  ],

  [
    '+-Infinity',
    Array.from({ length: 1e5 * 2 + 1 }, (_, i) => i++ + 1),
    [-Infinity, 25, Infinity, Infinity],
  ],

  [
    'Infinity',
    Array.from({ length: 1e5 * 2 + 1 }, (_, i) => i++ + (1e15 - 1e5)),
    [Infinity, 25, Infinity, Infinity],
  ],
]

const equals = (x: Array<number>, y: Array<number>): boolean => {

  if (!x.length) return (x.length === y.length)

  for (let i = 0; i < x.length; i++) {
    if (x[i] !== y[i]) return false
  }
  return (x.length === y.length)
}

const evaluate = ([tag, expected, [i, n, t, o]]: TestCase): boolean => {

  const start: [number, number] = process.hrtime()

  const received: Array<number> = paginate(i, n, t, o)

  const equal: boolean = equals(expected, received)

  const [s, ns]: [number, number] = process.hrtime(start)

  const _ms: number = (s * 1e3) + (ns / 1e6)

  return (equal)
    ? (console.info(
      `\x1b[32m\x1b[1m %s\x1b[0m \x1b[32m%s\x1b[0m \x1b[1m%s\x1b[0m`,
      `${tag}`,
      `passed in:`,
      `${_ms.toFixed(3)}ms`,
    ),
      true
    )
    // this is end of the function, for conveniency im mutating `received` and/or `expected` above 20 elements
    : (console.error(
      `\x1b[41m %s \x1b[0m \x1b[31m%s \n \x1b[1m%s\n \x1b[31m%s\x1b[0m`,
      `${tag}`,
      `failed`,
      (expected.length < 20) ? `expected: [${expected}]` : `expected [${expected.shift()}, ..., ${expected.pop()}]`,
      (received.length < 20) ? `received: [${received}]` : `received [${received.shift()}, ..., ${received.pop()}]`,
    ),
      false
    )
}

const run = (tc: Array<TestCase>): boolean => {
  const start: [number, number] = process.hrtime()

  const results: Array<boolean> = tc.map((x: TestCase, _: number) => evaluate(x))

  const score: number = results.reduce((cum: number, x: boolean) => (x) ? cum += 1 : cum, 0)

  const [s, ns]: [number, number] = process.hrtime(start)

  const _s: number = s + (ns / 1e9)

  const success: boolean = (tc.length === score)

  console.info(
    `\n${(success) ? '\x1b[32m' : '\x1b[33m'}\x1b[1m%s %s\x1b[0m`,
    `${score}/${tc.length}`,
    `tests passed!`
  )

  console.error(
    `\n\x1b[33m%s\x1b[0m`,
    `done testing ${tc.length} test-case(s) in ${_s.toFixed(3)}s`,
  )

  return success
}

// return error code when any tests fail, this is useful when setting up ci,
// where the deployment/merge process should be cancelled when not all checks pass
run(test_cases) ? process.exit(0) : process.exit(125)

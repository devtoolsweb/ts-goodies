import { BitFlagged, IBitFlags } from '../lib'

type TestFlags = 'apple' | 'banana' | 'orange' | 'lime' | 'plum'

interface TestClass {
  flags: IBitFlags<TestFlags>
}

@BitFlagged
class TestClass {}

test('bit flags should have exact values', () => {
  const a = new TestClass()
  const b = new TestClass()
  a.flags
    .set('apple')
    .set('banana')
    .set('orange')

  b.flags
    .set('lime')
    .set('plum')
    .set('banana')

  expect(a.flags.bits).toBe(0b111)
  expect(b.flags.bits).toBe(0b11010)
})

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
    .setFlag('apple')
    .setFlag('banana')
    .setFlag('orange')

  b.flags
    .setFlag('lime')
    .setFlag('plum')
    .setFlag('banana')

  expect(a.flags.bits).toBe(0b111)
  expect(b.flags.bits).toBe(0b11010)
})

import { BitFlagged, IBitFlags } from '../lib'

type TestFlags = 'apple' | 'banana' | 'orange' | 'lime' | 'plum'

interface TestClass {
  flags: IBitFlags<TestFlags>
}

@BitFlagged
class TestClass {}

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
console.log(
  a.flags.bits.toString(2).padStart(10, '0'),
  a.flags.isSet('lime'),
  a.flags.isSet('apple')
)
console.log(b.flags.bits.toString(2).padStart(10, '0'))

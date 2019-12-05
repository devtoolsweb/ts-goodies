import { Memoize } from '../../lib'

class TestClass {
  private propertyCounter = 0
  private methodWithoutArgsCounter = 0

  @Memoize()
  get calculatedProperty () {
    console.log('Get property value')
    if (this.propertyCounter++ > 0) {
      throw new Error('Undefined behavior')
    }
    return Array.from({ length: 100 }, (_, i) => i).reduce(
      (s, v) => s + v * v,
      0
    )
  }

  @Memoize()
  methodWithoutArgs () {
    console.log('Call method without args')
    if (this.methodWithoutArgsCounter++ > 0) {
      throw new Error('Undefined behavior')
    }
    return Array.from({ length: 100 }, (_, i) => i).reduce(
      (s, v) => s + v * v * v,
      0
    )
  }

  @Memoize()
  methodWithArgs (a: number, b: number) {
    console.log('Call method with args')
    return a * a + b * b
  }

  @Memoize((...args: number[]) => args.map(x => x.toString()).join(':::::'))
  methodWithArgs2 (a: number, b: number, c: number) {
    console.log('Call method with args 2')
    return a * a + b * b + c * c
  }
}

const c = new TestClass()
console.log('Property value:', c.calculatedProperty, c.calculatedProperty)
console.log(
  'Method without args result:',
  c.methodWithoutArgs(),
  c.methodWithoutArgs()
)
console.log(
  'Method with args result:',
  c.methodWithArgs(100, 200),
  c.methodWithArgs(100, 200),
  c.methodWithArgs(300, 400)
)

console.log(
  'Method with args result:',
  c.methodWithArgs2(1, 2, 3),
  c.methodWithArgs2(1, 2, 3),
  c.methodWithArgs2(4, 5, 6)
)

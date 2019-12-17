import { Memoize } from '../lib'

class TestClass {
  readonly guards: Partial<Record<keyof TestClass, true>> = {}

  @Memoize()
  get calculatedProperty () {
    if (this.guards['calculatedProperty']) {
      throw new Error('Undefined behavior')
    }
    this.guards['calculatedProperty'] = true
    return Array.from({ length: 100 }, (_, i) => i).reduce(
      (s, v) => s + v * v,
      0
    )
  }

  @Memoize()
  methodWithoutArgs () {
    if (this.guards['methodWithoutArgs']) {
      throw new Error('Undefined behavior')
    }
    this.guards['methodWithoutArgs'] = true
    return Array.from({ length: 100 }, (_, i) => i).reduce(
      (s, v) => s + v * v * v,
      0
    )
  }

  @Memoize()
  methodWithArgs (a: number, b: number) {
    if (this.guards['methodWithArgs']) {
      throw new Error('Undefined behavior')
    }
    this.guards['methodWithArgs'] = true
    return a * a + b * b
  }
}

test('Calculated property', () => {
  const c = new TestClass()
  expect(c.calculatedProperty).toBe(328350)
})

test('Method without args', () => {
  const c = new TestClass()
  c.methodWithoutArgs()
  c.methodWithoutArgs()
})

test('Method with args', () => {
  const c = new TestClass()
  c.methodWithArgs(100, 200)
  c.methodWithArgs(100, 200)
  expect(() => c.methodWithArgs(300, 400)).toThrow(Error)
})

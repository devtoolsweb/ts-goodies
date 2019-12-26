import { Memoize } from '../lib'

class TestClass {
  readonly counters: Partial<Record<keyof TestClass, number>> = {}

  @Memoize()
  get calculatedProperty() {
    this.counters['calculatedProperty'] =
      (this.counters['calculatedProperty'] || 0) + 1
    return Array.from({ length: 100 }, (_, i) => i).reduce(
      (s, v) => s + v * v,
      0
    )
  }

  @Memoize()
  methodWithoutArgs() {
    this.counters['methodWithoutArgs'] =
      (this.counters['methodWithoutArgs'] || 0) + 1
    return Array.from({ length: 100 }, (_, i) => i).reduce(
      (s, v) => s + v * v * v,
      0
    )
  }

  @Memoize()
  methodWithArgs(a: number, b: number) {
    this.counters['methodWithArgs'] = (this.counters['methodWithArgs'] || 0) + 1
    return a * a + b * b
  }
}

test('should calculate the property once', () => {
  const c = new TestClass()
  expect(c.calculatedProperty).toBe(328350)
  expect(c.calculatedProperty).toBe(328350)
  expect(c.counters['calculatedProperty']).toBe(1)
})

test('should call method once', () => {
  const c = new TestClass()
  c.methodWithoutArgs()
  c.methodWithoutArgs()
  expect(c.counters['methodWithoutArgs']).toBe(1)
})

test('should call method with arguments once', () => {
  const c = new TestClass()
  c.methodWithArgs(100, 200)
  c.methodWithArgs(100, 200)
  expect(c.counters['methodWithArgs']).toBe(1)
  c.methodWithArgs(300, 400)
  c.methodWithArgs(300, 400)
  expect(c.counters['methodWithArgs']).toBe(2)
})

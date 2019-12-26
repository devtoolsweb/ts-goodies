export type MemoizeHashFunction = (...args: any[]) => any

export const Memoize = (hashFn?: MemoizeHashFunction) => {
  return (
    target: Object,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) => {
    const key = Symbol.for(`${target.constructor.name}.${propertyKey}`)
    if (descriptor.value instanceof Function) {
      descriptor.value = makeFunction(key, descriptor.value, hashFn)
    } else if (descriptor.get) {
      descriptor.get = makeGetter(key, descriptor)
    } else {
      throw new Error(
        'The decorator @Memoize() is applicable only to a method or a property get accessor'
      )
    }
  }
}

const makeGetter = (key: symbol, descriptor: PropertyDescriptor) => {
  const getter = descriptor.get!
  return function(this: any, ...args: []) {
    if (this.hasOwnProperty(key)) {
      return this[key]
    } else {
      const value = getter.apply(this, args)
      Object.defineProperty(this, key, {
        configurable: false,
        enumerable: false,
        value,
        writable: false
      })
      return value
    }
  }
}

const makeFunction = (
  propertyKey: symbol,
  sourceFn: Function,
  hashFn?: MemoizeHashFunction
) => {
  return function(this: any, ...args: any[]) {
    let cache = this
    let key = propertyKey
    let value
    if (args.length) {
      cache = this[propertyKey]
      if (!cache) {
        cache = {}
        this[propertyKey] = cache
      }
      key = Symbol.for(
        hashFn
          ? hashFn.apply(this, args)
          : args.map(v => v.toString()).join('.')
      )
    }
    if (cache.hasOwnProperty(key)) {
      value = cache[key]
    } else {
      value = sourceFn.apply(this, args)
      cache[key] = value
    }
    return value
  }
}

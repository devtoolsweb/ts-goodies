/**
 * Alternatively, you can use package 'typescript-memoize':
 * https://github.com/darrylhodgins/typescript-memoize
 */

export type MemoizeHashFunction = (...args: unknown[]) => unknown

interface IPropertyBag<T = object> {
    [x: symbol]: T
}

type StringLike = { toString: () => string }

export const Memoize = (hashFn?: MemoizeHashFunction) => {
    return (
        target: object,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) => {
        let name = target.constructor.name
        if (name === 'Function') {
            name = `${(target as {name: string}).name}Constructor`
        }
        const key = Symbol.for(`${name}.${propertyKey}`)
        if (descriptor.value instanceof Function) {
            descriptor.value = makeFunction(key, descriptor.value, hashFn)
        }
        else if (descriptor.get) {
            descriptor.get = makeGetter(key, descriptor)
        }
        else {
            throw new Error('The decorator @Memoize() is applicable only to a method or a property get accessor')
        }
    }
}

const makeGetter = <T>(key: symbol, descriptor: PropertyDescriptor) => {
    const getter = descriptor.get as (...args: unknown[]) => T
    return function (this: object, ...args: []) {
        if (Object.prototype.hasOwnProperty.call(this, key)) {
            return (this as IPropertyBag<T>)[key]
        }
        else {
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
    sourceFn: () => void,
    hashFn?: MemoizeHashFunction
) => {
    return function (this: object, ...args: unknown[]) {
        let cache = this as IPropertyBag
        let key = propertyKey
        let value: unknown
        if (args.length) {
            cache = (this as IPropertyBag)[propertyKey] as IPropertyBag
            if (!cache) {
                cache = {} as IPropertyBag
                (this as IPropertyBag)[propertyKey] = cache
            }
            key = Symbol.for(hashFn
                ? hashFn.apply(this, args) as string
                : args.map(v => (v as StringLike).toString()).join('.'))
        }
        if (Object.prototype.hasOwnProperty.call(cache, key)) {
            value = cache[key]
        }
        else {
            value = sourceFn.apply(this, args as [])
            ;(cache as IPropertyBag<unknown>)[key] = value
        }
        return value
    }
}

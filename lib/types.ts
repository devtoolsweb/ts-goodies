export interface IConstructor<T = object> {
    new (...args: unknown[]): T
}

// @deprecated Use type Constructor from the 'type-fest' package instead
export type Constructor<T = object> = new (...args: unknown[]) => T

export type ArrayLengthMutationKeys =
  | 'splice'
  | 'push'
  | 'pop'
  | 'shift'
  | 'unshift'
  | number

export type ArrayItems<T extends Array<unknown>> = T extends Array<infer TItems>
    ? TItems
    : never

export type FixedLengthArray<T extends unknown[]> = Pick<
T,
Exclude<keyof T, ArrayLengthMutationKeys>
> & {
    [Symbol.iterator]: () => IterableIterator<ArrayItems<T>>
}

export type IndexedFixedLengthArray<T extends unknown[]> = Pick<
T,
Exclude<keyof T, ArrayLengthMutationKeys>
> & {
    [I: number]: T extends Array<infer TItems> ? TItems : never
    [Symbol.iterator]: () => IterableIterator<ArrayItems<T>>
}

export type JsonValue =
  | null
  | boolean
  | number
  | string
  | JsonValue[]
  | { [prop: string]: JsonValue }

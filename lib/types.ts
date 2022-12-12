export interface IConstructor<T = object> {
    new (...args: unknown[]): T
}

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

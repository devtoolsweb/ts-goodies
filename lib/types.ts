export interface IConstructor<T = {}> {
  new (...args: any[]): T
}

export type Constructor<T = {}> = new (...args: any[]) => T

// export type FixedLengthArray<T, L extends number, TObj = [T, ...Array<T>]> = Pick<
//   TObj,
// Exclude<keyof TObj, ArrayLengthMutationKeys>
// > & {
//   readonly length: L
//   [I: number]: T
//   [Symbol.iterator]: () => IterableIterator<T>
// }

export type ArrayLengthMutationKeys = 'splice' | 'push' | 'pop' | 'shift' | 'unshift' | number

export type ArrayItems<T extends Array<any>> = T extends Array<infer TItems> ? TItems : never

export type FixedLengthArray<T extends any[]> = Pick<
  T,
  Exclude<keyof T, ArrayLengthMutationKeys>
> & {
  [Symbol.iterator]: () => IterableIterator<ArrayItems<T>>
}

export type IndexedFixedLengthArray<T extends any[]> = Pick<
  T,
  Exclude<keyof T, ArrayLengthMutationKeys>
> & {
  [I: number]: T extends Array<infer TItems> ? TItems : never
  [Symbol.iterator]: () => IterableIterator<ArrayItems<T>>
}

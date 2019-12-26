/**
 * Alternatively, you can simply use package 'using-statement':
 * https://github.com/dsherret/using-statement
 */
import { isPromise } from './utils'

export interface IDisposable {
  dispose(): void
}

export interface IAsyncDisposable {
  dispose(): Promise<void>
}

export function using<T extends IDisposable, R = undefined>(
  x: T,
  body: (obj: T) => R
): R

export async function using<T extends IAsyncDisposable, R = undefined>(
  x: T,
  body: (obj: T) => Promise<R>
): Promise<R>

export function using<T extends IDisposable, R = undefined>(
  x: T,
  body: (obj: T) => R | Promise<R>
): R | Promise<R> {
  let result: R | Promise<R>
  let shouldDispose = true
  try {
    result = body(x)
    if (isPromise<R>(result)) {
      shouldDispose = false
      return result.finally(() => x.dispose()).then(() => result)
    }
  } finally {
    if (shouldDispose) {
      x.dispose()
    }
  }
  return result
}

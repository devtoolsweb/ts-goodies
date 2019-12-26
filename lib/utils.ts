export function isPromise<TResult>(x: unknown): x is Promise<TResult> {
  return (
    x != null &&
    typeof (x as any).then === 'function' &&
    typeof (x as any).finally === 'function'
  )
}

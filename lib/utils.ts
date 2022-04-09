export function isPromise<TResult> (x: unknown): x is Promise<TResult> {
    if (x) {
        const p = x as {
            finally: unknown,
            then: unknown
        }
        return (
            typeof p.then === 'function' && typeof p.finally === 'function'
        )
    }
    return false
}

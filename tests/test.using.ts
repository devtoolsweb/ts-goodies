import { IDisposable, IAsyncDisposable, using } from '../lib'

class Disposable implements IDisposable {
  isDisposed = false

  dispose() {
    this.isDisposed = true
  }
}

class AsyncDisposable implements IAsyncDisposable {
  isDisposed = false

  dispose() {
    return new Promise<void>(resolve => {
      setTimeout(() => {
        this.isDisposed = true
        resolve()
      }, 0)
    })
  }
}

test('should dispose the resource synchronously', () => {
  const disposable = new Disposable()
  using(disposable, () => {
    expect(disposable.isDisposed).toBeFalsy()
  })

  expect(disposable.isDisposed).toBeTruthy()
})

test('should dispose the resource when an exception occurs', () => {
  const disposable = new Disposable()
  try {
    using(disposable, () => {
      throw new Error()
    })
  } catch {}

  expect(disposable.isDisposed).toBeTruthy()
})

test('should dispose the resource asynchronously', async () => {
  const disposable = new Disposable()
  const result = using(disposable, () => {
    expect(disposable.isDisposed).toBeFalsy()
    return new Promise(resolve => {
      expect(disposable.isDisposed).toBeFalsy()
      resolve()
    })
  })

  expect(disposable.isDisposed).toBeFalsy()
  await result
  expect(disposable.isDisposed).toBeTruthy()
})

test('should return the returned value', () => {
  const disposable = new Disposable()
  const result = using(disposable, () => {
    return 5
  })

  expect(result).toBe(5)
})

test('should throw error if providing undefined', () => {
  let disposable: Disposable | undefined = undefined

  expect(() => {
    using(disposable as any, () => {})
  }).toThrowError()
})

test('should dispose the asynchronous resource', async () => {
  const disposable = new AsyncDisposable()
  const result = using(disposable, () => {
    return new Promise(resolve => resolve())
  })

  expect(disposable.isDisposed).toBeFalsy()
  await result
  expect(disposable.isDisposed).toBeTruthy()
})

test('should handle disposing when the promise is rejected', async () => {
  const disposable = new Disposable()
  try {
    await using(disposable, () => {
      return Promise.reject(new Error())
    })
  } catch {}

  expect(disposable.isDisposed).toBeTruthy()
})

it('should get the returned value', async () => {
  const disposable = new Disposable()
  const promise = using(disposable, () => {
    return new Promise<number>(resolve => {
      expect(disposable.isDisposed).toBeFalsy()
      resolve(5)
    })
  })

  const result = await promise
  expect(result).toBe(5)
})

test('should get the returned value when disposing asynchronously', async () => {
  const disposable = new AsyncDisposable()
  const promise = using(disposable, () => {
    return new Promise<number>(resolve => {
      expect(disposable.isDisposed).toBeFalsy()
      resolve(5)
    })
  })

  const result = await promise
  expect(result).toBe(5)
})

interface IDisposable {
  dispose(): Promise<void> | void
}

export async function using<T extends IDisposable>(
  resource: T,
  body: (resource: T) => Promise<void> | void
) {
  try {
    await body(resource)
  } finally {
    await resource.dispose()
  }
}

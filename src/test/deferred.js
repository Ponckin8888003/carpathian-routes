// Promise, яку тест завершує вручну: так можна побачити стан очікування,
// а потім передати успіх або відмову без довільних затримок.
export function deferred() {
  let resolve
  let reject
  const promise = new Promise((resolvePromise, rejectPromise) => {
    resolve = resolvePromise
    reject = rejectPromise
  })
  return { promise, resolve, reject }
}

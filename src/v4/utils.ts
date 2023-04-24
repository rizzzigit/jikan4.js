export async function sleep (time: number) { return await new Promise((resolve) => setTimeout(resolve, time)) }

export async function waitUntil (time: number) {
  const now = Date.now()

  if (time > now) {
    await sleep(time - now)
  }
}

export function translateObject<T> (obj: T, translator: <K extends keyof T = keyof T> (key: K, value: T[K]) => ([string, any] | undefined)) {
  const newObj: { [key: string]: any } = {}

  for (const objKey in obj) {
    const result = translator(objKey, obj[objKey])

    if (result) {
      newObj[result[0]] = result[1]
    }
  }

  return newObj
}

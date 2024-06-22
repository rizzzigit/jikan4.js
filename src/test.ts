/*
  eslint-disable @typescript-eslint/no-non-null-assertion
*/

import { Client } from './v4'

const client = new Client()
client.on('debug', (scope, message) => {
  console.log(`[${scope}] ${message}`)
})

const run = async (): Promise<any> => {
  const func: Record<string, () => Promise<any>> = {
    relations: async () => {
      const anime = (await client.anime.get(20))!

      console.log(await anime.getRelations())
    }
  }

  return await func[process.argv[2]]()
}

void run().then((data) => {
  if (data != null) {
    console.log(data)
  }
})

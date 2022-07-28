import { Client } from './Jikan'

const client = new Client()
client.on('debug', (scope, message) => console.log(`[${scope}] ${message}`))

const run = async () => {
  const func = {
    streaming1: async () => {
      const streaming = await client.anime.getStreamingLinks(1)

      return streaming
    },

    streaming2: async () => {
      const anime = await client.anime.get(1)

      return await anime?.getStreamingLinks()
    },

    streaming3: async () => {
      const fullAnime = await client.anime.getFull(1)

      return fullAnime
    }
  }

  const funcKey = <keyof typeof func> process.argv[2]

  return await func[funcKey]()
}

run().then(console.log)

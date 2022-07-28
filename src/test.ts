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
    },

    musicVideo1: async () => {
      const videos = await client.anime.getVideos(20)

      // const data = await (await fetch('https://api.jikan.moe/v4/anime/20/videos')).json()
      // const video = new AnimeVideo(client, data.data)

      // console.log(video.musicVideos)

      return videos
    }
  }

  const funcKey = <keyof typeof func> process.argv[2]

  return await func[funcKey]()
}

run().then((data) => data !== undefined ? console.log(data) : undefined)

import { Client } from './Jikan'

const client = new Client()
client.on('debug', (scope, message) => console.log(`[${scope}] ${message}`))

const run = async () => {
  const func = {
    streaming: async () => {
      const streamingLinks = await client.anime.getStreamingLinks(1)
      const anime = await (await client.anime.get(1))?.getStreamingLinks()
      const animeFull = await client.anime.getFull(1)

      return { streamingLinks, anime, animeFull }
    },

    musicVideo: async () => {
      const videos = await client.anime.getVideos(20)

      // const data = await (await fetch('https://api.jikan.moe/v4/anime/20/videos')).json()
      // const video = new AnimeVideo(client, data.data)

      // console.log(video.musicVideos)

      return videos
    },

    videosEpisodes: async () => {
      const anime = await (await client.anime.get(20))?.getVideosEpisodes(0, 0)
      const videosEpisodes = await client.anime.getVideosEpisodes(20, 0, 0)

      return { anime, videosEpisodes }
    },

    title: async () => {
      const anime = await client.anime.get(20)
      console.log(anime?.title)
    },

    external: async () => await client.users.getFull('lamaw'),

    producer: async () => {
      const list = await client.producers.list(0, 10)
      const producer = await client.producers.getFull(1)
      const external = await client.producers.getExternal(1)

      return { list, producer, external }
    },

    fullUserUpdate: async () => {
      const user = await client.users.getFull('fullbellydragon')

      return user?.updates
    },

    dataPath: async () => {
      const client = new Client({})

      console.log(await client.anime.get(5))
    }
  }

  const funcKey = <keyof typeof func> process.argv[2]

  return await func[funcKey]()
}

run().then((data) => data !== undefined ? console.log(data) : undefined)

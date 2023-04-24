import { type Anime, Client } from './v4'

const client = new Client()
client.on('debug', (scope, message) => { console.log(`[${scope}] ${message}`) })

const run = async (): Promise<any> => {
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

    producer: async () => {
      const list = await client.producers.list(0, 10)
      const producer = await client.producers.getFull(1)
      const external = await client.producers.getExternal(1)

      return { list, producer, external }
    },

    reviewUpdate: async () => {
      const anime = await client.anime.get(5)
      const manga = await client.manga.get(4)

      console.log(await anime?.getReviews())
      console.log(await manga?.getReviews())
    },

    dupeReqs: async () => {
      const promises: Array<Promise<Anime | undefined>> = []

      let returned = 0
      for (let count = 0; count < 100; count++) {
        promises.push(client.anime.get(5).then((a) => {
          returned++
          console.log(returned)

          return a
        }))
      }
    },

    searchExample: async () => {
      const result = (await client.anime.search('naruto')).map(({ title: { default: _d }, year }) => ({ default: _d, year }))

      console.table(result)
    }
  }

  const funcKey = process.argv[2] as keyof typeof func

  return await func[funcKey]()
}

void run().then((data) => { if (data != null) { console.log(data) } })

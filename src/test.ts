import { Anime, Character, Client, Manga } from './Jikan'

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

    reviewUpdate: async () => {
      const anime = await client.anime.get(5)
      // const manga = await client.manga.get(4)

      // console.log(await anime?.getReviews())
      // console.log(await manga?.getReviews())
      console.log(await anime?.getFull())
    },

    getAll: async () => {
      const animeIds: Map<number, null> = new Map()
      const mangaIds: Map<number, null> = new Map()
      const characterIds: Map<number, null> = new Map()

      const getCharacter = (character: Character) => {
        if (characterIds.has(character.id)) {
          return
        }

        characterIds.set(character.id, null)
        character.getAnime().then((anime) => anime.map((a) => a.anime.getFull().then(getAnime)))
        character.getManga().then((manga) => manga.map((m) => m.manga.getFull().then(getManga)))
      }

      const getAnime = (anime: Anime) => {
        if (animeIds.has(anime.id)) {
          return
        }

        animeIds.set(anime.id, null)
        anime.getCharacters().then((characters) => characters.map((a) => a.character.getFull().then(getCharacter)))
      }

      const getManga = (manga: Manga) => {
        if (mangaIds.has(manga.id)) {
          return
        }

        mangaIds.set(manga.id, null)
        manga.getCharacters().then((characters) => characters.map((a) => a.character.getFull().then(getCharacter)))
      }

      client.anime.list(0, 100).then((list) => list.forEach(getAnime))
      client.manga.list(0, 100).then((list) => list.forEach(getManga))
      client.characters.list(0, 100).then((list) => list.forEach(getCharacter))
    }
  }

  const funcKey = <keyof typeof func> process.argv[2]

  return await func[funcKey]()
}

run().then((data) => data !== undefined ? console.log(data) : undefined)

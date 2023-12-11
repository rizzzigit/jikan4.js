/*
  eslint-disable @typescript-eslint/no-non-null-assertion
*/

import { Client, type ImageFormatCollection, type ContentMeta, type ContentMetaType, type Meta, type MetaType } from './v4'

const client = new Client()
client.on('debug', (scope, message) => { console.log(`[${scope}] ${message}`) })

const run = async (): Promise<any> => {
  const f: ['webp', 'jpg'] = ['webp', 'jpg']
  const s: ['maximum', 'large', 'medium', 'default', 'small'] = ['maximum', 'large', 'medium', 'default', 'small']

  const func: Record<string, () => Promise<any>> = {
    userFull: async () => {
      console.log(await client.users.getFull('starfishx'))
      console.log(await client.users.getExternal('starfishx'))
    },

    pictures: async () => {
      return {
        character: (await client.characters.getPictures(11))?.map((e) => e.getOrFallback(f, s)),
        anime: (await client.anime.getPictures(5))?.map((e) => e.getOrFallback(f, s)),
        manga: (await client.manga.getPictures(4))?.map((e) => e.getOrFallback(f, s)),
        person: (await client.people.get(1))?.image?.getOrFallback(f, s)
      }
    },

    anime: async () => (await client.anime.get(5))?.image,
    manga: async () => (await client.manga.get(4))?.image,
    character: async () => (await client.characters.get(5))?.image,
    person: async () => (await client.people.get(5))?.image,
    club: async () => (await client.clubs.get(5))?.image,
    producer: async () => (await client.producers.get(5))?.image,
    user: async () => (await client.users.get('starfishx'))?.image,

    metaImages: async () => {
      let nulls = 0
      const getUrl = (meta: (Meta<MetaType> | ContentMeta<ContentMetaType>) & { image: ImageFormatCollection | null }): string => {
        return meta.image?.getOrFallback(f, s)?.toString() ?? `null ${++nulls}`
      }

      for (const anime of await client.anime.list(0, 50)) {
        console.log('ANIME')

        for (const character of await anime.getCharacters()) {
          console.log(`character ${character.character.name}: ${getUrl(character.character)}`)

          for (const person of character.voiceActors) {
            console.log(` voiceActor ${person.person.name}: ${getUrl(person.person)}`)
          }
        }

        for (const person of await anime.getStaff()) {
          console.log(`person ${person.person.name}: ${getUrl(person.person)}`)
        }

        // for (const producer of [...anime.producers, ...anime.licensors, ...anime.studios]) {
        //   console.log(`producer ${producer.name}: ${getUrl(producer)}`)
        // }
      }

      for (const manga of await client.manga.list(0, 50)) {
        console.log('MANGA')

        for (const character of await manga.getCharacters()) {
          console.log(`character ${character.character.name}: ${getUrl(character.character)}`)
        }
      }

      for (const person of await client.people.list(0, 50)) {
        console.log('PERSON')

        for (const anime of await person.getAnime()) {
          console.log(`anime ${anime.anime.title}: ${getUrl(anime.anime)}`)
        }

        for (const voice of await person.getVoiceActors()) {
          console.log(` anime ${voice.anime.title}: ${getUrl(voice.anime)}`)
          console.log(`   character ${voice.character.name}: ${getUrl(voice.character)}`)
        }

        for (const manga of await person.getManga()) {
          console.log(` manga ${manga.manga.title}: ${getUrl(manga.manga)}`)
        }
      }

      console.log(nulls)
      // Manga.authors[0].images is undefined
    },

    missingMethods: async () => {
      // const manga = await client.manga.get(4)
      // const club = await client.clubs.get(123)

      console.log(await client.reviews.getAnimeReviews())
    },

    nullableImageCollection: async () => {
      const log = (image?: ImageFormatCollection | null): void => {
        console.log(image)
      }

      void (async () => {
        for (const anime of await client.anime.list(0, 0)) {
          log(anime.image)
          for (const relation of await anime.getRelations()) {
            for (const picture of relation.items) {
              log(picture.image)
            }
          }
          for (const picture of await anime.getPictures()) {
            log(picture)
          }
        }
      })()

      void (async () => {
        for (const manga of await client.manga.list(0, 0)) {
          log(manga.image)
          for (const picture of await manga.getPictures()) {
            log(picture)
          }
          for (const relation of await manga.getRelations()) {
            for (const picture of relation.items) {
              log(picture.image)
            }
          }
        }
      })()

      void (async () => {
        for (const character of await client.characters.list(0, 0)) {
          log(character.image)
          for (const picture of await character.getPictures()) {
            log(picture)
          }

          for (const anime of await character.getAnime()) {
            log(anime.anime.image)
          }

          for (const anime of await character.getManga()) {
            log(anime.manga.image)
          }
        }
      })

      void (async () => {
        for (const person of await client.people.list(0, 0)) {
          log(person.image)
          for (const picture of await person.getPictures()) {
            log(picture)
          }

          for (const anime of await person.getAnime()) {
            log(anime.anime.image)
          }
        }
      })()

      // return [
      //   await (await client.anime.get(5))!.getPictures(),
      //   await (await client.anime.get(5))!.getRelations(),
      //   await (await client.characters.get(1))!.getPictures(),
      //   await (await client.manga.get(4))!.getPictures(),
      //   await (await client.people.get(1))!.getPictures(),
      //   [(await client.clubs.get(100))!.image],
      //   [(await client.users.get('starfishx'))!.image]
      // ]
    }
  }

  return await func[process.argv[2]]()
}

void run().then((data) => { if (data != null) { console.log(data) } })

import { Client } from './v4'

const client = new Client()
client.on('debug', (scope, message) => { console.log(`[${scope}] ${message}`) })

const run = async (): Promise<any> => {
  const f: ['webp', 'jpg'] = ['webp', 'jpg']
  const s: ['maximum', 'large', 'medium', 'default', 'small'] = ['maximum', 'large', 'medium', 'default', 'small']

  const func: Record<string, () => Promise<any>> = {
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
    user: async () => (await client.users.get('starfishx'))?.image
  }

  return await func[process.argv[2]]()
}

void run().then((data) => { if (data != null) { console.log(data) } })

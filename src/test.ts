/*
  eslint-disable @typescript-eslint/no-non-null-assertion
*/

import { Client } from './v4'

const client = new Client()
client.on('debug', (scope, message) => { console.log(`[${scope}] ${message}`) })

const run = async (): Promise<any> => {
  const func: Record<string, () => Promise<any>> = {
    allAnimeEpisodes: async () => {
      const stats: Record<string, {
        'null': number
        'zero': number
        'one': number
        '2-10': number
        '11-100': number
        '101-200': number
        'more': number
      }> = {}

      // const stats: Record<string, { count: number, most: number }> = {}

      for (const { type, episodes } of await client.anime.list(0, 0)) {
        const current = stats[type] ??= {
          null: 0,
          zero: 0,
          one: 0,
          '2-10': 0,
          '11-100': 0,
          '101-200': 0,
          more: 0
        }

        if (episodes == null) {
          current.null++
        } else if (episodes === 0) {
          current.zero++
        } else if (episodes === 1) {
          current.one++
        } else if ((episodes >= 2) && (episodes <= 10)) {
          current['2-10']++
        } else if ((episodes >= 11) && (episodes <= 100)) {
          current['11-100']++
        } else if ((episodes >= 101) && (episodes <= 200)) {
          current['101-200']++
        } else if ((episodes > 200)) {
          current.more++
        }

        // if (anime.episodes == null) {
        //   continue
        // }

        // const current = stats[anime.type] ??= {
        //   count: 0,
        //   most: anime.episodes
        // }

        // current.most = Math.max(current.most, anime.episodes)
      }

      console.log('Anime types with at least one episodes.')
      console.table(stats)
    },

    animeBroadcast: async () => {
      for (const anime of await client.anime.list(0, 0)) {
        console.log(`${anime.title.default}: ${JSON.stringify(anime.broadcast)}`)
      }
    }
  }

  return await func[process.argv[2]]()
}

void run().then((data) => { if (data != null) { console.log(data) } })

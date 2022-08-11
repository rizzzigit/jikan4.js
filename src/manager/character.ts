import { BaseManager } from '../manager/base'
import { Character, CharacterAnimeReference, CharacterFull, CharacterMangaReference, CharacterVoiceActorReference } from '../resource/character'
import { Image } from '../resource/misc'
import { translateObject } from '../utils'

export interface CharacterSearchFilter {
  orderBy: 'mal_id' | 'name' | 'favorites'
  sort: 'desc' | 'asc'
}

export class CharacterManager extends BaseManager {
  /** @hidden */
  public storeCache (body: any) {
    return super.storeCache({ path: `characters/${body.mal_id}` }, body)
  }

  public async search (searchString: string, filter?: Partial<CharacterSearchFilter>, offset?: number, maxCount?: number) {
    const rawData = <Array<any>> await this.requestPaginated('characters', offset, maxCount, {
      disableCaching: 'true',
      [searchString.length === 1 ? 'letter' : 'q']: searchString,
      ...filter && translateObject(filter, (key, value) => {
        switch (key) {
          case 'orderBy': return ['order_by', value]
          default: return [key, `${value}`]
        }
      })
    })

    return rawData.map((character) => new Character(this.client, this.storeCache(character)))
  }

  public async list (offset?: number, maxCount?: number): Promise<Array<Character>> {
    const rawData = <Array<any>> await this.requestPaginated('characters', offset, maxCount)

    return rawData.map((character: any) => new Character(this.client, this.storeCache(character)))
  }

  public async listTop (offset?: number, maxCount?: number) {
    const rawData = <Array<any>> await this.requestPaginated('top/characters', offset, maxCount)

    return rawData.map((character: any) => new Character(this.client, this.storeCache(character)))
  }

  public async random (): Promise<Character> {
    const rawData = await this.request('random/characters', { disableCaching: 'true' })

    return new Character(this.client, this.storeCache(rawData))
  }

  public async get (characterId: number): Promise<Character | undefined> {
    const rawData = await this.request(`characters/${characterId}`)

    return rawData ? new Character(this.client, rawData) : undefined
  }

  public async getFull (characterId: number): Promise<CharacterFull | undefined> {
    const rawData = await this.request(`characters/${characterId}/full`)

    return rawData ? new CharacterFull(this.client, rawData) : undefined
  }

  public async getAnime (characterId: number): Promise<Array<CharacterAnimeReference> | undefined> {
    const rawData = await this.request(`characters/${characterId}/anime`)

    return rawData ? rawData.map((animeReference: any) => new CharacterAnimeReference(this.client, animeReference)) : undefined
  }

  public async getManga (characterId: number): Promise<Array<CharacterMangaReference> | undefined> {
    const rawData = await this.request(`characters/${characterId}/manga`)

    return rawData ? rawData.map((mangaReference: any) => new CharacterMangaReference(this.client, mangaReference)) : undefined
  }

  public async getVoiceActors (characterId: number): Promise<Array<CharacterVoiceActorReference> | undefined> {
    const rawData = await this.request(`characters/${characterId}/voices`)

    return rawData ? rawData.map((voiceActorReference: any) => new CharacterVoiceActorReference(this.client, voiceActorReference)) : undefined
  }

  public async getPictures (characterId: number): Promise<Array<Image> | undefined> {
    const rawData = await this.request(`characters/${characterId}/pictures`)

    return rawData ? rawData.map((picture: any) => new Image(this.client, picture)) : undefined
  }
}

import { BaseManager } from '../manager/base'
import { Character, CharacterAnimeReference, CharacterMangaReference, CharacterVoiceActorReference } from '../resource/character'
import { Image } from '../resource/misc'
import { translateObject } from '../utils'

export interface CharacterSearchFilter {
  orderBy: 'mal_id' | 'name' | 'favorites'
  sort: 'desc' | 'asc'
}

export class CharacterManager extends BaseManager {
  // eslint-disable-next-line tsdoc/syntax
  /** @hidden */
  public storeCache (data: any) {
    return super.storeCache(`characters/${data.mal_id}`, data)
  }

  public async search (searchString: string, filter?: Partial<CharacterSearchFilter>, offset?: number, maxCount?: number) {
    const rawData = <Array<any>> await this.requestPaginatedResource('characters', offset, maxCount, {
      disableCaching: true,
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
    const rawData = <Array<any>> await this.requestPaginatedResource('characters', offset, maxCount)

    return rawData.map((character: any) => new Character(this.client, this.storeCache(character)))
  }

  public async listTop (offset?: number, maxCount?: number) {
    const rawData = <Array<any>> await this.requestPaginatedResource('top/characters', offset, maxCount)

    return rawData.map((character: any) => new Character(this.client, this.storeCache(character)))
  }

  public async random (): Promise<Character> {
    const rawData = await this.requestResource('random/characters', { disableCaching: 'true' })

    this.storeCache(rawData)
    return new Character(this.client, rawData)
  }

  public async get (characterId: number): Promise<Character | undefined> {
    const rawData = await this.requestResource(`characters/${characterId}`)

    return rawData ? new Character(this.client, rawData) : undefined
  }

  public async getAnime (characterId: number): Promise<Array<CharacterAnimeReference> | undefined> {
    const rawData = await this.requestResource(`characters/${characterId}/anime`)

    return rawData ? rawData.map((animeReference: any) => new CharacterAnimeReference(this.client, characterId, animeReference)) : undefined
  }

  public async getManga (characterId: number): Promise<Array<CharacterMangaReference> | undefined> {
    const rawData = await this.requestResource(`characters/${characterId}/manga`)

    return rawData ? rawData.map((mangaReference: any) => new CharacterMangaReference(this.client, characterId, mangaReference)) : undefined
  }

  public async getVoiceActors (characterId: number): Promise<Array<CharacterVoiceActorReference> | undefined> {
    const rawData = await this.requestResource(`characters/${characterId}/voices`)

    return rawData ? rawData.map((voiceActorReference: any) => new CharacterVoiceActorReference(this.client, characterId, voiceActorReference)) : undefined
  }

  public async getPictures (characterId: number): Promise<Array<Image> | undefined> {
    const rawData = await this.requestResource(`characters/${characterId}/pictures`)

    return rawData ? rawData.map((picture: any) => new Image(this.client, picture)) : undefined
  }
}

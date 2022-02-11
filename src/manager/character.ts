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
    return super.storeCache(`characters/${data.raw_id}`, data)
  }

  public async search (searchString: string, filter?: Partial<CharacterSearchFilter>, offset?: number, maxCount?: number) {
    const rawData = <Array<any>> await this.requestPaginatedResource('characters', offset, maxCount, {
      [searchString.length === 1 ? 'letter' : 'q']: searchString,
      ...filter && translateObject(filter, (key, value) => {
        switch (key) {
          case 'orderBy': return ['order_by', value]
          default: return [key, `${value}`]
        }
      })
    })

    return rawData.map((data) => this.storeCache(data)).map((character) => new Character(this.client, character))
  }

  public async list (offset?: number, maxCount?: number): Promise<Array<Character>> {
    const rawData = <Array<any>> await this.requestPaginatedResource('characters', offset, maxCount)

    return rawData.map((data: any) => this.storeCache(data)).map((character: any) => new Character(this.client, character))
  }

  public async listTop (offset?: number, maxCount?: number) {
    const rawData = <Array<any>> await this.requestPaginatedResource('top/characters', offset, maxCount)

    return rawData.map((data: any) => this.storeCache(data)).map((character: any) => new Character(this.client, character))
  }

  public async random (): Promise<Character> {
    const rawData = await this.requestResource('random/characters', { disableCaching: 'true' })

    this.storeCache(rawData)
    return new Character(this.client, rawData)
  }

  public async get (characterID: number): Promise<Character | undefined> {
    const rawData = await this.requestResource(`characters/${characterID}`)

    return rawData ? new Character(this.client, rawData) : undefined
  }

  public async getAnime (characterID: number): Promise<Array<CharacterAnimeReference> | undefined> {
    const rawData = await this.requestResource(`characters/${characterID}/anime`)

    return rawData ? rawData.map((animeReference: any) => new CharacterAnimeReference(this.client, characterID, animeReference)) : undefined
  }

  public async getManga (characterID: number): Promise<Array<CharacterMangaReference> | undefined> {
    const rawData = await this.requestResource(`characters/${characterID}/manga`)

    return rawData ? rawData.map((mangaReference: any) => new CharacterMangaReference(this.client, characterID, mangaReference)) : undefined
  }

  public async getVoiceActors (characterID: number): Promise<Array<CharacterVoiceActorReference> | undefined> {
    const rawData = await this.requestResource(`characters/${characterID}/voices`)

    return rawData ? rawData.map((voiceActorReference: any) => new CharacterVoiceActorReference(this.client, characterID, voiceActorReference)) : undefined
  }

  public async getPictures (characterID: number): Promise<Array<Image> | undefined> {
    const rawData = await this.requestResource(`characters/${characterID}/pictures`)

    return rawData ? rawData.map((picture: any) => new Image(this.client, picture)) : undefined
  }
}

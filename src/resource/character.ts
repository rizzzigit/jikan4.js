import { Client } from '../core/client'
import { BaseResource } from './base'
import { ContentImage } from './content/base'
import { MangaMeta, PersonMeta, AnimeMeta } from './meta'
import { Image } from './misc'

export class Character extends BaseResource {
  /** @hidden */
  public static parseAnimeReference (client: Client, data: any): CharacterAnimeReference {
    return {
      role: data.role,
      anime: new AnimeMeta(client, data.anime)
    }
  }

  /** @hidden */
  public static parseMangaReference (client: Client, data: any): CharacterMangaReference {
    return {
      role: data.role,
      manga: new MangaMeta(client, data.manga)
    }
  }

  /** @hidden */
  public static parseVoiceActorReference (client: Client, data: any): CharacterVoiceActorReference {
    return {
      language: data.language,
      person: new PersonMeta(client, data.person)
    }
  }

  public readonly image: ContentImage
  public readonly name: string
  public readonly nameKanji: string | null
  public readonly nicknames: Array<string>
  public readonly favorites: number
  public readonly about: string | null

  public getAnime () {
    return <Promise<Array<CharacterAnimeReference>>> this.client.characters.getAnime(this.id)
  }

  public getManga () {
    return <Promise<Array<CharacterMangaReference>>> this.client.characters.getManga(this.id)
  }

  public getVoiceActors () {
    return <Promise<Array<CharacterVoiceActorReference>>> this.client.characters.getVoiceActors(this.id)
  }

  public getPictures () {
    return <Promise<Array<Image>>> this.client.characters.getPictures(this.id)
  }

  public getFull () {
    return <Promise<CharacterFull>> this.client.characters.getFull(this.id)
  }

  public constructor (client: Client, data: any) {
    super(client, data)

    this.image = new ContentImage(client, data.images)
    this.name = data.name
    this.nameKanji = data.name_kanji || null
    this.nicknames = data.nicknames?.map((nickname: any) => nickname || null).filter((nickname: any) => !!nickname) || []
    this.favorites = data.favorites
    this.about = data.about || null
  }
}

export interface CharacterAnimeReference {
  readonly role: string
  readonly anime: AnimeMeta
}

export interface CharacterMangaReference {
  readonly role: string
  readonly manga: MangaMeta
}

export interface CharacterVoiceActorReference {
  readonly language: string
  readonly person: PersonMeta
}

export class CharacterFull extends Character {
  public readonly anime: Array<CharacterAnimeReference>
  public readonly manga: Array<CharacterMangaReference>
  public readonly voices: Array<CharacterVoiceActorReference>

  public constructor (client: Client, data: any) {
    super(client, data)

    this.anime = data.anime?.map((anime: any) => Character.parseAnimeReference(client, anime))
    this.manga = data.manga?.map((manga: any) => Character.parseMangaReference(client, manga))
    this.voices = data.voices?.map((voice: any) => Character.parseVoiceActorReference(client, voice))
  }
}

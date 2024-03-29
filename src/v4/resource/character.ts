import { Client } from '../core/client'
import { BaseClass, BaseResource } from './base'
import { MangaMeta, PersonMeta, AnimeMeta } from './meta'
import { ImageFormatCollection } from './misc'

export class Character extends BaseResource {
  public readonly image: ImageFormatCollection
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
    return <Promise<Array<ImageFormatCollection>>> this.client.characters.getPictures(this.id)
  }

  public getFull () {
    return <Promise<CharacterFull>> this.client.characters.getFull(this.id)
  }

  public constructor (client: Client, data: any) {
    super(client, data)

    this.image = new ImageFormatCollection(client, data.images)
    this.name = data.name
    this.nameKanji = data.name_kanji || null
    this.nicknames = data.nicknames?.map((nickname: any) => nickname || null).filter((nickname: any) => !!nickname) || []
    this.favorites = data.favorites
    this.about = data.about || null
  }
}

export class CharacterAnimeReference extends BaseClass {
  public readonly role: string
  public readonly anime: AnimeMeta

  public constructor (client: Client, data: any) {
    super(client)

    this.role = data.role
    this.anime = new AnimeMeta(client, data.anime)
  }
}

export class CharacterMangaReference extends BaseClass {
  public readonly role: string
  public readonly manga: MangaMeta

  public constructor (client: Client, data: any) {
    super(client)

    this.role = data.role
    this.manga = new MangaMeta(client, data.manga)
  }
}

export class CharacterVoiceActorReference extends BaseClass {
  public readonly language: string
  public readonly person: PersonMeta

  public constructor (client: Client, data: any) {
    super(client)

    this.language = data.language
    this.person = new PersonMeta(client, data.person)
  }
}

export class CharacterFull extends Character {
  public readonly anime: Array<CharacterAnimeReference>
  public readonly manga: Array<CharacterMangaReference>
  public readonly voices: Array<CharacterVoiceActorReference>

  public constructor (client: Client, data: any) {
    super(client, data)

    this.anime = data.anime?.map((anime: any) => new CharacterAnimeReference(client, anime))
    this.manga = data.manga?.map((manga: any) => new CharacterMangaReference(client, manga))
    this.voices = data.voices?.map((voice: any) => new CharacterVoiceActorReference(client, voice))
  }
}

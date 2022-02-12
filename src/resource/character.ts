import { Client } from '../core/client'
import { BaseClass, BaseResource } from './base'
import { ContentImage } from './content/base'
import { MangaMeta, PersonMeta, AnimeMeta } from './meta'
import { Image } from './misc'

export class Character extends BaseResource {
  public readonly image: ContentImage
  public readonly name: string
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

  public constructor (client: Client, data: any) {
    super(client, data)

    this.image = new ContentImage(client, data.images)
    this.name = data.name
    this.nicknames = data.nicknames.map((nickname: any) => nickname || null).filter((nickname: any) => !!nickname)
    this.favorites = data.favorites
    this.about = data.about || null
  }
}

export class CharacterAnimeReference extends BaseClass {
  public readonly characterId: number
  public readonly role: string
  public readonly anime: AnimeMeta

  public getCharacter () {
    return <Promise<Character>> this.client.characters.get(this.characterId)
  }

  public constructor (client: Client, characterId: number, data: any) {
    super(client)

    this.characterId = characterId
    this.role = data.role
    this.anime = new AnimeMeta(client, data.anime)
  }
}

export class CharacterMangaReference extends BaseClass {
  public readonly characterId: number
  public readonly role: string
  public readonly manga: MangaMeta

  public getCharacter () {
    return <Promise<Character>> this.client.characters.get(this.characterId)
  }

  public constructor (client: Client, characterId: number, data: any) {
    super(client)

    this.characterId = characterId
    this.role = data.role
    this.manga = new MangaMeta(client, data)
  }
}

export class CharacterVoiceActorReference extends BaseClass {
  public readonly characterId: number
  public readonly language: string
  public readonly person: PersonMeta

  public getCharacter () {
    return <Promise<Character>> this.client.characters.get(this.characterId)
  }

  public constructor (client: Client, characterId: number, data: any) {
    super(client)

    this.characterId = characterId
    this.language = data.language
    this.person = new PersonMeta(client, data.person)
  }
}

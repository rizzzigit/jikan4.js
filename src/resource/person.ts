import { Client } from '../core/client'
import { BaseClass, BaseResource } from './base'
import { URL } from 'url'
import { AnimeMeta, CharacterMeta, MangaMeta } from './meta'
import { Image } from './misc'

export class PersonName extends BaseClass {
  public readonly name: string
  public readonly given: string | null
  public readonly family: string | null
  public readonly alternate: Array<string>

  public toString () {
    return this.name
  }

  public constructor (client: Client, data: any) {
    super(client)

    this.name = data.name
    this.given = data.given_name || null
    this.family = data.faimly_name || null
    this.alternate = data.alternate_names?.map((alternate: any) => alternate || null).filter((alternate: any) => !!alternate) || []
  }
}

export class Person extends BaseResource {
  public readonly websiteUrl: URL | null
  public readonly image: Image
  public readonly name: PersonName
  public readonly birth: Date | null
  public readonly favorites: number
  public readonly about: string | null

  public getAnime () {
    return <Promise<PersonAnimeReference[]>> this.client.people.getAnime(this.id)
  }

  public getVoiceActors () {
    return <Promise<PersonVoiceActorReference[]>> this.client.people.getVoiceActors(this.id)
  }

  public getManga () {
    return <Promise<PersonMangaReference[]>> this.client.people.getManga(this.id)
  }

  public getPictures () {
    return <Promise<Image[]>> this.client.people.getPictures(this.id)
  }

  public getFull () {
    return <Promise<PersonFull>> this.client.people.getFull(this.id)
  }

  public constructor (client: Client, data: any) {
    super(client, data)

    this.websiteUrl = Person.parseURL(data.website_url, true)
    this.image = new Image(client, data.images?.jpg)
    this.name = new PersonName(client, data)
    this.birth = Person.parseDate(data.birthday, true)
    this.favorites = data.favorites
    this.about = data.about || null
  }
}

export class PersonAnimeReference extends BaseClass {
  public readonly position: string
  public readonly anime: AnimeMeta

  public constructor (client: Client, data: any) {
    super(client)

    this.position = data.position
    this.anime = new AnimeMeta(client, data.anime)
  }
}

export class PersonVoiceActorReference extends BaseClass {
  public readonly role: string
  public readonly anime: AnimeMeta
  public readonly character: CharacterMeta

  public constructor (client: Client, data: any) {
    super(client)

    this.role = data.role
    this.anime = new AnimeMeta(client, data.anime)
    this.character = new CharacterMeta(client, data.character)
  }
}

export class PersonMangaReference extends BaseClass {
  public readonly position: string
  public readonly manga: MangaMeta

  public constructor (client: Client, data: any) {
    super(client)

    this.position = data.position
    this.manga = new MangaMeta(client, data.manga)
  }
}

export class PersonFull extends Person {
  public readonly anime: Array<PersonAnimeReference>
  public readonly manga: Array<PersonMangaReference>
  public readonly voices: Array<PersonVoiceActorReference>

  public constructor (client: Client, data: any) {
    super(client, data)

    this.anime = data.anime?.map((anime: any) => new PersonAnimeReference(client, anime)) || []
    this.manga = data.manga?.map((manga: any) => new PersonMangaReference(client, manga)) || []
    this.voices = data.voices?.map((voice: any) => new PersonVoiceActorReference(client, voice)) || []
  }
}

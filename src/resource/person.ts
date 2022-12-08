import { Client } from '../core/client'
import { BaseResource } from './base'
import { AnimeMeta, CharacterMeta, MangaMeta } from './meta'
import { Image } from './misc'

export interface PersonName {
  readonly name: string
  readonly given: string | null
  readonly family: string | null
  readonly alternate: Array<string>

  toString (): string
}

export class Person extends BaseResource {
  /** @hidden */
  public static parseName (data: any): PersonName {
    return {
      name: data.name,
      given: data.given_name ?? null,
      family: data.faimly_name ?? null,
      alternate: data.alternate_names?.map((alternate: any) => alternate ?? null).filter((alternate: any) => !!alternate) ?? [],

      toString: () => data.name
    }
  }

  /** @hidden */
  public static parseAnimeReference (client: Client, data: any): PersonAnimeReference {
    return {
      position: data.position,
      anime: new AnimeMeta(client, data.anime)
    }
  }

  /** @hidden */
  public static parseVoiceActorReference (client: Client, data: any): PersonVoiceActorReference {
    return {
      role: data.role,
      anime: new AnimeMeta(client, data.anime),
      character: new CharacterMeta(client, data.character)
    }
  }

  /** @hidden */
  public static parseMangaReference (client: Client, data: any): PersonMangaReference {
    return {
      position: data.position,
      manga: new MangaMeta(client, data.manga)
    }
  }

  public readonly websiteUrl: string | null
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
    this.image = Person.parseImage(data.images?.jpg)
    this.name = Person.parseName(data)
    this.birth = Person.parseDate(data.birthday, true)
    this.favorites = data.favorites
    this.about = data.about || null
  }
}

export interface PersonAnimeReference {
  readonly position: string
  readonly anime: AnimeMeta
}

export interface PersonVoiceActorReference {
  readonly role: string
  readonly anime: AnimeMeta
  readonly character: CharacterMeta
}

export interface PersonMangaReference {
  readonly position: string
  readonly manga: MangaMeta
}

export class PersonFull extends Person {
  public readonly anime: Array<PersonAnimeReference>
  public readonly manga: Array<PersonMangaReference>
  public readonly voices: Array<PersonVoiceActorReference>

  public constructor (client: Client, data: any) {
    super(client, data)

    this.anime = data.anime?.map((anime: any) => Person.parseAnimeReference(client, anime)) || []
    this.manga = data.manga?.map((manga: any) => Person.parseMangaReference(client, manga)) || []
    this.voices = data.voices?.map((voice: any) => Person.parseVoiceActorReference(client, voice)) || []
  }
}

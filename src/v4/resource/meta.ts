import { Client } from '../core/client'
import { BaseResource } from './base'
import { Character } from './character'
import { Anime } from './content/anime'
import { Manga } from './content/manga'
import { Person } from './person'
import { ImageFormatCollection } from './misc'

export type MetaType = 'Magazine' | 'Producer' | 'AnimeGenre' | 'MangaGenre' | 'Person' | 'Character' | 'Club'

export type ContentMetaType = 'Anime' | 'Manga'

export class Meta<T extends MetaType> extends BaseResource {
  public readonly type: T
  public readonly name: string

  public constructor (client: Client, data: any, type: T) {
    super(client, data)

    this.type = type
    this.name = data.name
  }
}

export class ContentMeta<T extends ContentMetaType> extends BaseResource {
  public readonly type: T
  public readonly title: string
  public readonly image: ImageFormatCollection

  public constructor (client: Client, data: any, type: T) {
    super(client, data)

    this.type = type
    this.title = data.name || data.title
    this.image = new ImageFormatCollection(client, data.images)
  }
}

export class MagazineMeta extends Meta<'Magazine'> {
  public constructor (client: Client, data: any) {
    super(client, data, 'Magazine')
  }
}

export class ProducerMeta extends Meta<'Producer'> {
  public constructor (client: Client, data: any) {
    super(client, data, 'Producer')
  }
}

export class ClubMeta extends Meta<'Club'> {
  public constructor (client: Client, data: any) {
    super(client, data, 'Club')
  }
}

export type GenreType = 'Genre' | 'Explicit' | 'Theme' | 'Demographic'

export class AnimeGenreMeta<T extends GenreType> extends Meta<'AnimeGenre'> {
  public constructor (client: Client, data: any, type: T) {
    super(client, data, 'AnimeGenre')

    this.genreType = type
  }

  public readonly genreType: T
}

export class MangaGenreMeta<T extends GenreType> extends Meta<'MangaGenre'> {
  public constructor (client: Client, data: any, type: T) {
    super(client, data, 'MangaGenre')

    this.genreType = type
  }

  public readonly genreType: T
}

export class PersonMeta extends Meta<'Person'> {
  public getFull () {
    return <Promise<Person>> this.client.people.get(this.id)
  }

  public constructor (client: Client, data: any) {
    super(client, data, 'Person')
  }
}

export class CharacterMeta extends Meta<'Character'> {
  public getFull () {
    return <Promise<Character>> this.client.characters.get(this.id)
  }

  public constructor (client: Client, data: any) {
    super(client, data, 'Character')
  }
}

export class AnimeMeta extends ContentMeta<'Anime'> {
  public getFull () {
    return <Promise<Anime>> this.client.anime.get(this.id)
  }

  public constructor (client: Client, data: any) {
    super(client, data, 'Anime')
  }
}

export class MangaMeta extends ContentMeta<'Manga'> {
  public getFull () {
    return <Promise<Manga>> this.client.manga.get(this.id)
  }

  public constructor (client: Client, data: any) {
    super(client, data, 'Manga')
  }
}

import { join } from 'path'
import EventEmitter, { EventInterface } from '@rizzzi/eventemitter'

import { APIClient } from './api'
import { HeartBeatMonitor } from './heartbeat'
import { AnimeManager } from '../manager/anime'
import { MangaManager } from '../manager/manga'
import { ClubManager } from '../manager/club'
import { PersonManager } from '../manager/person'
import { CharacterManager } from '../manager/character'
import { GenreManager } from '../manager/genre'
import { MagazineManager } from '../manager/magazine'
import { ProducerManager } from '../manager/producer'
import { SeasonManager } from '../manager/season'
import { TopManager } from '../manager/top'
import { ScheduleManager } from '../manager/schedule'
import { UserManager } from '../manager/user'

export interface ClientOptions {
  /**
   * The hostname of the server.
   *
   * This option could be useful if you are hosting your own instance
   * of Jikan REST API.
   *
   * Default value: `api.jikan.moe`
  */
  host: string

  /**
   * The base pathname of each request.
   *
   * Default value: `v4`
  */
  baseUri: string

  /**
   * Whether to use HTTPS protocol instead of HTTP.
   *
   * Default value: `false`
  */
  secure: boolean

  /**
   * The number of miliseconds to wait before creating another request.
   * This is to avoid getting rate-limited by
   *
   * Default value: `1200` (50 requests per minute)
  */
  dataRateLimit: number

  /**
   * The number of miliseconds before the cache is expired. This is an
   * effort to avoid sending multiple requests for the same content to
   *
   * Default value: `86400000` (1 day)
   */
  dataExpiry: number

  /**
   * The number of items to be returned on each paginated request.
   *
   * Default value: `25`
  */
  dataPaginationMaxSize: number

  /**
   * The number of miliseconds before giving up on a request.
   *
   * Default value: `15000` (15 seconds)
  */
  requestTimeout: number

  /**
   * The maximum limit of requests in the queue. This is an effort to
   * prevent clogging the queue.
   *
   * Default value: `100`
  */
  requestQueueLimit: number

  /**
   * Whether to disable cache or not. It's recommended that this option is disabled
   * to avoid sending multiple requests for the same content.
  */
  disableCaching: boolean

  /**
   * The number of retries on HTTP 500 errors.
  */
  maxApiErrorRetry: number

  /**
   * Whether to retry on HTTP 500 errors.
  */
  retryOnApiError: boolean

  /**
   * Keep sockets around in a pool to be used by other requests in the future.

   * Default value: `true`
  */
  keepAlive: boolean

  /**
   * When using HTTP KeepAlive, how often to send TCP KeepAlive packets over sockets
   * being kept alive. Only relevant if keepAlive is set to true.
   *
   * Default value: `60000`
  */
  keepAliveMsecs: number

  /**
   * Where to store cache from Jikan API
  */
  dataPath?: string
}

export interface ClientEvents extends EventInterface {
  debug: [scope: string, message: string]
}

export type ClientEventNames = keyof ClientEvents

export class Client {
  /** @hidden */
  private static setOptions (options?: Partial<ClientOptions>): ClientOptions {
    const defaultOptions: ClientOptions = {
      dataPath: (() => { try { return join(__dirname, '..', '..', '.Jikan') } catch {} })(),

      host: 'api.jikan.moe',
      baseUri: 'v4',

      secure: true,

      dataRateLimit: 1200, // 50 API requests a minute
      dataExpiry: 1000 * 60 * 60 * 24, // 1 day expiration
      dataPaginationMaxSize: 25,

      requestTimeout: 15000,
      requestQueueLimit: 100,

      maxApiErrorRetry: 5,
      retryOnApiError: true,

      keepAlive: true,
      keepAliveMsecs: 60000,

      disableCaching: false
    }

    return Object.assign(defaultOptions, options)
  }

  /**
   * Current options of the client.
   *
   * You can change client options anytime.
  */
  public readonly options: ClientOptions

  /** @hidden */
  public readonly APIClient: APIClient

  /**
   * Anime resource context.
   *
   * @example
   * ```ts
   * const anime = await client.anime.get(5)
   * const episodes = await anime.getEpisodes()
   *
   * console.log(anime, episodes)
   * ```
  */
  public readonly anime: AnimeManager

  /**
   * Manga resource context.
   *
   * @example
   * ```ts
   * const manga = await client.manga.get(4)
   * const characters = await manga.getCharacters()
   *
   * console.log(manga, characters)
   * ```
  */
  public readonly manga: MangaManager

  /**
   * Clubs resource context.
   *
   * @example
   * ```ts
   * const club = await client.clubs.get(<id>)
   *
   * console.log(club.mmeberCount)
   * ```
  */
  public readonly clubs: ClubManager

  /**
   * People resource context.
   *
   * @example
   * ```ts
   * const person = await client.people.get(<id>)
   * const pictures = await person.getPictures()
   *
   * console.log(`${person.name}`, pictures)
   * ```
  */
  public readonly people: PersonManager

  /**
   * Characters resource context.
   *
   * @example
   * ```ts
   * const character = await client.characters.get(1)
   * const voiceActors = await character.getVoiceActors()
   *
   * console.log(character, voiceActors)
   * ```
  */
  public readonly characters: CharacterManager

  /**
   * Genres resource context.
   *
   * @example
   * ```ts
   * const genres = await client.genres.list()
   *
   * console.log(genres)
   * ```
  */
  public readonly genres: GenreManager

  /**
   * Magazines resource context.
   *
   * @example
   * ```ts
   * const magazines = await client.magazines.list()
   *
   * console.log(magazines)
   * ```
  */
  public readonly magazines: MagazineManager

  /**
   * Producers resource context.
   *
   * @example
   * ```ts
   * const producers = await client.producers.list()
   *
   * console.log(producers)
   * ```
  */
  public readonly producers: ProducerManager

  public readonly users: UserManager

  /**
   * Seasons resource context.
   *
   * @example
   * ```ts
   * const seasons = await client.seasons.list()
   *
   * console.log(seasons)
   * ```
  */
  public readonly seasons: SeasonManager

  public readonly top: TopManager

  public readonly schedules: ScheduleManager

  /**
   * Check if MAL is down.
   *
   * @example
   * ```ts
   * const heartbeat = await client.heartbeat.check()
   *
   * if (heartbeat.down)
   *   console.warn('MAL is down!')
   * ```
  */
  public readonly heartbeat: HeartBeatMonitor

  /** @hidden */
  public readonly events: EventEmitter<ClientEvents>

  /**
   * Listen to client events.
   *
   * @example
   * ```ts
   * client.on('debug', console.log)
   * ```
  */
  public on: EventEmitter<ClientEvents>['on']

  /**
   * Listen to client events once.
   *
   * @example
   * ```ts
   * client.once('debug', console.log)
   * ```
  */
  public once: EventEmitter<ClientEvents>['on']

  /**
   * Remove a listener.
   *
   * @example
   * ```ts
   * client.off('debug', console.log)
   * ```
  */
  public off: EventEmitter<ClientEvents>['off']

  /** @hidden */
  public readonly emit: EventEmitter<ClientEvents>['emit']

  /** @hidden */
  public debug (scope: string, message: string) {
    return this.emit('debug', scope, message)
  }

  /**
   * Instantiate new Jikan client
   *
   * @param options - Client options
   * @example
   * ```ts
   *  const Jikan = require('jikan4.js')
   *  const client = new Client()
   *
   *  console.log(await client.anime.get(5))
   * ```
  */
  public constructor (options?: Partial<ClientOptions>) {
    this.options = Client.setOptions(options)
    this.APIClient = new APIClient(this)

    this.anime = new AnimeManager(this)
    this.manga = new MangaManager(this)
    this.clubs = new ClubManager(this)
    this.people = new PersonManager(this)
    this.characters = new CharacterManager(this)
    this.genres = new GenreManager(this)
    this.magazines = new MagazineManager(this)
    this.producers = new ProducerManager(this)
    this.users = new UserManager(this)
    this.seasons = new SeasonManager(this)
    this.top = new TopManager(this)
    this.schedules = new ScheduleManager(this)

    this.heartbeat = new HeartBeatMonitor(this)

    this.events = new EventEmitter()
    const { on, once, emit, off } = this.events.bind()
    this.on = on
    this.once = once
    this.emit = emit
    this.off = off
  }
}

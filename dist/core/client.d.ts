/// <reference types="node" />
import { APIClient } from './api';
import { HeartBeatMonitor } from './heartbeat';
import { AnimeManager } from '../manager/anime';
import { MangaManager } from '../manager/manga';
import { ClubManager } from '../manager/club';
import { PersonManager } from '../manager/person';
import { CharacterManager } from '../manager/character';
import { GenreManager } from '../manager/genre';
import { MagazineManager } from '../manager/magazine';
import { ProducerManager } from '../manager/producer';
import { SeasonManager } from '../manager/season';
import { TopManager } from '../manager/top';
import { EventEmitter } from 'events';
import { ScheduleManager } from '../manager/schedule';
import { UserManager } from '../manager/user';
export interface ClientOptions {
    /**
     * The hostname of the server.
     *
     * This option could be useful if you are hosting your own instance
     * of Jikan REST API.
     *
     * Default value: `api.jikan.moe`
    */
    host: string;
    /**
     * The base pathname of each request.
     *
     * Default value: `v4`
    */
    baseUri: string;
    /**
     * Whether to use HTTPS protocol instead of HTTP.
     *
     * Default value: `false`
    */
    secure: boolean;
    /**
     * The number of miliseconds to wait before creating another request.
     * This is to avoid getting rate-limited by
     *
     * Default value: `1200` (50 requests per minute)
    */
    dataRateLimit: number;
    /**
     * The number of miliseconds before the cache is expired. This is an
     * effort to avoid sending multiple requests for the same content to
     *
     * Default value: `86400000` (1 day)
     */
    dataExpiry: number;
    /**
     * The number of items to be returned on each paginated request.
     *
     * Default value: `25`
    */
    dataPaginationMaxSize: number;
    /**
     * The number of miliseconds before giving up on a request.
     *
     * Default value: `15000` (15 seconds)
    */
    requestTimeout: number;
    /**
     * The maximum limit of requests in the queue. This is an effort to
     * prevent clogging the queue.
     *
     * Default value: `100`
    */
    requestQueueLimit: number;
    /**
     * Whether to disable cache or not. It's recommended that this option is disabled
     * to avoid sending multiple requests for the same content to
    */
    disableCaching: boolean;
    /**
     * The number of retries on HTTP 500 errors.
    */
    maxApiErrorRetry: number;
    /**
     * Keep sockets around in a pool to be used by other requests in the future.
  
    * Default value: `true`
    */
    keepAlive: boolean;
    /**
     * When using HTTP KeepAlive, how often to send TCP KeepAlive packets over sockets
     * being kept alive. Only relevant if keepAlive is set to true.
     *
     * Default value: `60000`
    */
    keepAliveMsecs: number;
    dataPath: string;
}
export interface ClientEvents {
    debug: [scope: string, message: string];
}
export declare type ClientEventNames = keyof ClientEvents;
export declare class Client {
    /** @hidden */
    private static setGlobalClient;
    /** @hidden */
    private static setOptions;
    /** @hidden */
    static getClient(): Client;
    /**
     * Current options of the client.
     *
     * You can change client options anytime.
    */
    readonly options: ClientOptions;
    /** @hidden */
    readonly APIClient: APIClient;
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
    readonly anime: AnimeManager;
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
    readonly manga: MangaManager;
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
    readonly clubs: ClubManager;
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
    readonly people: PersonManager;
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
    readonly characters: CharacterManager;
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
    readonly genres: GenreManager;
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
    readonly magazines: MagazineManager;
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
    readonly producers: ProducerManager;
    readonly users: UserManager;
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
    readonly seasons: SeasonManager;
    readonly top: TopManager;
    readonly schedules: ScheduleManager;
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
    readonly heartbeat: HeartBeatMonitor;
    /** @hidden */
    readonly events: EventEmitter;
    /**
     * Listen to client events.
     *
     * @example
     * ```ts
     * client.on('debug', console.log)
     * ```
    */
    on<T extends ClientEventNames>(event: T, listener: (...args: ClientEvents[T]) => void): Client;
    /**
     * Listen to client events once.
     *
     * @example
     * ```ts
     * client.once('debug', console.log)
     * ```
    */
    once<T extends ClientEventNames>(event: T, listener: (...args: ClientEvents[T]) => void): Client;
    /** @hidden */
    emit<T extends ClientEventNames>(event: T, ...args: ClientEvents[T]): boolean;
    /** @hidden */
    debug(scope: string, message: string): boolean;
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
    constructor(options?: Partial<ClientOptions>);
}

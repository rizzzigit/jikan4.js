"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnimeFull = exports.Anime = void 0;
const tslib_1 = require("tslib");
const base_1 = require("./base");
const meta_1 = require("../meta");
const parse_duration_1 = tslib_1.__importDefault(require("parse-duration"));
const genre_1 = require("../../manager/genre");
class Anime extends base_1.Content {
    /** @hidden */
    static parseAirInfo(data) {
        return {
            status: this.parseAirInfoStatus(data.status),
            airing: data.airing,
            airedFrom: this.parseDate(data.aired.from, true),
            airedTo: this.parseDate(data.aired.to, true)
        };
    }
    /** @hidden */
    static parseAirInfoStatus(input) {
        const status = input === null || input === void 0 ? void 0 : input.toLowerCase().trim();
        switch (status) {
            case 'finished airing': return 'FinishedAiring';
            case 'currently airing': return 'Airing';
            case 'not yet aired': return 'NotYetAired';
            default: return 'Unknown';
        }
    }
    /** @hidden */
    static parseType(input) {
        switch (input === null || input === void 0 ? void 0 : input.toLowerCase().trim()) {
            case 'tv': return 'TV';
            case 'ova': return 'OVA';
            case 'movie': return 'Movie';
            case 'special': return 'Special';
            case 'ona': return 'ONA';
            case 'music': return 'Music';
            case 'unknow':
            case 'unknown':
            case '-':
            default: return 'Unknown';
        }
    }
    /** @hidden */
    static parseRating(input) {
        switch (input === null || input === void 0 ? void 0 : input.toLowerCase().trim()) {
            case 'none': return 'None';
            case 'g - all ages': return 'G';
            case 'pg - childre': return 'PG';
            case 'pg - children': return 'PG';
            case 'pg-13 - teens 13 or older': return 'PG-13+';
            case 'r - 17+ (violence & profanity)': return 'R-17+';
            case 'r+ - mild nudity': return 'R+';
            case 'rx - hentai': return 'Rx';
            default: return 'Unknown';
        }
    }
    /** @hidden */
    static parseSeason(input) {
        switch (input) {
            case 'summer': return 'Summer';
            case 'winter': return 'Winter';
            case 'spring': return 'Spring';
            case 'fall': return 'Fall';
            default: return 'Unknown';
        }
    }
    /** @hidden */
    static parseVoiceActorReference(client, data) {
        return {
            language: data.language,
            person: new meta_1.PersonMeta(client, data.person)
        };
    }
    /** @hidden */
    static parseCharacterReference(client, data) {
        var _a;
        return {
            role: data.role,
            character: new meta_1.CharacterMeta(client, data.character),
            voiceActors: (_a = data.voice_actors) === null || _a === void 0 ? void 0 : _a.map((entry) => this.parseVoiceActorReference(client, entry))
        };
    }
    /** @hidden */
    static parseStaffReference(client, data) {
        return {
            positions: data.positions.filter((position) => !!position),
            person: new meta_1.PersonMeta(client, data.person)
        };
    }
    /** @hidden */
    static parseEpisodeTitle(data) {
        return {
            default: data.title,
            japanese: data.japanese || null,
            romanji: data.romanji || null,
            toString: () => data.title
        };
    }
    /** @hidden */
    static parseEpisode(data) {
        return {
            animeId: data.animeId,
            episodeId: data.mal_id,
            URL: Anime.parseURL(data.url, true),
            title: Anime.parseEpisodeTitle(data),
            duration: data.duration || null,
            aired: data.aired ? new Date(data.aired) : null,
            filler: data.filler,
            recap: data.recap,
            synopsis: data.synopsis || null
        };
    }
    /** @hidden */
    static parsePartialEpisode(data) {
        return Object.assign(this.parseEpisode(data), {
            synopsis: null,
            forumUrl: Anime.parseURL(data.forum_url, true)
        });
    }
    /** @hidden */
    static parseTopc(data) {
        return {
            id: data.mal_id,
            url: Anime.parseURL(data.url),
            title: data.title,
            date: new Date(data.date),
            authorUsername: data.author_username,
            authorURL: data.author_url,
            comments: data.comments
        };
    }
    /** @hidden */
    static parsePromo(data) {
        return {
            title: data.title,
            trailer: Anime.parseYoutubeVideo(data.trailer)
        };
    }
    /** @hidden */
    static parseEpisodeVideo(data) {
        var _a, _b, _c;
        return {
            id: data.mal_id,
            url: data.url,
            title: data.title,
            episode: typeof (data.episode) === 'string' ? Number((_a = data.episode.toLowerCase().split('episode')[1]) === null || _a === void 0 ? void 0 : _a.trim()) || 0 : 0,
            imageURL: Anime.parseURL((_c = (_b = data.images) === null || _b === void 0 ? void 0 : _b.jpg) === null || _c === void 0 ? void 0 : _c.image_url, true)
        };
    }
    /** @hidden */
    static parseMusicVideo(data) {
        return {
            title: data.title,
            video: this.parseYoutubeVideo(data.video),
            meta: data.meta
        };
    }
    /** @hidden */
    static parseVideo(data) {
        var _a, _b, _c, _d, _e, _f;
        return {
            promos: (_b = (_a = data.promo) === null || _a === void 0 ? void 0 : _a.map((promo) => this.parsePromo(promo))) !== null && _b !== void 0 ? _b : [],
            episodes: (_d = (_c = data.episodes) === null || _c === void 0 ? void 0 : _c.map((episode) => this.parseEpisodeVideo(episode))) !== null && _d !== void 0 ? _d : [],
            musicVideos: (_f = (_e = data.music_videos) === null || _e === void 0 ? void 0 : _e.map((musicVideo) => this.parseMusicVideo(musicVideo))) !== null && _f !== void 0 ? _f : []
        };
    }
    /** @hidden */
    static parseStatistics(data) {
        return Object.assign(Object.assign({}, super.parseStatistics(data)), { watching: data.watching, planToWatch: data.plan_to_watch });
    }
    /** @hidden */
    static parseRecommendation(client, data) {
        return {
            entry: new meta_1.AnimeMeta(client, data.entry),
            URL: this.parseURL(data.url),
            votes: data.votes
        };
    }
    /** @hidden */
    static parseUserUpdate(data) {
        return Object.assign(Object.assign({}, super.parseUserUpdate(data)), { episodesSeen: data.episodes_seen, episodesTotal: data.episodes_total });
    }
    /** @hidden */
    static parseReview(data) {
        return Object.assign(Object.assign({}, Anime.parseReview(data)), { episodesWatched: data.episodes_watched });
    }
    /** @hidden */
    static parseTopReview(client, data) {
        return Object.assign(Object.assign({}, this.parseReview(data)), { anime: new meta_1.AnimeMeta(client, data.entry) });
    }
    /** @hidden */
    static parseRelationGroup(client, relation, data) {
        var _a, _b;
        const a = super.parseRelationGroup(client, relation, data);
        return Object.assign(Object.assign({}, a), { items: (_b = (_a = data.entry) === null || _a === void 0 ? void 0 : _a.map((item) => new (a.relation === 'Adaptation' ? meta_1.MangaMeta : meta_1.AnimeMeta)(client, item))) !== null && _b !== void 0 ? _b : [] });
    }
    get isExplicit() {
        return !!(['Rx', 'R-17+'].includes(this.rating) ||
            this.genres.find((genre) => !!genre_1.animeExplicitGenres.find((genreEntry) => genreEntry[0] === genre.id)));
    }
    getCharacters() {
        return this.client.anime.getCharacters(this.id);
    }
    getStaff() {
        return this.client.anime.getStaff(this.id);
    }
    getEpisodes(offset, maxCount) {
        return this.client.anime.getEpisodes(this.id, offset, maxCount);
    }
    getEpisode(episodeId) {
        return this.client.anime.getEpisode(this.id, episodeId);
    }
    getNews(offset, maxCount) {
        return this.client.anime.getNews(this.id, offset, maxCount);
    }
    getTopics(topic) {
        return this.client.anime.getTopics(this.id, topic);
    }
    getVideos() {
        return this.client.anime.getVideos(this.id);
    }
    getVideosEpisodes(offset, maxCount) {
        return this.client.anime.getVideosEpisodes(this.id, offset, maxCount);
    }
    getPictures() {
        return this.client.anime.getPictures(this.id);
    }
    getStatistics() {
        return this.client.anime.getStatistics(this.id);
    }
    getMoreInfo() {
        return this.client.anime.getMoreInfo(this.id);
    }
    getRecommendations() {
        return this.client.anime.getRecommendations(this.id);
    }
    getUserUpdates(offset, maxCount) {
        return this.client.anime.getUserUpdates(this.id, offset, maxCount);
    }
    getReviews(offset, maxCount) {
        return this.client.anime.getReviews(this.id, offset, maxCount);
    }
    getRelations() {
        return this.client.anime.getRelations(this.id);
    }
    getThemes() {
        return this.client.anime.getThemes(this.id);
    }
    getExternal() {
        return this.client.anime.getExternal(this.id);
    }
    getStreamingLinks() {
        return this.client.anime.getStreamingLinks(this.id);
    }
    getFull() {
        return this.client.anime.getFull(this.id);
    }
    constructor(client, data) {
        var _a, _b, _c, _d, _e, _f, _g;
        super(client, data);
        this.trailer = data.trailer ? Anime.parseYoutubeVideo(data.trailer) : null;
        this.type = Anime.parseType(data.type);
        this.source = data.source || null;
        this.episodes = data.episodes || null;
        this.airInfo = Anime.parseAirInfo(data);
        this.duration = (0, parse_duration_1.default)(data.duration, 'millisecond') || null;
        this.rating = Anime.parseRating(data.rating);
        this.season = Anime.parseSeason(data.season);
        this.year = data.year || null;
        this.producers = ((_a = data.producers) === null || _a === void 0 ? void 0 : _a.map((producer) => new meta_1.ProducerMeta(this.client, producer))) || [];
        this.licensors = ((_b = data.licensors) === null || _b === void 0 ? void 0 : _b.map((licensor) => new meta_1.ProducerMeta(this.client, licensor))) || [];
        this.studios = ((_c = data.studios) === null || _c === void 0 ? void 0 : _c.map((studio) => new meta_1.ProducerMeta(this.client, studio))) || [];
        this.genres = ((_d = data.genres) === null || _d === void 0 ? void 0 : _d.map((genre) => new meta_1.AnimeGenreMeta(this.client, genre, 'Genre'))) || [];
        this.explicitGenres = ((_e = data.explicit_genres) === null || _e === void 0 ? void 0 : _e.map((genre) => new meta_1.AnimeGenreMeta(this.client, genre, 'Explicit'))) || [];
        this.demographics = ((_f = data.demographics) === null || _f === void 0 ? void 0 : _f.map((genre) => new meta_1.AnimeGenreMeta(this.client, genre, 'Demographic'))) || [];
        this.themes = ((_g = data.themes) === null || _g === void 0 ? void 0 : _g.map((genre) => new meta_1.AnimeGenreMeta(this.client, genre, 'Theme'))) || [];
    }
}
exports.Anime = Anime;
class AnimeFull extends Anime {
    constructor(client, data) {
        var _a, _b;
        super(client, data);
        this.relations = ((_a = data.relations) === null || _a === void 0 ? void 0 : _a.map((relation) => Anime.parseRelationGroup(this.client, Anime.parseRelationType(relation.relation), relation))) || [];
        this.themeSongs = data.theme || data.theme_songs || [];
        this.external = (_b = data.external) === null || _b === void 0 ? void 0 : _b.map((external) => Anime.parseExternal(external));
        this.streamingLinks = data.streaming;
    }
}
exports.AnimeFull = AnimeFull;

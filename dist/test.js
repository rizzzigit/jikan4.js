"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Jikan_1 = require("./Jikan");
const client = new Jikan_1.Client();
client.on('debug', (scope, message) => console.log(`[${scope}] ${message}`));
const run = () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const func = {
        streaming: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const streamingLinks = yield client.anime.getStreamingLinks(1);
            const anime = yield ((_a = (yield client.anime.get(1))) === null || _a === void 0 ? void 0 : _a.getStreamingLinks());
            const animeFull = yield client.anime.getFull(1);
            return { streamingLinks, anime, animeFull };
        }),
        musicVideo: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const videos = yield client.anime.getVideos(20);
            // const data = await (await fetch('https://api.jikan.moe/v4/anime/20/videos')).json()
            // const video = new AnimeVideo(client, data.data)
            // console.log(video.musicVideos)
            return videos;
        }),
        videosEpisodes: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            var _b;
            const anime = yield ((_b = (yield client.anime.get(20))) === null || _b === void 0 ? void 0 : _b.getVideosEpisodes(0, 0));
            const videosEpisodes = yield client.anime.getVideosEpisodes(20, 0, 0);
            return { anime, videosEpisodes };
        }),
        title: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const anime = yield client.anime.get(20);
            console.log(anime === null || anime === void 0 ? void 0 : anime.title);
        }),
        external: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () { return yield client.users.getFull('lamaw'); }),
        producer: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const list = yield client.producers.list(0, 10);
            const producer = yield client.producers.getFull(1);
            const external = yield client.producers.getExternal(1);
            return { list, producer, external };
        }),
        fullUserUpdate: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const user = yield client.users.getFull('fullbellydragon');
            return user === null || user === void 0 ? void 0 : user.updates;
        }),
        reviewUpdate: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const anime = yield client.anime.get(5);
            // const manga = await client.manga.get(4)
            // console.log(await anime?.getReviews())
            // console.log(await manga?.getReviews())
            console.log(yield (anime === null || anime === void 0 ? void 0 : anime.getFull()));
        }),
        getAll: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const animeIds = new Map();
            const mangaIds = new Map();
            const characterIds = new Map();
            const getCharacter = (character) => {
                if (characterIds.has(character.id)) {
                    return;
                }
                characterIds.set(character.id, null);
                character.getAnime().then((anime) => anime.map((a) => a.anime.getFull().then(getAnime)));
                character.getManga().then((manga) => manga.map((m) => m.manga.getFull().then(getManga)));
            };
            const getAnime = (anime) => {
                if (animeIds.has(anime.id)) {
                    return;
                }
                animeIds.set(anime.id, null);
                anime.getCharacters().then((characters) => characters.map((a) => a.character.getFull().then(getCharacter)));
            };
            const getManga = (manga) => {
                if (mangaIds.has(manga.id)) {
                    return;
                }
                mangaIds.set(manga.id, null);
                manga.getCharacters().then((characters) => characters.map((a) => a.character.getFull().then(getCharacter)));
            };
            client.anime.list(0, 100).then((list) => list.forEach(getAnime));
            client.manga.list(0, 100).then((list) => list.forEach(getManga));
            client.characters.list(0, 100).then((list) => list.forEach(getCharacter));
        })
    };
    const funcKey = process.argv[2];
    return yield func[funcKey]();
});
run().then((data) => data !== undefined ? console.log(data) : undefined);

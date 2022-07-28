"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Jikan_1 = require("./Jikan");
const client = new Jikan_1.Client();
client.on('debug', (scope, message) => console.log(`[${scope}] ${message}`));
const run = () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const func = {
        streaming1: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const streaming = yield client.anime.getStreamingLinks(1);
            return streaming;
        }),
        streaming2: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const anime = yield client.anime.get(1);
            return yield (anime === null || anime === void 0 ? void 0 : anime.getStreamingLinks());
        }),
        streaming3: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const fullAnime = yield client.anime.getFull(1);
            return fullAnime;
        }),
        musicVideo1: () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const videos = yield client.anime.getVideos(20);
            // const data = await (await fetch('https://api.jikan.moe/v4/anime/20/videos')).json()
            // const video = new AnimeVideo(client, data.data)
            // console.log(video.musicVideos)
            return videos;
        })
    };
    const funcKey = process.argv[2];
    return yield func[funcKey]();
});
run().then((data) => data !== undefined ? console.log(data) : undefined);

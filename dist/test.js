"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const v4_1 = require("./v4");
const client = new v4_1.Client();
client.on('debug', (scope, message) => { console.log(`[${scope}] ${message}`); });
const run = () => __awaiter(void 0, void 0, void 0, function* () {
    const func = {
        streaming: () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const streamingLinks = yield client.anime.getStreamingLinks(1);
            const anime = yield ((_a = (yield client.anime.get(1))) === null || _a === void 0 ? void 0 : _a.getStreamingLinks());
            const animeFull = yield client.anime.getFull(1);
            return { streamingLinks, anime, animeFull };
        }),
        musicVideo: () => __awaiter(void 0, void 0, void 0, function* () {
            const videos = yield client.anime.getVideos(20);
            // const data = await (await fetch('https://api.jikan.moe/v4/anime/20/videos')).json()
            // const video = new AnimeVideo(client, data.data)
            // console.log(video.musicVideos)
            return videos;
        }),
        videosEpisodes: () => __awaiter(void 0, void 0, void 0, function* () {
            var _b;
            const anime = yield ((_b = (yield client.anime.get(20))) === null || _b === void 0 ? void 0 : _b.getVideosEpisodes(0, 0));
            const videosEpisodes = yield client.anime.getVideosEpisodes(20, 0, 0);
            return { anime, videosEpisodes };
        }),
        title: () => __awaiter(void 0, void 0, void 0, function* () {
            const anime = yield client.anime.get(20);
            console.log(anime === null || anime === void 0 ? void 0 : anime.title);
        }),
        producer: () => __awaiter(void 0, void 0, void 0, function* () {
            const list = yield client.producers.list(0, 10);
            const producer = yield client.producers.getFull(1);
            const external = yield client.producers.getExternal(1);
            return { list, producer, external };
        }),
        reviewUpdate: () => __awaiter(void 0, void 0, void 0, function* () {
            const anime = yield client.anime.get(5);
            const manga = yield client.manga.get(4);
            console.log(yield (anime === null || anime === void 0 ? void 0 : anime.getReviews()));
            console.log(yield (manga === null || manga === void 0 ? void 0 : manga.getReviews()));
        }),
        dupeReqs: () => __awaiter(void 0, void 0, void 0, function* () {
            const promises = [];
            let returned = 0;
            for (let count = 0; count < 100; count++) {
                promises.push(client.anime.get(5).then((a) => {
                    returned++;
                    console.log(returned);
                    return a;
                }));
            }
        }),
        searchExample: () => __awaiter(void 0, void 0, void 0, function* () {
            const result = (yield client.anime.search('naruto')).map(({ title: { default: _d }, year }) => ({ default: _d, year }));
            console.table(result);
        })
    };
    const funcKey = process.argv[2];
    return yield func[funcKey]();
});
void run().then((data) => { if (data != null) {
    console.log(data);
} });

"use strict";
/*
  eslint-disable @typescript-eslint/no-non-null-assertion
*/
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
        allAnimeEpisodes: () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const stats = {};
            // const stats: Record<string, { count: number, most: number }> = {}
            for (const { type, episodes } of yield client.anime.list(0, 0)) {
                const current = (_a = stats[type]) !== null && _a !== void 0 ? _a : (stats[type] = {
                    null: 0,
                    zero: 0,
                    one: 0,
                    '2-10': 0,
                    '11-100': 0,
                    '101-200': 0,
                    more: 0
                });
                if (episodes == null) {
                    current.null++;
                }
                else if (episodes === 0) {
                    current.zero++;
                }
                else if (episodes === 1) {
                    current.one++;
                }
                else if ((episodes >= 2) && (episodes <= 10)) {
                    current['2-10']++;
                }
                else if ((episodes >= 11) && (episodes <= 100)) {
                    current['11-100']++;
                }
                else if ((episodes >= 101) && (episodes <= 200)) {
                    current['101-200']++;
                }
                else if ((episodes > 200)) {
                    current.more++;
                }
                // if (anime.episodes == null) {
                //   continue
                // }
                // const current = stats[anime.type] ??= {
                //   count: 0,
                //   most: anime.episodes
                // }
                // current.most = Math.max(current.most, anime.episodes)
            }
            console.log('Anime types with at least one episodes.');
            console.table(stats);
        }),
        animeBroadcast: () => __awaiter(void 0, void 0, void 0, function* () {
            for (const anime of yield client.anime.list(0, 0)) {
                console.log(`${anime.title.default}: ${JSON.stringify(anime.broadcast)}`);
            }
        })
    };
    return yield func[process.argv[2]]();
});
void run().then((data) => { if (data != null) {
    console.log(data);
} });

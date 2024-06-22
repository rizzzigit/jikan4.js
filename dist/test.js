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
client.on('debug', (scope, message) => {
    console.log(`[${scope}] ${message}`);
});
const run = () => __awaiter(void 0, void 0, void 0, function* () {
    const func = {
        relations: () => __awaiter(void 0, void 0, void 0, function* () {
            const anime = (yield client.anime.get(20));
            console.log(yield anime.getRelations());
        })
    };
    return yield func[process.argv[2]]();
});
void run().then((data) => {
    if (data != null) {
        console.log(data);
    }
});

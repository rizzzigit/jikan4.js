import { Client } from "../core/client";
import { BaseClass } from "./base";
import { AnimeMeta, MangaMeta } from "./meta";
import { User } from "./user";
export declare class BaseRecommendation extends BaseClass {
    readonly content: string;
    readonly date: Date;
    readonly user: RecommendationUser;
    constructor(client: Client, data: any);
}
export declare class AnimeRecommendation extends BaseRecommendation {
    readonly entries: Array<AnimeMeta>;
    constructor(client: Client, data: any);
}
export declare class MangaRecommendation extends BaseRecommendation {
    readonly entries: Array<MangaMeta>;
    constructor(client: Client, data: any);
}
export declare class RecommendationUser extends BaseClass {
    readonly url: URL;
    readonly username: string;
    getUser(): Promise<User>;
    constructor(client: Client, data: any);
}

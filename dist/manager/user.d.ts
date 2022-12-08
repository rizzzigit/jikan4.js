import { User, UserFriend, UserMeta, UserFull } from '../resource/user';
import { BaseManager } from './base';
import { AnimeReview } from '../resource/content/anime';
import { MangaReview } from '../resource/content/manga';
import { ClubMeta } from '../resource/meta';
import { Link } from '../Jikan';
export interface UserSearchFilter {
    gender: 'any' | 'male' | 'female' | 'nonbinary';
    location: string;
    maxAge: number;
    minAge: number;
}
export declare class UserManager extends BaseManager {
    search(searchString: string, filter?: Partial<UserSearchFilter>, offset?: number, maxCount?: number): Promise<User[]>;
    list(offset?: number, maxCount?: number): Promise<UserMeta[]>;
    get(username: string): Promise<User | undefined>;
    getFull(username: string): Promise<UserFull | undefined>;
    getStatistics(username: string): Promise<import("../Jikan").UserStats | undefined>;
    getFavorites(username: string): Promise<import("../Jikan").UserFavorites | undefined>;
    getUpdates(username: string): Promise<import("../Jikan").UserContentUpdates | undefined>;
    getAbout(username: string): Promise<string | null | undefined>;
    getHistory(username: string, type?: 'anime' | 'manga' | 'all'): Promise<(import("../Jikan").UserAnimeHistory | import("../Jikan").UserMangaHistory)[]>;
    getFriends(username: string, offset?: number, maxCount?: number): Promise<UserFriend[] | undefined>;
    getReviews(username: string, offset?: number, maxCount?: number): Promise<Array<AnimeReview | MangaReview> | undefined>;
    getRecommendations(username: string, offset?: number, maxCount?: number): Promise<import("../Jikan").UserRecommendation[] | undefined>;
    getClubs(username: string, offset?: number, maxCount?: number): Promise<ClubMeta[] | undefined>;
    getExternal(username: string): Promise<Array<Link> | undefined>;
}

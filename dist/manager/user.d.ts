import { AnimeMeta, AnimeReview, Club, MangaMeta, MangaReview } from '../Jikan';
import { User, UserContentUpdates, UserFavorites, UserFriend, UserMeta, UserRecommendation, UserStats } from '../resource/user';
import { BaseManager } from './base';
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
    getStatistics(username: string): Promise<UserStats | undefined>;
    getFavorites(username: string): Promise<UserFavorites | undefined>;
    getUpdates(username: string): Promise<UserContentUpdates | undefined>;
    getAbout(username: string): Promise<string | null | undefined>;
    getHistory(username: string, type?: 'anime' | 'manga' | 'all'): Promise<(AnimeMeta | MangaMeta)[]>;
    getFriends(username: string, offset?: number, maxCount?: number): Promise<UserFriend[]>;
    getReviews(username: string, offset?: number, maxCount?: number): Promise<(MangaReview | AnimeReview)[]>;
    getRecommendations(username: string, offset?: number, maxCount?: number): Promise<UserRecommendation[]>;
    getClubs(username: string, offset?: number, maxCount?: number): Promise<Club[]>;
}

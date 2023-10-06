import { BaseManager } from '../manager/base';
import { Club, ClubMember, ClubRelations, ClubStaff } from '../resource/club';
export interface ClubSearchFilter {
    type: 'public' | 'private' | 'secret';
    category: 'anime' | 'manga' | 'actors_and_artists' | 'characters' | 'cities_and_neighborhoods' | 'companies' | 'conventions' | 'games' | 'japan' | 'music' | 'other' | 'schools';
    orderBy: 'mal_id' | 'title' | 'members_count' | 'pictures_count' | 'created';
    sort: 'desc' | 'asc';
}
export declare class ClubManager extends BaseManager {
    search(searchString: string, filter?: Partial<ClubSearchFilter>, offset?: number, maxCount?: number): Promise<Club[]>;
    get(clubId: number): Promise<Club | null | undefined>;
    getMembers(clubId: number): Promise<Array<ClubMember> | undefined>;
    getStaff(clubId: number): Promise<Array<ClubStaff> | undefined>;
    getRelations(clubId: number): Promise<ClubRelations | undefined>;
}

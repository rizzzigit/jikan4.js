import { Client } from '../core/client';
import { BaseResource } from './base';
export type ClubCategory = 'ActorsAndArtists' | 'Anime' | 'Characters' | 'CitiesAndNeighborhoods' | 'Companies' | 'Conventions' | 'Games' | 'Japan' | 'Manga' | 'Music' | 'Others' | 'Schools' | 'None' | 'Unknown';
export type ClubType = 'Public' | 'Private' | 'Secret' | 'Unknown';
export declare class Club extends BaseResource {
    /** @hidden */
    static parseCategory(input: any): ClubCategory;
    /** @hidden */
    static parseType(input: any): ClubType;
    /** @hidden */
    static parseStaff(data: any): ClubStaff;
    /** @hidden */
    static parseMember(data: any): ClubMember;
    readonly imageUrl: string | null;
    readonly memberCount: number;
    readonly pictureCount: number;
    readonly category: ClubCategory;
    readonly created: Date;
    readonly type: ClubType;
    readonly staff: Array<ClubStaff>;
    getMembers(): Promise<ClubMember[]>;
    constructor(client: Client, data: any);
}
export interface ClubStaff {
    readonly url: string;
    readonly username: string;
}
export interface ClubMember {
    readonly URL: string;
    readonly username: string;
    readonly imageURL: string | null;
}

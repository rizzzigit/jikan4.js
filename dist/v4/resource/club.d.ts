import { Client } from '../core/client';
import { BaseClass, BaseResource } from './base';
import { ImageFormatCollection } from './misc';
export type ClubCategory = 'ActorsAndArtists' | 'Anime' | 'Characters' | 'CitiesAndNeighborhoods' | 'Companies' | 'Conventions' | 'Games' | 'Japan' | 'Manga' | 'Music' | 'Others' | 'Schools' | 'None' | 'Unknown';
export type ClubType = 'Public' | 'Private' | 'Secret' | 'Unknown';
export declare class Club extends BaseResource {
    /** @hidden */
    static parseCategory(input: any): ClubCategory;
    /** @hidden */
    static parseType(input: any): ClubType;
    readonly image: ImageFormatCollection | null;
    readonly memberCount: number;
    readonly pictureCount: number;
    readonly category: ClubCategory;
    readonly created: Date;
    readonly type: ClubType;
    readonly staff: Array<ClubStaff>;
    getMembers(): Promise<ClubMember[]>;
    constructor(client: Client, data: any);
}
export declare class ClubStaff extends BaseClass {
    readonly url: URL;
    readonly username: string;
    constructor(client: Client, data: any);
}
export declare class ClubMember extends BaseClass {
    readonly URL: URL;
    readonly username: string;
    readonly imageURL: URL | null;
    constructor(client: Client, data: any);
}

export interface Image {
    small: string | null;
    default: string | null;
    medium: string | null;
    large: string | null;
    maximum: string | null;
}
export interface YoutubeVideo {
    id: string;
    url: string;
    embedUrl: string;
    image: Image;
}
export interface Link {
    name: string;
    url: string;
}

import { Client } from "../core/client";
import { AnimeReview } from "./content/anime";
import { MangaReview } from "./content/manga";
import { AnimeMeta, MangaMeta } from "./meta";

export class ReviewAnime extends AnimeReview {
  public readonly entry: AnimeMeta

  public constructor (client: Client, data: any) {
    super(client, data)

    this.entry = new AnimeMeta(client, data.entry)
  }
}

export class ReviewManga extends MangaReview {
  public readonly entry: MangaMeta

  public constructor (client: Client, data: any) {
    super(client, data)

    this.entry = new MangaMeta(client, data.entry)
  }
}

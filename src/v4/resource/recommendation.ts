import { Client } from "../core/client";
import { BaseClass, BaseResource } from "./base";
import { AnimeMeta, MangaMeta } from "./meta";
import { User } from "./user";

export class BaseRecommendation extends BaseClass {
  public readonly content: string
  public readonly date: Date
  public readonly user: RecommendationUser

  public constructor (client: Client, data: any) {
    super(client)

    this.content = data.content
    this.date = BaseRecommendation.parseDate(data.date)
    this.user = new RecommendationUser(client, data.user)
  }
}

export class AnimeRecommendation extends BaseRecommendation {
  public readonly entries: Array<AnimeMeta>
  public constructor(client: Client, data: any) {
    super(client, data)

    this.entries = data.entry?.map((entry: any) => new AnimeMeta(client, entry)) || []
  }
}

export class MangaRecommendation extends BaseRecommendation {
  public readonly entries: Array<MangaMeta>

  public constructor(client: Client, data: any) {
    super(client, data)

    this.entries = data.entry?.map((entry: any) => new MangaMeta(client, entry)) || []
  }
}

export class RecommendationUser extends BaseClass {
  public readonly url: URL
  public readonly username: string

  public getUser () {
    return <Promise<User>> this.client.users.get(this.username)
  }

  public constructor (client: Client, data: any) {
    super(client)

    this.url = RecommendationUser.parseURL(data.url, false)
    this.username = data.username
  }
}

import { Anime } from "../resource/content/anime";
import { Season, SeasonType } from "../resource/season";
import { BaseManager } from "./base";

export interface SeasonFilter {
  filter: "tv" | "movie" | "ova" | "special" | "ona" | "music";
  sfw: boolean;
  unapproved: boolean;
  continuing: boolean;
}

export class SeasonManager extends BaseManager {
  public list(
    ...args:
      | [offset?: number, maxCount?: number]
      | [filter: Partial<SeasonFilter>, offset?: number, maxCount?: number]
  ) {
    const inner = async (
      filter?: Partial<SeasonFilter>,
      offset?: number,
      maxCount?: number
    ) => {
      const rawData = <Array<any>>(
        await this.requestPaginated("seasons", offset, maxCount, filter)
      );

      return rawData.map((data: any) => new Season(this.client, data));
    };

    if (typeof args[0] === "object") {
      const [filter, offset, maxCount] = args;
      return inner(filter, offset, maxCount);
    } else {
      const [offset, maxCount] = args;
      return inner(undefined, offset, maxCount);
    }
  }

  public async getUpcoming(offset?: number, maxCount?: number) {
    const rawData = <Array<any>>(
      await this.requestPaginated("seasons/upcoming", offset, maxCount)
    );

    return rawData.map((data: any) => new Anime(this.client, data));
  }

  public async get(
    season: SeasonType,
    year: number = new Date().getFullYear(),
    ...args:
      | [offset?: number, maxCount?: number]
      | [filter: Partial<SeasonFilter>, offset?: number, maxCount?: number]
  ) {
    const inner = async (
      filter?: Partial<SeasonFilter>,
      offset?: number,
      maxCount?: number
    ) => {
      const rawData = <Array<any>>(
        await this.requestPaginated(
          `seasons/${year}/${season.toLowerCase()}`,
          offset,
          maxCount,
          filter
        )
      );

      return rawData.map((data: any) => new Anime(this.client, data));
    };

    if (typeof args[0] === "object") {
      const [filter, offset, maxCount] = args;
      return inner(filter, offset, maxCount);
    } else {
      const [offset, maxCount] = args;
      return inner(undefined, offset, maxCount);
    }
  }

  public async getNow(
    ...args:
      | [offset?: number, maxCount?: number]
      | [filter: Partial<SeasonFilter>, offset?: number, maxCount?: number]
  ) {
    const inner = async (
      filter?: Partial<SeasonFilter>,
      offset?: number,
      maxCount?: number
    ) => {
      const rawData = <Array<any>>(
        await this.requestPaginated("seasons/now", offset, maxCount, filter)
      );

      return rawData.map((data: any) => new Anime(this.client, data));
    };

    if (typeof args[0] === "object") {
      const [filter, offset, maxCount] = args;
      return inner(filter, offset, maxCount);
    } else {
      const [offset, maxCount] = args;
      return inner(undefined, offset, maxCount);
    }
  }
}

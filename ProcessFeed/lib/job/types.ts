import Podcast, { FeedOptions } from 'podcast';

export type RSSModel = {};

export enum JobStatusEnum {
    QUEUE = 0,
    RUNNING = 1,
    FINISHED = 2,
    FAILED = 3
}

export enum JobTypeEnum {
    main = 0,
    debates = 1,
    plenair = 2,
    troelstra = 3,
    thorbecke = 4,
    politician = 5,
    category = 6
}

export type AbstractJobType<TData> = {
    podcastItems: Array<Podcast.Item>,
    apiData: TData,
    xml: string,
    container: string,
    options: PodcastOptions,
    getData<T>(): Promise<T>,
    mapData(): Promise<RSSModel>,
    generateRSS(): string,
    run(): Promise<boolean>,
    runPipeline(): Promise<boolean>,
    output(): string
};

export type PodcastOptions = {
    feedSettings?: FeedOptions,
    debateDate?: Date
};

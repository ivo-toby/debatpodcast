import Podcast from 'podcast';

export type RSSModel = {};

export type QueueOptions = {
    debateDate: Date,
    feedOptions: Podcast.FeedOptions
};

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
    politician = 4,
    category = 5
}

export type AbstractJobType = {
    getData<T>(): Promise<T>,
    mapData(): Promise<RSSModel>,
    generateRSS(): string,
    saveRSS(): Promise<boolean>,
    saveData(): Promise<boolean>,
    saveStatus(): Promise<boolean>,
    process(options: QueueOptions): Promise<boolean>
};

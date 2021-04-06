import Podcast from 'podcast';
import {
    AbstractJobType, JobStatusEnum, JobTypeEnum, QueueOptions,
} from './types';

export abstract class AbstractJob<TData> implements AbstractJobType {
    protected status: JobStatusEnum = JobStatusEnum.QUEUE;

    protected type: JobTypeEnum;

    public podcastItems: Array<any> = [];

    public apiData: TData;

    options: QueueOptions;

    items: Array<Podcast.Item> = [];

    async getData<TData>(): Promise<TData> {
        console.error('NEEDS IMPLEMENTATION');
        return new Promise<TData>((resolve) => { resolve({} as TData); });
    }

    async mapData(): Promise<any> {
        console.error('NEEDS IMPLEMENTATION');
        return new Promise<[Podcast.Item]>((resolve) => { resolve([{ url: '', date: new Date() }]); });
    }

    generateRSS(): string {
        const feed = new Podcast(this.options.feedOptions, this.items);
        console.error('NEEDS IMPLEMENTATION');
        return '';
    }

    async saveRSS(): Promise<boolean> {
        console.error('NEEDS IMPLEMENTATION');
        return new Promise<boolean>((resolve) => { resolve(true); });
    }

    async saveData(): Promise<boolean> {
        console.error('NEEDS IMPLEMENTATION');
        return new Promise<boolean>((resolve) => { resolve(true); });
    }

    async saveStatus(): Promise<boolean> {
        console.error('NEEDS IMPLEMENTATION');
        return new Promise<boolean>((resolve) => { resolve(true); });
    }

    async process(options: QueueOptions): Promise<boolean> {
        this.options = options;

        await this.getData<TData>();
        await this.mapData();
        this.generateRSS();
        await this.saveData();
        await this.saveRSS();
        await this.saveStatus();
        return true;
    }
}

import Podcast from 'podcast';
import { Pipeline } from '../../../Shared/lib/createPipeline';
import { createDebatPodcastPipeline, DebatPodcastPipelineContext } from '../pipeline';
import {
    AbstractJobType, JobStatusEnum, JobTypeEnum, PodcastOptions,
} from './types';

export default abstract class AbstractJob<TData> implements AbstractJobType<TData> {
    protected status: JobStatusEnum = JobStatusEnum.QUEUE;

    protected type: JobTypeEnum;

    public podcastItems: Array<Podcast.Item> = [];

    public apiData: TData;

    public xml: string;

    public container: string = '';

    protected pipeline: Pipeline<DebatPodcastPipelineContext>;

    public options: PodcastOptions;

    items: Array<Podcast.Item> = [];

    public constructor(options: PodcastOptions) {
        this.options = options;
        this.pipeline = createDebatPodcastPipeline();
    }

    async getData<TData>(): Promise<TData> {
        // eslint-disable-next-line no-console
        console.error('NEEDS IMPLEMENTATION');
        return new Promise<TData>((resolve) => { resolve({} as TData); });
    }

    async mapData(): Promise<any> {
        console.error('NEEDS IMPLEMENTATION');
        return new Promise<[Podcast.Item]>((resolve) => { resolve([{ url: '', date: new Date() }]); });
    }

    generateRSS(): string {
        const feed = new Podcast(this.options.feedSettings, this.podcastItems);
        this.xml = feed.buildXml();
        return this.xml;
    }

    async runPipeline(): Promise<boolean> {
        console.error('NEEDS IMPLEMENTATION');
        return new Promise((resolve) => { resolve(true); });
    }

    async run(): Promise<boolean> {
        await this.getData<TData>();
        await this.mapData();
        this.generateRSS();
        await this.runPipeline();
        return true;
    }

    output(): string {
        return this.xml;
    }
}

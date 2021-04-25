import Podcast from 'podcast';
import config from '../../config/main.json';
import DebatDirectAPIClient from '../debatDirect/DebatDirectAPIClient';
import { DebatDay, Debate, DebateDetails } from '../debatDirect/debatTypes';
import { saveRSS, saveStatus, uploadRSS } from '../middleware';
import AbstractJob from './AbstractJob';
import { AbstractJobType, PodcastOptions } from './types';

export default class JobMain extends AbstractJob<DebatDay> implements AbstractJobType {
    public constructor(options: PodcastOptions) {
        super({
            feedSettings: config,
            ...options,
        });
    }

    async getData<DebatDay>(): Promise<DebatDay> {
        const api = new DebatDirectAPIClient();
        const { debateDate } = this.options;
        this.apiData = await api.getDay(debateDate);
        return this.apiData as unknown as DebatDay;
    }

    async mapData(): Promise<Array<Podcast.Item>> {
        // @ts-ignore
        const podcastItems = this.apiData.debates.map<Podcast.Item>(async (apiItem) => {
            const description = await this.getDescription(apiItem);
            return {
                title: apiItem.name,
                description: await this.getDescription(apiItem),
                url: 'someurl',
                date: apiItem.debateDate,
                categories: await this.getCategoriesArray(apiItem),
                itunesAuthor: process.env.itunesAuthor,
                itunesExplicit: process.env.itunesExplicit,
                itunesSummary: description,
                itunesTitle: apiItem.name,
                itunesEpisodeType: process.env.itunesEpisodeType,
            };
        });
        this.podcastItems = await Promise.all(podcastItems);
        return this.podcastItems;
    }

    public async getDebatDetails(date: Date, id: string): Promise<DebateDetails> {
        const api = new DebatDirectAPIClient();
        const debatDetails = await api.getDebatDetails(date, id);
        return debatDetails;
    }

    public async getDescription(apiItem: Debate): Promise<string> {
        const details = await this.getDebatDetails(new Date(apiItem.debateDate), apiItem.id);
        return details.introduction;
    }

    public async getCategoriesArray(apiItem: Debate): Promise<Array<string>> {
        const details = await this.getDebatDetails(new Date(apiItem.debateDate), apiItem.id);
        return details.categoryIds.map((cat) => cat);
    }

    public async runPipeline(): Promise<boolean> {
        this.pipeline.push(saveRSS);
        this.pipeline.push(uploadRSS);
        this.pipeline.push(saveStatus);
        this.pipeline.execute({
            job: this,
            messages: [],
        });
        return true;
    }
}

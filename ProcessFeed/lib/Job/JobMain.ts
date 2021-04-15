import { createTableServiceWithSas } from 'azure-storage';
import Podcast from 'podcast';
import DebatDirectAPIClient from '../debatDirect/DebatDirectAPIClient';
import { DebatDay, Debate, DebateDetails } from '../debatDirect/debatTypes';
import { AbstractJob } from './AbstractJob';
import { AbstractJobType } from './types';

export class JobMain extends AbstractJob<DebatDay> implements AbstractJobType {
    async getData<DebatDay>(): Promise<DebatDay> {
        const api = new DebatDirectAPIClient();
        const { debateDate } = this.options;
        this.apiData = await api.getDay(debateDate);
        return this.apiData as unknown as DebatDay;
    }

    async mapData(): Promise<any> { // Array<Podcast.Item>
        const podcastItems = await this.apiData.debates.map(async (apiItem) => {
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
}

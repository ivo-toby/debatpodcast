import { AzureFunction, Context } from '@azure/functions';
import { JobQueue } from './lib/Job/JobQueue';
import { jobFactory } from './lib/Job/jobFactory';
import { JobTypeEnum } from './lib/Job/types';

const timerTrigger: AzureFunction = async (context: Context, myTimer: any): Promise<void> => {
    const timeStamp = new Date().toISOString();

    if (myTimer.isPastDue) {
        console.log('TIME PAST DUE');

        const queue = new JobQueue({
            debateDate: new Date('2021-04-07'),
            feedOptions: {
                title: 'string Title of your site or feed',
                description: 'optional string A short description of the feed.',
                generator: 'optional string Feed generator.',
                feedUrl: 'url string Url to the rss feed.',
                siteUrl: 'url string Url to the site that the feed is for.',
                imageUrl: 'optional *url string Small image for feed readers to use.',
                docs: 'optional url string Url to documentation on this feed.',
                author: 'string Who owns this feed.',
                managingEditor: 'optional string Who manages content in this feed.',
                webMaster: 'optional string Who manages feed availability and technical support.',
                copyright: 'optional string Copyright information for this feed.',
                language: 'optional string The language of the content of this feed.',
                categories: ['optional array of strings One or more categories this feed belongs to.'],
                pubDate: 'optional Date object or date string The publication date for content in the feed',
                ttl: 10, // 'optional integer Number of minutes feed can be cached before refreshing from source.',
                itunesAuthor: 'optional string (iTunes specific) author of the podcast',
                itunesSubtitle: 'optional string (iTunes specific) subtitle for iTunes listing',
                itunesSummary: 'optional string (iTunes specific) summary for iTunes listing',
                itunesOwner: {
                    name: 'string',
                    email: 'string',
                },
                itunesExplicit: false, // 'optional boolean (iTunes specific) specifies if the podcast contains explicit content',
                itunesCategory: [{
                    text: 'string',
                }],
                itunesImage: 'optional string (iTunes specific) link to an image for the podcast',
                itunesType: 'serial',
                customNamespaces: {}, // 'optional object Put additional namespaces in element (without \'xmlns:\' prefix)',
                customElements: [{}], // 'optional array Put additional elements in the feed (node-xml syntax)',
            },
        });
        /**
         * Create job object(s) to be run
         */
        const mainJob = jobFactory(JobTypeEnum.main);
        queue.add(mainJob);

        await queue.run();

        console.log(mainJob.output());
    }
    context.log('Timer trigger function ran!', timeStamp);
};
export default timerTrigger;

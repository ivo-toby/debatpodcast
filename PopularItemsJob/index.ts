import { AzureFunction, Context } from '@azure/functions';
import { TableQuery } from 'azure-storage';
import ContentfulGraphAPIClient from '../Shared/lib/contentful/ContentfulGraphAPIClient';
import {
    getUrlsFromStorage,
    UrlObjectType,
    getFilterUrls,
    getPartialQueryFromSlugs,
} from './utils';
import { IPopularContentEntity, IPopularContentEntityCollection } from '../Shared/lib/db/entities/ITableEntities';
import { PopularContentFactory } from '../Shared/lib/db/factories';

const timerTrigger: AzureFunction = async (context: Context, myTimer: any): Promise<void> => {
    const timeStamp = new Date().toISOString();

    if (myTimer.isPastDue) {
        /**
         * How this should work
         * - get slugs from SiteVisit table from last x days
         * - filter slugs that are not actual articles
         * - reformat and count and sort slugs
         * - fetch content of those popular slugs from contentful
         * - delete all database-stored (cached) popular content
         * - store JSON of fetched content in database to be served by another api
         */
        const APICall = new ContentfulGraphAPIClient();
        const urls: Array<UrlObjectType> = await getUrlsFromStorage();

        // filter and sanitize
        const filteredUrls: Array<string> = getFilterUrls(urls);

        const countedUrl = filteredUrls.reduce<{ [key: string]: number }>((urlElement, key) => {
            // eslint-disable-next-line no-param-reassign
            urlElement[key] = urlElement[key] ? urlElement[key] + 1 : 1;
            return urlElement;
        }, {});

        const sortedSlugs: Array<[string, number]> = Object.entries<number>(countedUrl);
        sortedSlugs.sort((a: [string, number], b: [string, number]) => {
            return b[1] - a[1];
        });

        // get first N items:
        const popularSlugs: Array<[string, number]> = sortedSlugs.slice(0, parseInt(process.env.POPULARITEMSLIMIT, 10));

        // next step is to fetch the articles from CF and store the output in database so it can be retrieved with an api call from the frontend
        const query = getPartialQueryFromSlugs(popularSlugs);

        // map content
        const contentfulResult = await APICall.getContentCollectionByQuery(query);

        // delete all current items in database;
        const factory = new PopularContentFactory();
        const currentRecords = await factory.get<IPopularContentEntityCollection>(new TableQuery());
        currentRecords.forEach((record) => {
            factory.delete(record);
        });
        const idArray = contentfulResult.contentCollection.items.map((item) => {
            return item.id;
        });

        // save the outcome to database;
        const popularContentItems: IPopularContentEntity = {
            contentItems: JSON.stringify(idArray),
        };

        await factory.create(popularContentItems);
    }
    context.log('Timer trigger function ran!', timeStamp);
};
export default timerTrigger;

import { TableQuery, TableUtilities } from 'azure-storage';
import { contentCollectionQuery } from '../Shared/lib/contentful/queries';
import { SiteVisitFactory } from '../Shared/lib/db/factories';

export type UrlObjectType = {
    url: string;
};

export function getUrlsMatchArray(): Array<string> {
    return process.env.POPULARITEMSTYPES.toString().split(',');
}

export function stripUrlsMatchArray(url: string): string {
    let sanitized = url;
    getUrlsMatchArray().forEach((match) => {
        sanitized = sanitized.replace(`/${match}/`, '');
    });
    return sanitized;
}

export async function getUrlsFromStorage(): Promise<Array<UrlObjectType>> {
    const SiteVisitDb = new SiteVisitFactory();
    let dateDiff = new Date().getTime();
    dateDiff -= (parseInt(process.env.POPULARITEMSDATERANGEDAYS, 10) * 24 * 60 * 60 * 1000);
    const past = new Date(dateDiff);

    const { QueryComparisons } = TableUtilities;
    const tableQuery = new TableQuery()
        .select('url')
        .where(TableQuery.dateFilter('dtCreated', QueryComparisons.GREATER_THAN, past))
        .and(TableQuery.stringFilter('url', QueryComparisons.NOT_EQUAL, '/'));

    getUrlsMatchArray().forEach((elem) => {
        tableQuery.and(TableQuery.stringFilter('url', QueryComparisons.NOT_EQUAL, `/${elem}`));
    });

    const urls = await SiteVisitDb.get<UrlObjectType>(tableQuery);
    return urls;
}

export function getFilterUrls(urls: Array<UrlObjectType>): Array<string> {
    const filteredUrls: Array<string> = [];
    urls.forEach((urlObject) => {
        let { url } = urlObject;
        const path = url.split('/');
        if ((getUrlsMatchArray().indexOf(path[1]) > -1) && path.length > 2) {
            // strip the urlMatch
            // eslint-disable-next-line no-restricted-globals
            if (typeof (parseInt(path[2], 10)) === 'number' && !isNaN((parseInt(path[2], 10)))) {
                url = url.replace(`/${path[2]}`, '');
            }
            filteredUrls.push(stripUrlsMatchArray(url));
        }
    });

    return filteredUrls;
}

export function getPartialQueryFromSlugs(slugs: Array<[string, number]>): string {
    const whereString = slugs.map((item) => {
        return `{
                    slug: "${item[0]}"
                }`;
    });
    const query = `
    {
        OR:[
          ${whereString.join(',')}
        ]
    }`;
    return contentCollectionQuery(query);
}

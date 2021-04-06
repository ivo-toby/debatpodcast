import HttpClient from '../HttpClient';
import { DebatDay } from '../types/debatTypes';
import { CacheFactory } from '../db/factories';

export default class DebatDirectAPIClient extends HttpClient {
    cache: CacheFactory;

    public constructor() {
        super(`${process.env.DEBAT_API}/`);
        this.cache = new CacheFactory();
    }

    public async getDay(day: string, forceDownload = false): Promise<DebatDay | boolean> {
        // try to fetch from database;
        let result = await this.cache.getCached<DebatDay | boolean>('day', day);
        if (!result || forceDownload) {
            result = await this.instance.get<string, DebatDay>(
                `${this.baseURL}agenda/${day}`,
            );
            this.cache.add('day', day, result);
        }
        return result;
    }
}

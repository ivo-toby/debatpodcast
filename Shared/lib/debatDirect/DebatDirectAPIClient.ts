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
        const results = await this.get<DebatDay | boolean>(`agenda/${day}`, forceDownload);
        return results;
    }
}

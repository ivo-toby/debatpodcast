import HttpClient from '../HttpClient';
import { DebatDay, DebateDetails } from './debatTypes';
import { CacheFactory } from '../db/factories';

export default class DebatDirectAPIClient extends HttpClient {
    cache: CacheFactory;

    public constructor() {
        super(`${process.env.DEBAT_API}/`);
        this.cache = new CacheFactory();
    }

    getDebatAPIDate(debateDate: Date) {
        return `${debateDate.getFullYear()}-${(`0${debateDate.getMonth() + 1}`).slice(-2)}-${(`0${debateDate.getDate()}`).slice(-2)}`;
    }

    public async getDay(day: Date, forceDownload = false): Promise<DebatDay> {
        return this.get<DebatDay>(`agenda/${this.getDebatAPIDate(day)}`, forceDownload);
    }

    public async getDebatDetails(date: Date, id: string, forceDownload = false): Promise<DebateDetails> {
        return this.get<DebateDetails>(`agenda/${this.getDebatAPIDate(date)}/debates/${id}`, forceDownload);
    }
}

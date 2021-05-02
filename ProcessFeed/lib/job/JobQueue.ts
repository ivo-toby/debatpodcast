import { DebatDay } from '../debatDirect/debatTypes';
import { AbstractJobType } from './types';

export default class JobQueue {
    private jobs: Array<AbstractJobType<DebatDay>> = [];

    add(job: AbstractJobType<DebatDay>) {
        this.jobs.push(job);
    }

    async run(): Promise<boolean> {
        const promises = this.jobs.map((job) => job.run());
        try {
            await Promise.all(promises);
            return true;
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
            return false;
        }
    }
}

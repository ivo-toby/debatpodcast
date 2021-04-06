import { AbstractJobType, QueueOptions } from './types';

export class JobQueue {
    private jobs: Array<AbstractJobType> = [];

    options: QueueOptions = {
        debateDate: new Date(),
        feedOptions: {
            author: '',
            feedUrl: '',
            siteUrl: '',
            imageUrl: '',

        },
    };

    constructor(options: QueueOptions) {
        this.options = options;
    }

    add(job: AbstractJobType) {
        this.jobs.push(job);
    }

    async run(): Promise<boolean> {
        const promises = this.jobs.map((job) => job.process(this.options));
        try {
            await Promise.all(promises);
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }
}

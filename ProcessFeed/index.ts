import { AzureFunction, Context } from '@azure/functions';
import JobQueue from './lib/job/JobQueue';
import jobFactory from './lib/job/jobFactory';
import { JobTypeEnum } from './lib/job/types';

const timerTrigger: AzureFunction = async (context: Context, myTimer: any): Promise<void> => {
    const timeStamp = new Date().toISOString();

    if (myTimer.isPastDue) {
        console.log('TIME PAST DUE');

        const queue = new JobQueue();
        /**
         * Create job object(s) to be run
         */
        const mainJob = jobFactory(JobTypeEnum.main, {
            debateDateStart: new Date('2021-04-29'),
            debateDateEnd: new Date('2021-06-28'),
        });
        queue.add(mainJob);

        await queue.run();

        console.log(mainJob.output());
    }
    context.log('Timer trigger function ran!', timeStamp);
};
export default timerTrigger;

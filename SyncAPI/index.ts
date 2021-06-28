import { AzureFunction, Context } from '@azure/functions';

const timerTrigger: AzureFunction = async (context: Context, myTimer: any): Promise<void> => {
    const timeStamp = new Date().toISOString();

    if (myTimer.isPastDue) {
        console.log('TIME PAST DUE');
    }
    context.log('Timer trigger function ran!', timeStamp);
};
export default timerTrigger;

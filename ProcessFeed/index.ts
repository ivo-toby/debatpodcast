import { AzureFunction, Context } from '@azure/functions';
import DebatDirectAPIClient from '../Shared/lib/debatDirect/DebatDirectAPIClient';

const timerTrigger: AzureFunction = async (context: Context, myTimer: any): Promise<void> => {
    const timeStamp = new Date().toISOString();

    if (myTimer.isPastDue) {
        console.log('TIME PAST DUE');
        const api = new DebatDirectAPIClient();
        const day = await api.getDay('2021-04-01');
    }
    context.log('Timer trigger function ran!', timeStamp);
};
export default timerTrigger;

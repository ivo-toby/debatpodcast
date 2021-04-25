import { FeedOptions } from 'podcast';

declare module '*.json' {
    const feedSettings: FeedOptions;
    export default feedSettings;
}

import { AbstractJobType } from '../job/types';

export type DebatPodcastPipelineContext = {
    job: AbstractJobType;
    messages?: Array<string>;
};

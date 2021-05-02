import { DebatDay } from '../debatDirect/debatTypes';
import { AbstractJobType } from '../job/types';

export type DebatPodcastPipelineContext = {
    job: AbstractJobType<DebatDay>;
    messages?: Array<string>;
};

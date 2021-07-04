import JobMain from './JobMain';
import JobDebates from './JobDebates';
import { AbstractJobType, JobTypeEnum, PodcastOptions } from './types';
import { DebatDay } from '@shared/lib/debatDirect/debatTypes';

export default function jobFactory(type: JobTypeEnum, options: PodcastOptions): AbstractJobType<DebatDay[]> {
    let job: AbstractJobType<DebatDay[]>;
    switch (type) {
        case JobTypeEnum.debates:
            // job = new JobDebates(options);
            break;
        case JobTypeEnum.main:
        default:
            job = new JobMain(options);
            break;
    }
    return job;
}

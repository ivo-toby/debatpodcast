import JobMain from './JobMain';
import JobDebates from './JobDebates';
import { AbstractJobType, JobTypeEnum, PodcastOptions } from './types';

export default function jobFactory(type: JobTypeEnum, options: PodcastOptions): AbstractJobType {
    let job: AbstractJobType;
    switch (type) {
        case JobTypeEnum.debates:
            job = new JobDebates(options);
            break;
        case JobTypeEnum.main:
        default:
            job = new JobMain(options);
            break;
    }
    return job;
}

import { JobMain } from './JobMain';
import { JobDebates } from './JobDebates';
import { AbstractJobType, JobTypeEnum } from './types';

export function jobFactory(type: JobTypeEnum): AbstractJobType {
    let job: AbstractJobType;
    switch (type) {
        case JobTypeEnum.debates:
            job = new JobDebates();
            break;
        case JobTypeEnum.main:
        default:
            job = new JobMain();
            break;
    }
    return job;
}

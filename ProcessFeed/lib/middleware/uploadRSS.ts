import { MiddlewareNext } from '@shared/lib/createPipeline';
import { DebatPodcastPipelineContext } from '../pipeline';

async function uploadRSS(
    profilePipelineCtx: DebatPodcastPipelineContext,
    next: MiddlewareNext,
): Promise<void> {
    const { job, messages } = profilePipelineCtx;

    next();
    return null;
}

export {
    uploadRSS,
};

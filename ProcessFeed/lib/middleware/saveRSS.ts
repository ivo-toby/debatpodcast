import { MiddlewareNext } from '../../../Shared/lib/createPipeline';
import { DebatPodcastPipelineContext } from '../pipeline';

async function saveRSS(
    profilePipelineCtx: DebatPodcastPipelineContext,
    next: MiddlewareNext,
): Promise<void> {
    const { job, messages } = profilePipelineCtx;

    next();
    return null;
}

export {
    saveRSS,
};

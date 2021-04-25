import { MiddlewareNext } from '../../../Shared/lib/createPipeline';
import { DebatPodcastPipelineContext } from '../pipeline';

async function saveStatus(
    profilePipelineCtx: DebatPodcastPipelineContext,
    next: MiddlewareNext,
): Promise<void> {
    const { job, messages } = profilePipelineCtx;

    next();
    return null;
}

export {
    saveStatus,
};

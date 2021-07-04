import { DebatPodcastPipelineContext } from './DebatPodcastPipelineContext';
import { createPipeline } from '@shared/lib/createPipeline';

const createDebatPodcastPipeline = () => createPipeline<DebatPodcastPipelineContext>();

export {
    createDebatPodcastPipeline,
};

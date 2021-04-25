import { DebatPodcastPipelineContext } from './DebatPodcastPipelineContext';
import { createPipeline } from '../../../Shared/lib/createPipeline';

const createDebatPodcastPipeline = () => createPipeline<DebatPodcastPipelineContext>();

export {
    createDebatPodcastPipeline,
};

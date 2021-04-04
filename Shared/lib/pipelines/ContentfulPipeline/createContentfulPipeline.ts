import { ContentfulPipelineContext } from './ContentfulPipelineContext';
import { createPipeline } from '../../createPipeline';

const createContentfulPipeline = () => createPipeline<ContentfulPipelineContext>();

export {
    createContentfulPipeline,
};

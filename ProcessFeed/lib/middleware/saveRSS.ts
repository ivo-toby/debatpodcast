import { BlobServiceClient, StorageSharedKeyCredential } from '@azure/storage-blob';
import { MiddlewareNext } from '@shared/lib/createPipeline';
import { DebatPodcastPipelineContext } from '../pipeline';

async function saveRSS(
    profilePipelineCtx: DebatPodcastPipelineContext,
    next: MiddlewareNext,
): Promise<void> {
    const { job, messages } = profilePipelineCtx;
    // Use StorageSharedKeyCredential with storage account and account
    // StorageSharedKeyCredential is only available in Node.js runtime, not in browsers
    const sharedKeyCredential = new StorageSharedKeyCredential(process.env.AZURE_STORAGE_ACCOUNT, process.env.AZURE_STORAGE_ACCESS_KEY);
    const blobServiceClient = new BlobServiceClient(
        `https://${process.env.AZURE_STORAGE_ACCOUNT}.blob.core.windows.net`,
        sharedKeyCredential,
    );

    const currentContainers = blobServiceClient.listContainers();
    let createContainer = true;
    // eslint-disable-next-line no-restricted-syntax
    for await (const container of currentContainers) {
        if (container.name === job.container) {
            createContainer = false;
            break;
        }
    }
    const containerClient = blobServiceClient.getContainerClient(job.container);

    if (createContainer) {
        const createContainerResponse = await containerClient.create();
        messages.push(`Create container ${job.container} successfully ${createContainerResponse.requestId}`);
    }

    // save file;
    const blockBlobClient = containerClient.getBlockBlobClient('feed.xml');
    const uploadBlobResponse = await blockBlobClient.upload(job.output(), job.output().length);
    messages.push(`Upload block blob feed.xml successfully, ${uploadBlobResponse.requestId}`);
    next();
    return null;
}

export {
    saveRSS,
};

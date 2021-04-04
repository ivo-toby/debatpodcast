// import { ValidationResult } from '@hapi/joi';
import AbstractTableStorageFactory from './AbstractTableStorageFactory';
import { ITableStorageModel } from './ITableStorageModel';
import { IJobEntity, JobEntitySchema } from '../entities/ITableEntities';

export default class JobFactory extends AbstractTableStorageFactory implements ITableStorageModel {
    PartitionKey = 'Job';

    tableName: string;

    constructor() {
        super('Job');
    }

    validateEntity(entity: IJobEntity): any {
        const res = JobEntitySchema.validate(entity);
        if (res.error) {
            throw new Error(res.error.message);
        }
        return res.value;
    }
}

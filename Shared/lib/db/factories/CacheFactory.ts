// import { ValidationResult } from '@hapi/joi';
import AbstractTableStorageFactory from './AbstractTableStorageFactory';
import { ITableStorageModel } from './ITableStorageModel';
import { ICacheEntity, CacheEntitySchema } from '../entities/ITableEntities';

export default class CacheFactory extends AbstractTableStorageFactory implements ITableStorageModel {
    PartitionKey = '';

    rowKey: string;

    tableName: string;

    constructor() {
        super('Cache');
    }

    validateEntity(entity: ICacheEntity): any {
        const res = CacheEntitySchema.validate(entity);
        if (res.error) {
            throw new Error(res.error.message);
        }
        return res.value;
    }

    getId() {
        return this.rowKey;
    }

    async getCached<T>(type: string, rowKey: string): Promise<T | boolean> {
        this.PartitionKey = type;
        await this.init();
        const record = await this.getById<ICacheEntity>(rowKey);
        if (record.data) {
            return JSON.parse(record.data);
        }
        return false;
    }
}

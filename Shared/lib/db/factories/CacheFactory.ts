// import { ValidationResult } from '@hapi/joi';
import AbstractTableStorageFactory from './AbstractTableStorageFactory';
import { ITableStorageModel } from './ITableStorageModel';
import { ICacheEntity, CacheEntitySchema, ITableEntity } from '../entities/ITableEntities';

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
        try {
            const record = await this.getById<ICacheEntity>(rowKey);
            if (record.data) {
                return JSON.parse(record.data);
            }
        } catch (e) {
            // not found, do nothing
        }
        return false;
    }

    async add<T>(type: string, rowKey: string, data: T): Promise<boolean> {
        this.PartitionKey = type;
        await this.init();
        const newEntity = {
            PartitionKey: type,
            RowKey: rowKey,
            data: JSON.stringify(data),
        };
        if (this.validateEntity(newEntity)) {
            try {
                await this.storage.AddOrMergeRecord(newEntity);
                return true;
            } catch (e) {
                return false;
            }
        }
        return false;
    }
}

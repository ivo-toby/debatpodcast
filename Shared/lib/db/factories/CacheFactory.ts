// import { ValidationResult } from '@hapi/joi';
import zlib from 'zlib';
import AbstractTableStorageFactory from './AbstractTableStorageFactory';
import { ITableStorageModel } from './ITableStorageModel';
import { ICacheEntity, CacheEntitySchema } from '../entities/ITableEntities';
import { createHash } from '../../createHash';

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
        const hashedRowKey = createHash(rowKey);
        try {
            const record = await this.getById<ICacheEntity>(hashedRowKey);
            if (record.data) {
                // eslint-disable-next-line no-buffer-constructor
                const deflated = zlib.inflateSync(new Buffer(record.data, 'base64')).toString();
                return JSON.parse(deflated);
            }
        } catch (e) {
            // not found, do nothing
        }
        return false;
    }

    async add<T>(type: string, rowKey: string, data: T): Promise<boolean> {
        this.PartitionKey = type;
        await this.init();
        const hashedRowKey = createHash(rowKey);
        const deflated = zlib.deflateSync(JSON.stringify(data)).toString('base64');
        const newEntity = {
            PartitionKey: type,
            RowKey: hashedRowKey,
            data: deflated,
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

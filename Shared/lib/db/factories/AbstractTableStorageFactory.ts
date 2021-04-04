import { TableQuery } from 'azure-storage';
import { Storage } from '../Storage';
import { ITableEntity } from '../entities/ITableEntities';
import { createGUID } from '../../createGUID';
import { ITableStorageModel } from './ITableStorageModel';

export default abstract class AbstractTableStorageFactory implements ITableStorageModel {
    storage: Storage;

    PartitionKey: string;

    tableName: string;

    constructor(tableName: string) {
        this.tableName = tableName;
    }

    validateEntity(newEntity: ITableEntity): any { // eslint-disable-line
        throw new Error('Method not implemented.');
    }

    async init(): Promise<void> {
        if (!this.storage) {
            this.storage = await Storage.Create(this.tableName);
        }
    }

    getId() {
        return createGUID();
    }

    public async create(entity: ITableEntity): Promise<ITableEntity> {
        await this.init();
        const newEntity = {
            ...entity,
            PartitionKey: this.PartitionKey,
            RowKey: this.getId(),
        };
        if (this.validateEntity(newEntity)) {
            await this.storage.AddOrMergeRecord(newEntity);
        }

        return newEntity;
    }

    public async get<T>(query: TableQuery): Promise<T[]> {
        await this.init();
        const results = await this.storage.Query<T>(query);
        return results;
    }

    public async getById<T>(id: string): Promise<T> {
        await this.init();
        try {
            const results = await this.storage.GetRecord<T>(this.PartitionKey, id);
            return results;
        } catch (e) {
            throw new Error(e);
        }
    }

    public async update(entity: ITableEntity): Promise<ITableEntity> {
        await this.init();
        const newEntity = {
            ...entity,
            PartitionKey: this.PartitionKey,
        };

        if (this.validateEntity(newEntity)) {
            await this.storage.AddOrMergeRecord(newEntity);
        }

        return newEntity;
    }

    public async delete(record: ITableEntity): Promise<boolean> {
        return this.storage.DeleteRecord(record);
    }

    public async batchDelete(query: TableQuery): Promise<number> {
        await this.init();
        return this.storage.BatchDelete(query);
    }
}

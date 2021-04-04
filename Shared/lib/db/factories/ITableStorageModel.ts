import { ITableEntity } from '../entities/ITableEntities';

export interface ITableStorageModel {
    tableName: string;
    PartitionKey: string;
    getId(): string;
    validateEntity(entity: ITableEntity): any;
}

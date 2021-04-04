// import { ValidationResult } from '@hapi/joi';
import AbstractTableStorageFactory from './AbstractTableStorageFactory';
import { ITableStorageModel } from './ITableStorageModel';
import { IContactMessageEntity, ContactMessageSchema } from '../entities/ITableEntities';

export default class ContactMessageFactory extends AbstractTableStorageFactory implements ITableStorageModel {
    PartitionKey = 'ContactMessage';

    tableName: string;

    constructor() {
        super('ContactMessage');
    }

    validateEntity(entity: IContactMessageEntity): any {
        const res = ContactMessageSchema.validate(entity);
        if (res.error) {
            throw new Error(res.error.message);
        }
        return res.value;
    }
}

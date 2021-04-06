import * as joi from '@hapi/joi';
/**
 * Create types from joi validation schema; https://rubensbits.co/posts/creating-interfaces-from-joi-schemas-in-typescript
 */
import 'joi-extract-type';

const AbstractTableEntitySchema = {
    PartitionKey: joi.string().optional(),
    RowKey: joi.string().optional(),
};

export const TableEntitySchema = joi.object(AbstractTableEntitySchema);
export type ITableEntity = joi.extractType<typeof TableEntitySchema>;

/** Sitevisits */
export const JobEntitySchema = joi.object({
    ...AbstractTableEntitySchema,
    jobType: joi.string().required(),
    status: joi.number().required(),
    dtCreated: joi.date().required(),
    agenda: joi.string().required(),
});

export type IJobEntity = joi.extractType<typeof JobEntitySchema>;

/** 404 */
export const CacheEntitySchema = joi.object({
    ...AbstractTableEntitySchema,
    data: joi.string().optional(),
});

export type ICacheEntity = joi.extractType<typeof CacheEntitySchema>;

/** Contact messages  */
export const ContactMessageSchema = joi.object({
    ...AbstractTableEntitySchema,
    email: joi.string().required(),
    name: joi.string().required(),
    message: joi.string().optional(),
});

export type IContactMessageEntity = joi.extractType<typeof ContactMessageSchema>;

import * as storage from 'azure-storage';
import { ITableEntity } from './entities/ITableEntities';

export class Storage {
    private tableService: storage.TableService;

    private tableName: string = 'default';

    get tableId(): string {
        return `${process.env.AZURE_STORAGE_TABLE_PREFIX}${this.tableName}`;
    }

    get partitionKey(): string {
        return this.tableId;
    }

    private constructor() {
        this.tableService = storage.createTableService();
    }

    static async Create(tableName: string): Promise<Storage> {
        const me = new Storage();
        me.tableName = tableName;
        await me.CreateIfDoesntExistTable();
        return me;
    }

    private async CreateIfDoesntExistTable(): Promise<storage.TableService.TableResult> {
        return new Promise((resolve, reject) => {
            try {
                this.tableService.createTableIfNotExists(this.tableName, (err, result) => {
                    if (err) throw err;
                    resolve(result);
                });
            } catch (err) {
                reject(err);
            }
        });
    }

    private tableRecordToJavacript<T extends ITableEntity>(entity: T): T {
        const result: any = {};
        Object.keys(entity).forEach((k) => {
            // we do not want to decode metadata
            if (k !== '.metadata') {
                const prop = Object.getOwnPropertyDescriptor(entity, k);
                if (prop) {
                    result[k] = prop.value._;
                }
            }
        });
        return result;
    }

    private convertToTableRecord<T extends ITableEntity>(entity: T) {
        const result: any = {};
        Object.keys(entity).forEach((k) => {
            const prop = Object.getOwnPropertyDescriptor(entity, k);
            if (prop) {
                result[k] = new storage.TableUtilities.entityGenerator.EntityProperty(
                    prop.value,
                );
            }
        });
        return result;
    }

    async GetRecord<T extends ITableEntity>(partitionKey: string, rowKey: string): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            this.tableService.retrieveEntity<T>(
                this.tableName,
                partitionKey,
                rowKey,
                (err, entity) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(this.tableRecordToJavacript(entity));
                    }
                },
            );
        });
    }

    private async runQuery<T extends ITableEntity>(
        query: storage.TableQuery,
        options?: storage.TableService.TableEntityRequestOptions,
        currentToken?: storage.TableService.TableContinuationToken,
    ): Promise<storage.TableService.QueryEntitiesResult<T>> {
        return new Promise<storage.TableService.QueryEntitiesResult<T>>((resolve) => {
            this.tableService.queryEntities<T>(
                this.tableName,
                query,
                currentToken,
                options,
                (err, entity) => {
                    if (err) throw err;
                    resolve(entity);
                },
            );
        });
    }

    async deleteInBatch(batch: storage.TableBatch): Promise<number> {
        return new Promise((resolve, reject) => {
            this.tableService.executeBatch(this.tableName, batch, (error, batchResult) => {
                if (!error) {
                    resolve(batch.size());
                } else {
                    reject(error);
                }
            });
        });
    }

    async BatchDelete(
        query: storage.TableQuery,
        options?: storage.TableService.TableEntityRequestOptions,
    ): Promise<number> {
        let keepLoop = true;
        let token: storage.TableService.TableContinuationToken;
        let deletionCount = 0;

        // TODO:  Check if there's a way to prevent infite loops
        while (keepLoop) {
            const result = await this.runQuery(query, options, token); //eslint-disable-line
            let batch = new storage.TableBatch();
            let current = 0;
            for (; current < result.entries.length;) {
                batch.deleteEntity(result.entries[current]);
                current += 1;
                if (batch.size() === 100) {
                    // eslint-disable-next-line no-await-in-loop
                    deletionCount += await this.deleteInBatch(batch);
                    batch = new storage.TableBatch();
                }
            }

            token = result.continuationToken;
            if (!token) {
                keepLoop = false;
                if (batch.size() > 0) {
                    // eslint-disable-next-line no-await-in-loop
                    deletionCount += await this.deleteInBatch(batch);
                }
            }
        }
        return deletionCount;
    }

    async Query<T extends ITableEntity>(
        query: storage.TableQuery,
        options?: storage.TableService.TableEntityRequestOptions,
        transformToJavascript: boolean = true,
    ): Promise<T[]> {
        let keepLoop = true;
        let token: storage.TableService.TableContinuationToken;
        const entries: Array<T> = [];

        // TODO:  Check if there's a way to prevent infite loops
        while (keepLoop) {
            const result = await this.runQuery<T>(query, options, token); //eslint-disable-line
            if (!transformToJavascript) {
                entries.push(...result.entries);
            } else {
                result.entries.forEach((entry) => {
                    const resolvedEntry = this.tableRecordToJavacript<T>(entry);
                    entries.push(resolvedEntry);
                });
            }

            token = result.continuationToken;
            if (!token) {
                keepLoop = false;
            }
        }
        return entries;
    }

    async AddOrMergeRecord<T extends ITableEntity>(record: T): Promise<T> {
        return new Promise((resolve, reject) => {
            try {
                const tableRecord = this.convertToTableRecord(record);
                this.tableService.insertOrMergeEntity(this.tableName, tableRecord, (err) => {
                    if (err) throw err;
                    resolve(record);
                });
            } catch (err) {
                reject(err);
            }
        });
    }

    async DeleteRecord<T extends ITableEntity>(record: T): Promise<boolean> {
        return new Promise((resolve, reject) => {
            try {
                const tableRecord = this.convertToTableRecord<T>(record);
                this.tableService.deleteEntity(this.tableName, tableRecord, (err, response) => {
                    if (err) throw err;
                    resolve(response.isSuccessful);
                });
            } catch (err) {
                reject(err);
            }
        });
    }
}

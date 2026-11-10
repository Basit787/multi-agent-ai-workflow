import { type InferInsertModel, type InferSelectModel, type SQL } from 'drizzle-orm';
import type { PgColumn, PgTable, PgUpdateSetSource } from 'drizzle-orm/pg-core';
type TableWithId = PgTable & {
    id: PgColumn;
};
export declare class DbService {
    readonly query: any;
    findById<T extends TableWithId>(table: T, id: number): Promise<InferSelectModel<T> | undefined>;
    insert<T extends PgTable>(table: T, values: InferInsertModel<T>): Promise<InferSelectModel<T>>;
    update<T extends TableWithId>(table: T, id: number, values: PgUpdateSetSource<T>): any;
    updateWhere<T extends PgTable>(table: T, where: SQL | undefined, values: PgUpdateSetSource<T>): any;
    delete<T extends TableWithId>(table: T, id: number): any;
}
export {};

import { Injectable } from '@nestjs/common';
import {
  eq,
  type InferInsertModel,
  type InferSelectModel,
  type SQL,
} from 'drizzle-orm';
import type { PgColumn, PgTable, PgUpdateSetSource } from 'drizzle-orm/pg-core';
import { db } from './db.client.js';

type TableWithId = PgTable & { id: PgColumn };

@Injectable()
export class DbService {
  readonly query = db.query;

  async findById<T extends TableWithId>(
    table: T,
    id: number,
  ): Promise<InferSelectModel<T> | undefined> {
    const rows = await db
      .select()
      .from(table as PgTable)
      .where(eq(table.id, id))
      .limit(1);
    return rows[0] as InferSelectModel<T> | undefined;
  }

  async insert<T extends PgTable>(
    table: T,
    values: InferInsertModel<T>,
  ): Promise<InferSelectModel<T>> {
    const rows = await db.insert(table).values(values).returning();
    return (rows as InferSelectModel<T>[])[0];
  }

  async update<T extends TableWithId>(
    table: T,
    id: number,
    values: PgUpdateSetSource<T>,
  ) {
    await db.update(table).set(values).where(eq(table.id, id));
  }

  async updateWhere<T extends PgTable>(
    table: T,
    where: SQL | undefined,
    values: PgUpdateSetSource<T>,
  ) {
    await db.update(table).set(values).where(where);
  }

  async delete<T extends TableWithId>(table: T, id: number) {
    await db.delete(table).where(eq(table.id, id));
  }
}

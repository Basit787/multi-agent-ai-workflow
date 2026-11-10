var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@nestjs/common';
import { eq, } from 'drizzle-orm';
import { db } from './db.client.js';
let DbService = class DbService {
    query = db.query;
    async findById(table, id) {
        const rows = await db
            .select()
            .from(table)
            .where(eq(table.id, id))
            .limit(1);
        return rows[0];
    }
    async insert(table, values) {
        const rows = await db.insert(table).values(values).returning();
        return rows[0];
    }
    async update(table, id, values) {
        await db.update(table).set(values).where(eq(table.id, id));
    }
    async updateWhere(table, where, values) {
        await db.update(table).set(values).where(where);
    }
    async delete(table, id) {
        await db.delete(table).where(eq(table.id, id));
    }
};
DbService = __decorate([
    Injectable()
], DbService);
export { DbService };
//# sourceMappingURL=db.service.js.map
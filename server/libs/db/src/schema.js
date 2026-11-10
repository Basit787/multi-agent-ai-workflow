import { relations } from 'drizzle-orm';
import { boolean, integer, pgTable, serial, text, timestamp, } from 'drizzle-orm/pg-core';
export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    name: text('name').notNull().default(''),
    email: text('email').notNull().unique(),
    emailVerified: boolean('email_verified').notNull().default(false),
    image: text('image'),
    role: text('role').notNull().default('user'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
export const sessions = pgTable('sessions', {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
    token: text('token').notNull().unique(),
    expiresAt: timestamp('expires_at').notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
export const accounts = pgTable('accounts', {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    password: text('password'),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at'),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
    scope: text('scope'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
export const verifications = pgTable('verifications', {
    id: serial('id').primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
export const workflows = pgTable('workflows', {
    id: serial('id').primaryKey(),
    task: text('task').notNull(),
    userId: integer('user_id').references(() => users.id),
    status: text('status').$type().notNull().default('completed'),
    completedAt: timestamp('completed_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});
export const workflowSteps = pgTable('workflow_steps', {
    id: serial('id').primaryKey(),
    workflowId: integer('workflow_id')
        .notNull()
        .references(() => workflows.id, { onDelete: 'cascade' }),
    agent: text('agent').notNull(),
    input: text('input').notNull(),
    output: text('output').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});
export const usersRelations = relations(users, ({ many }) => ({
    workflows: many(workflows),
    sessions: many(sessions),
    accounts: many(accounts),
}));
export const sessionsRelations = relations(sessions, ({ one }) => ({
    user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));
export const accountsRelations = relations(accounts, ({ one }) => ({
    user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));
export const workflowsRelations = relations(workflows, ({ many, one }) => ({
    steps: many(workflowSteps),
    user: one(users, { fields: [workflows.userId], references: [users.id] }),
}));
export const workflowStepsRelations = relations(workflowSteps, ({ one }) => ({
    workflow: one(workflows, {
        fields: [workflowSteps.workflowId],
        references: [workflows.id],
    }),
}));
//# sourceMappingURL=schema.js.map
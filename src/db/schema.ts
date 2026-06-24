import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("user"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const workflows = pgTable("workflows", {
  id: serial("id").primaryKey(),
  task: text("task").notNull(),
  userId: integer("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const workflowSteps = pgTable("workflow_steps", {
  id: serial("id").primaryKey(),
  workflowId: integer("workflow_id").notNull().references(() => workflows.id, { onDelete: "cascade" }),
  agent: text("agent").notNull(),
  input: text("input").notNull(),
  output: text("output").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Role = "user" | "admin";

export const usersRelations = relations(users, ({ many }) => ({ workflows: many(workflows) }));
export const workflowsRelations = relations(workflows, ({ many, one }) => ({
  steps: many(workflowSteps),
  user: one(users, { fields: [workflows.userId], references: [users.id] }),
}));
export const workflowStepsRelations = relations(workflowSteps, ({ one }) => ({
  workflow: one(workflows, { fields: [workflowSteps.workflowId], references: [workflows.id] }),
}));

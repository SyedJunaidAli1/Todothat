// src/db/schema.ts
import { relations } from "drizzle-orm";
import { pgTable, integer, text, boolean, serial, varchar, timestamp, unique } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  name: varchar("name", { length: 100 }),
  role: varchar("role", { length: 50 }).default("users"),
  emailVerified: boolean("emailverifiend").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull(),
  expiresAt: timestamp("expiress_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const verificationTokens = pgTable("verificationTokens", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull(),
  expiresAt: timestamp("expiress_at").notNull(),
  type: varchar("type", { length: 50 }).notNull() // e.g., "email_verification", "password_reset"
}, (table) => ({
  uniquetoken: unique().on(table.userId, table.type)
}))

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  verificationTokens: many(verificationTokens),
}))

export const sessionsRelation = relations(sessions, ({ one }) => ({
  users: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}))

export const verificationTokensRelations = relations(verificationTokens, ({ one }) => ({
  users: one(users, {
    fields: [verificationTokens.userId],
    references: [users.id],
  })
})
)

// Existing Todo Table (kept for continuity)
export const todo = pgTable("todo", {
  id: integer("id").primaryKey(),
  text: text("text").notNull(),
  done: boolean("done").default(false).notNull(),
});


export const schema = { users, sessions, verificationTokens, usersRelations, sessionsRelation, verificationTokensRelations, todo }
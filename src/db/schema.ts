import { pgTable, text, boolean, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// User table
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

// Session table
export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
});

// Account table
export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

// Verification table
export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

// Password Reset Token table
export const passwordResetToken = pgTable("password_reset_token", {
  id: uuid("id").primaryKey().defaultRandom(), // ✅ auto-generates a UUID
  email: text("email").notNull(),
  token: text("token").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Relations for all tables
export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  verifications: many(verification),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, { fields: [session.userId], references: [user.id] }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, { fields: [account.userId], references: [user.id] }),
}));

export const verificationRelations = relations(verification, ({ one }) => ({
  user: one(user, { fields: [verification.identifier], references: [user.email] }),
}));

export const passwordResetTokenRelations = relations(passwordResetToken, ({ one }) => ({
  user: one(user, { fields: [passwordResetToken.email], references: [user.email] }),
}));


// Todo table
export const todo = pgTable("todo", {
  id: text("id").primaryKey(), // optional: use serial if local-only, or text if associated with users from auth
  text: text("text").notNull(),
  done: boolean("done").default(false).notNull(),
});


export const schema = {
  user,
  session,
  account,
  verification,
  userRelations,
  sessionRelations,
  accountRelations,
  verificationRelations,
  todo,
  passwordResetToken,
  passwordResetTokenRelations,
};



import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, decimal, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// User roles and permissions
export const userRoles = mysqlTable("userRoles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  role: mysqlEnum("role", ["admin", "manager", "operator"]).notNull(),
  permissions: json("permissions").$type<string[]>().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserRole = typeof userRoles.$inferSelect;
export type InsertUserRole = typeof userRoles.$inferInsert;

// Instagram connected accounts
export const instagramAccounts = mysqlTable("instagramAccounts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  instagramUsername: varchar("instagramUsername", { length: 255 }).notNull(),
  instagramId: varchar("instagramId", { length: 255 }).notNull().unique(),
  accessToken: text("accessToken").notNull(),
  followers: int("followers").default(0).notNull(),
  engagement: decimal("engagement", { precision: 5, scale: 2 }).default("0").notNull(),
  status: mysqlEnum("status", ["active", "inactive", "suspended", "error"]).default("active").notNull(),
  lastSync: timestamp("lastSync"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type InstagramAccount = typeof instagramAccounts.$inferSelect;
export type InsertInstagramAccount = typeof instagramAccounts.$inferInsert;

// Automations
export const automations = mysqlTable("automations", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  accountId: int("accountId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  type: mysqlEnum("type", ["follow", "unfollow", "like", "comment", "story_view", "story_reaction"]).notNull(),
  targetFilters: json("targetFilters").$type<Record<string, unknown>>().notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  dailyLimit: int("dailyLimit").notNull(),
  delayMin: int("delayMin").notNull(), // milliseconds
  delayMax: int("delayMax").notNull(), // milliseconds
  humanBehavior: boolean("humanBehavior").default(true).notNull(),
  schedule: json("schedule").$type<Record<string, unknown>>(),
  actionsExecuted: int("actionsExecuted").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Automation = typeof automations.$inferSelect;
export type InsertAutomation = typeof automations.$inferInsert;

// Activity logs
export const activityLogs = mysqlTable("activityLogs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  accountId: int("accountId"),
  automationId: int("automationId"),
  action: varchar("action", { length: 255 }).notNull(),
  details: json("details").$type<Record<string, unknown>>(),
  riskLevel: mysqlEnum("riskLevel", ["low", "medium", "high", "critical"]).default("low").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export type ActivityLog = typeof activityLogs.$inferSelect;
export type InsertActivityLog = typeof activityLogs.$inferInsert;

// Analytics data
export const analytics = mysqlTable("analytics", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  accountId: int("accountId").notNull(),
  date: timestamp("date").notNull(),
  followersGained: int("followersGained").default(0).notNull(),
  followersLost: int("followersLost").default(0).notNull(),
  engagementRate: decimal("engagementRate", { precision: 5, scale: 2 }).default("0").notNull(),
  actionsExecuted: int("actionsExecuted").default(0).notNull(),
  conversionRate: decimal("conversionRate", { precision: 5, scale: 2 }).default("0").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Analytics = typeof analytics.$inferSelect;
export type InsertAnalytics = typeof analytics.$inferInsert;

// Audit logs for internal access tracking
export const auditLogs = mysqlTable("auditLogs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  action: varchar("action", { length: 255 }).notNull(),
  details: json("details").$type<Record<string, unknown>>(),
  ipAddress: varchar("ipAddress", { length: 45 }),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = typeof auditLogs.$inferInsert;
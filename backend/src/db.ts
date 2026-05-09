import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, instagramAccounts, automations, activityLogs, analytics, userRoles, auditLogs } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// User roles queries
export async function getUserRole(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(userRoles).where(eq(userRoles.userId, userId)).limit(1);
  return result[0];
}

export async function setUserRole(userId: number, role: string, permissions: string[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(userRoles).values({ userId, role: role as any, permissions }).onDuplicateKeyUpdate({
    set: { role: role as any, permissions },
  });
}

// Instagram accounts queries
export async function getUserInstagramAccounts(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(instagramAccounts).where(eq(instagramAccounts.userId, userId));
}

export async function addInstagramAccount(userId: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(instagramAccounts).values({ userId, ...data });
}

export async function deleteInstagramAccount(accountId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(instagramAccounts).where(eq(instagramAccounts.id, accountId));
}

export async function getInstagramAccountById(accountId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(instagramAccounts).where(eq(instagramAccounts.id, accountId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateInstagramAccount(accountId: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(instagramAccounts).set(data).where(eq(instagramAccounts.id, accountId));
}

// Automations queries
export async function getUserAutomations(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(automations).where(eq(automations.userId, userId));
}

export async function createAutomation(userId: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(automations).values({ userId, ...data });
}

export async function updateAutomation(automationId: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(automations).set(data).where(eq(automations.id, automationId));
}

export async function deleteAutomation(automationId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(automations).where(eq(automations.id, automationId));
}

// Activity logs queries
export async function getActivityLogs(userId: number, limit: number = 50) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(activityLogs).where(eq(activityLogs.userId, userId)).orderBy(desc(activityLogs.timestamp)).limit(limit);
}

export async function createActivityLog(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(activityLogs).values(data);
}

// Analytics queries
export async function getAnalytics(userId: number, accountId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(analytics).where(eq(analytics.userId, userId)).orderBy(desc(analytics.date));
}

export async function createAnalyticsRecord(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(analytics).values(data);
}

// API Keys queries
export async function logAuditEvent(userId: number, action: string, details?: Record<string, unknown>, ipAddress?: string) {
  const db = await getDb();
  if (!db) return null;
  return db.insert(auditLogs).values({ userId, action, details, ipAddress });
}

export async function getAuditLogs(limit: number = 50) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(auditLogs).orderBy(desc(auditLogs.timestamp)).limit(limit);
}

export async function getUserAuditLogs(userId: number, limit: number = 50) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(auditLogs).where(eq(auditLogs.userId, userId)).orderBy(desc(auditLogs.timestamp)).limit(limit);
}

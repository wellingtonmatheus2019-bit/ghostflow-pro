import { describe, it, expect, beforeEach, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock user context
const mockUser = {
  id: 1,
  openId: "test-user",
  email: "test@example.com",
  name: "Test User",
  loginMethod: "manus",
  role: "user" as const,
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
};

// Mock authenticated context
const createAuthContext = (): TrpcContext => ({
  user: mockUser,
  req: {
    protocol: "https",
    headers: {},
  } as TrpcContext["req"],
  res: {
    clearCookie: vi.fn(),
  } as any as TrpcContext["res"],
});

// Mock public context
const createPublicContext = (): TrpcContext => ({
  user: null,
  req: {
    protocol: "https",
    headers: {},
  } as TrpcContext["req"],
  res: {
    clearCookie: vi.fn(),
  } as any as TrpcContext["res"],
});



describe("Auth Router", () => {
  it("should return current user when authenticated", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const user = await caller.auth.me();
    expect(user).toEqual(mockUser);
  });

  it("should return null when not authenticated", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const user = await caller.auth.me();
    expect(user).toBeNull();
  });

  it("should logout user", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.logout();
    expect(result).toEqual({ success: true });
    expect(ctx.res.clearCookie).toHaveBeenCalled();
  });
});

describe("Instagram Accounts Router", () => {
  it("should require authentication to get accounts", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    try {
      await caller.instagramAccounts.getAll();
      expect.fail("Should have thrown error");
    } catch (error: any) {
      expect(error.code).toBe("UNAUTHORIZED");
    }
  });

  it("should get user instagram accounts when authenticated", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const accounts = await caller.instagramAccounts.getAll();
    expect(Array.isArray(accounts)).toBe(true);
  });
});

describe("Automations Router", () => {
  it("should require authentication to get automations", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    try {
      await caller.automations.getAll();
      expect.fail("Should have thrown error");
    } catch (error: any) {
      expect(error.code).toBe("UNAUTHORIZED");
    }
  });

  it("should get user automations when authenticated", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const automations = await caller.automations.getAll();
    expect(Array.isArray(automations)).toBe(true);
  });
});

describe("Activity Logs Router", () => {
  it("should require authentication to get logs", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    try {
      await caller.activityLogs.getRecent({ limit: 10 });
      expect.fail("Should have thrown error");
    } catch (error: any) {
      expect(error.code).toBe("UNAUTHORIZED");
    }
  });

  it("should get recent activity logs when authenticated", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const logs = await caller.activityLogs.getRecent({ limit: 10 });
    expect(Array.isArray(logs)).toBe(true);
  });
});

describe("Admin Users Router", () => {
  it("should require admin access", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    
    try {
      await caller.users.getAll();
      expect.fail("Should have thrown error");
    } catch (error: any) {
      expect(error.code).toBe("FORBIDDEN");
    }
  });
});

describe("Audit Logs Router", () => {
  it("should require admin access", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    
    try {
      await caller.auditLogs.getAll({ limit: 10 });
      expect.fail("Should have thrown error");
    } catch (error: any) {
      expect(error.code).toBe("FORBIDDEN");
    }
  });
});

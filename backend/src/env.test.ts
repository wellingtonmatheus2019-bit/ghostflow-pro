import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { ENV, validateEnv } from "./_core/env";

describe("Environment Configuration", () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("should load Instagram credentials from environment", () => {
    expect(ENV.instagramClientId).toBeDefined();
    expect(ENV.instagramClientSecret).toBeDefined();
    expect(ENV.instagramRedirectUri).toBeDefined();
  });

  it("should have valid Instagram Client ID format", () => {
    if (ENV.instagramClientId) {
      expect(ENV.instagramClientId).toMatch(/^\d+$/);
      expect(ENV.instagramClientId.length).toBeGreaterThan(0);
    }
  });

  it("should have valid Instagram Redirect URI format", () => {
    if (ENV.instagramRedirectUri) {
      expect(ENV.instagramRedirectUri).toMatch(/^https:\/\//);
      expect(ENV.instagramRedirectUri).toContain("callback");
    }
  });

  it("should validate environment configuration", () => {
    const validation = validateEnv();
    expect(validation).toHaveProperty("isValid");
    expect(validation).toHaveProperty("missing");
    expect(Array.isArray(validation.missing)).toBe(true);
  });

  it("should have database URL configured", () => {
    expect(ENV.databaseUrl).toBeDefined();
    expect(ENV.databaseUrl.length).toBeGreaterThan(0);
  });

  it("should have JWT secret configured", () => {
    expect(ENV.cookieSecret).toBeDefined();
    expect(ENV.cookieSecret.length).toBeGreaterThan(0);
  });

  it("should identify production environment correctly", () => {
    expect(typeof ENV.isProduction).toBe("boolean");
  });

  it("should have session secret configured", () => {
    expect(ENV.sessionSecret).toBeDefined();
  });
});

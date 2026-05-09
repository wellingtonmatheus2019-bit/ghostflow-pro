import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { instagramService } from "./_core/instagram";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";

// Admin-only procedure
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user?.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // User Management router (Admin only)
  users: router({
    getAll: adminProcedure.query(async () => {
      return [];
    }),
    create: adminProcedure
      .input(
        z.object({
          email: z.string().email(),
          name: z.string(),
          role: z.enum(["admin", "manager", "operator"]),
          permissions: z.array(z.string()).optional(),
        })
      )
      .mutation(async ({ input }) => {
        return { success: true, userId: 1 };
      }),
    updateRole: adminProcedure
      .input(
        z.object({
          userId: z.number(),
          role: z.enum(["admin", "manager", "operator"]),
          permissions: z.array(z.string()),
        })
      )
      .mutation(async ({ input }) => {
        await db.setUserRole(input.userId, input.role, input.permissions);
        return { success: true };
      }),
    delete: adminProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        return { success: true };
      }),
  }),

  // Audit Logs router (Admin only)
  auditLogs: router({
    getAll: adminProcedure
      .input(z.object({ limit: z.number().optional() }))
      .query(async ({ input }) => {
        return db.getAuditLogs(input.limit);
      }),
    getUserLogs: adminProcedure
      .input(z.object({ userId: z.number(), limit: z.number().optional() }))
      .query(async ({ input }) => {
        return db.getUserAuditLogs(input.userId, input.limit);
      }),
  }),

  // Instagram Accounts router
  instagramAccounts: router({
    getAll: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserInstagramAccounts(ctx.user.id);
    }),
    add: protectedProcedure
      .input(
        z.object({
          instagramUsername: z.string(),
          instagramId: z.string(),
          accessToken: z.string(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await db.logAuditEvent(ctx.user.id, "instagram_account_added", {
          username: input.instagramUsername,
        });
        return db.addInstagramAccount(ctx.user.id, input);
      }),
    delete: protectedProcedure
      .input(z.number())
      .mutation(async ({ ctx, input }) => {
        await db.logAuditEvent(ctx.user.id, "instagram_account_deleted", {
          accountId: input,
        });
        await db.deleteInstagramAccount(input);
        return { success: true };
      }),
  }),

  // Automations router
  automations: router({
    getAll: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserAutomations(ctx.user.id);
    }),
    create: protectedProcedure
      .input(
        z.object({
          accountId: z.number(),
          name: z.string(),
          type: z.enum(["follow", "unfollow", "like", "comment", "story_view", "story_reaction"]),
          targetFilters: z.record(z.string(), z.unknown()),
          dailyLimit: z.number(),
          delayMin: z.number(),
          delayMax: z.number(),
          humanBehavior: z.boolean().optional(),
          schedule: z.record(z.string(), z.unknown()).optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await db.logAuditEvent(ctx.user.id, "automation_created", {
          name: input.name,
          type: input.type,
        });
        return db.createAutomation(ctx.user.id, {
          ...input,
          humanBehavior: input.humanBehavior ?? true,
        });
      }),
    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          data: z.record(z.string(), z.unknown()),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await db.logAuditEvent(ctx.user.id, "automation_updated", {
          automationId: input.id,
        });
        await db.updateAutomation(input.id, input.data);
        return { success: true };
      }),
    delete: protectedProcedure
      .input(z.number())
      .mutation(async ({ ctx, input }) => {
        await db.logAuditEvent(ctx.user.id, "automation_deleted", {
          automationId: input,
        });
        await db.deleteAutomation(input);
        return { success: true };
      }),
  }),

  // Activity Logs router
  activityLogs: router({
    getRecent: protectedProcedure
      .input(z.object({ limit: z.number().optional() }))
      .query(async ({ ctx, input }) => {
        return db.getActivityLogs(ctx.user.id, input.limit);
      }),
  }),

  // Analytics router
  analytics: router({
    getByAccount: protectedProcedure
      .input(z.number())
      .query(async ({ ctx, input }) => {
        return db.getAnalytics(ctx.user.id, input);
      }),
  }),

  // Instagram OAuth router
  instagramOAuth: router({
    getAuthUrl: publicProcedure
      .query(() => {
        try {
          const state = Buffer.from(JSON.stringify({ timestamp: Date.now() })).toString("base64");
          const authUrl = instagramService.getAuthorizationUrl(state);
          return { authUrl, state };
        } catch (error) {
          console.error("[Instagram OAuth] Failed to generate auth URL:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to generate Instagram auth URL",
          });
        }
      }),
    handleCallback: publicProcedure
      .input(
        z.object({
          code: z.string(),
          state: z.string(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        try {
          const tokenResponse = await instagramService.exchangeCodeForToken(input.code);
          const userProfile = await instagramService.getUserProfile(tokenResponse.access_token);

          const account = await db.addInstagramAccount(ctx.user?.id || 1, {
            instagramUsername: userProfile.username,
            instagramId: userProfile.id,
            accessToken: tokenResponse.access_token,
          });

          if (ctx.user) {
            await db.logAuditEvent(ctx.user.id, "instagram_oauth_connected", {
              username: userProfile.username,
              instagramId: userProfile.id,
            });
          }

          return {
            success: true,
            account,
            profile: {
              username: userProfile.username,
              name: userProfile.name,
              profilePictureUrl: userProfile.profile_picture_url,
              followersCount: userProfile.followers_count,
            },
          };
        } catch (error) {
          console.error("[Instagram OAuth] Callback failed:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: error instanceof Error ? error.message : "Failed to authenticate with Instagram",
          });
        }
      }),
    syncAccount: protectedProcedure
      .input(z.number())
      .mutation(async ({ ctx, input }) => {
        try {
          const account = await db.getInstagramAccountById(input);
          if (!account) {
            throw new TRPCError({ code: "NOT_FOUND", message: "Account not found" });
          }

          const media = await instagramService.getUserMedia(account.accessToken, 25);

          await db.updateInstagramAccount(input, {
            lastSync: new Date(),
          });

          await db.logAuditEvent(ctx.user.id, "instagram_account_synced", {
            accountId: input,
            mediaCount: media.data.length,
          });

          return {
            success: true,
            mediaCount: media.data.length,
            lastSync: new Date(),
          };
        } catch (error) {
          console.error("[Instagram] Sync failed:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: error instanceof Error ? error.message : "Failed to sync Instagram account",
          });
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;

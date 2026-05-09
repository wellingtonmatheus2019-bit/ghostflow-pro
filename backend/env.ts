export const ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
  // Instagram/Meta OAuth
  instagramClientId: process.env.INSTAGRAM_CLIENT_ID ?? "",
  instagramClientSecret: process.env.INSTAGRAM_CLIENT_SECRET ?? "",
  instagramRedirectUri: process.env.INSTAGRAM_REDIRECT_URI ?? "",
  facebookAppId: process.env.FACEBOOK_APP_ID ?? "",
  facebookAppSecret: process.env.FACEBOOK_APP_SECRET ?? "",
  sessionSecret: process.env.SESSION_SECRET ?? "",
};

/**
 * Validar que as credenciais obrigatórias estão configuradas
 */
export function validateEnv() {
  const required = [
    { key: "INSTAGRAM_CLIENT_ID", value: ENV.instagramClientId },
    { key: "INSTAGRAM_CLIENT_SECRET", value: ENV.instagramClientSecret },
    { key: "INSTAGRAM_REDIRECT_URI", value: ENV.instagramRedirectUri },
    { key: "DATABASE_URL", value: ENV.databaseUrl },
    { key: "JWT_SECRET", value: ENV.cookieSecret },
  ];

  const missing = required.filter((item) => !item.value);

  if (missing.length > 0) {
    const missingKeys = missing.map((item) => item.key).join(", ");
    console.error(`[ENV] Variáveis de ambiente obrigatórias faltando: ${missingKeys}`);
    if (ENV.isProduction) {
      throw new Error(`Missing required environment variables: ${missingKeys}`);
    }
  }

  return {
    isValid: missing.length === 0,
    missing: missing.map((item) => item.key),
  };
}

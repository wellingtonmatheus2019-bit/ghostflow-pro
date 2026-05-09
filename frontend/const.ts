export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

/**
 * Obter URL de autenticacao Instagram OAuth
 * Valida se as credenciais estao configuradas
 */
export const getInstagramAuthUrl = () => {
  const clientId = import.meta.env.VITE_INSTAGRAM_CLIENT_ID;
  const redirectUri = `${window.location.origin}/auth/instagram/callback`;

  if (!clientId) {
    console.error("[Instagram] Client ID nao configurado");
    throw new Error("Instagram Client ID nao configurado");
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: "user_profile,user_media",
    response_type: "code",
  });

  return `https://api.instagram.com/oauth/authorize?${params.toString()}`;
};

// Generate login URL at runtime so redirect URI reflects the current origin.
export const getLoginUrl = () => {
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const appId = import.meta.env.VITE_APP_ID;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL(`${oauthPortalUrl}/app-auth`);
  url.searchParams.set("appId", appId);
  url.searchParams.set("redirectUri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("type", "signIn");

  return url.toString();
};

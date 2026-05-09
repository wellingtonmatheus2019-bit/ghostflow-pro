import axios from "axios";
import { ENV } from "./env";

const INSTAGRAM_GRAPH_API_URL = "https://graph.instagram.com/v18.0";

export interface InstagramUser {
  id: string;
  username: string;
  name: string;
  biography: string;
  profile_picture_url: string;
  followers_count: number;
  follows_count: number;
  media_count: number;
  website: string;
}

export interface InstagramAccessTokenResponse {
  access_token: string;
  user_id: string;
  token_type: string;
}

export interface InstagramUserMediaResponse {
  data: Array<{
    id: string;
    caption: string;
    media_type: string;
    media_url: string;
    timestamp: string;
    like_count: number;
    comments_count: number;
  }>;
  paging?: {
    cursors: {
      before: string;
      after: string;
    };
  };
}

export class InstagramService {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;

  constructor() {
    this.clientId = ENV.instagramClientId;
    this.clientSecret = ENV.instagramClientSecret;
    this.redirectUri = ENV.instagramRedirectUri;

    if (!this.clientId || !this.clientSecret || !this.redirectUri) {
      console.warn(
        "[InstagramService] Credenciais Instagram nao configuradas completamente"
      );
    }
  }

  /**
   * Generate Instagram OAuth authorization URL
   */
  getAuthorizationUrl(state: string): string {
    if (!this.clientId || !this.redirectUri) {
      const missing = [];
      if (!this.clientId) missing.push("INSTAGRAM_CLIENT_ID");
      if (!this.redirectUri) missing.push("INSTAGRAM_REDIRECT_URI");
      throw new Error(`Credenciais Instagram ausentes: ${missing.join(", ")}`);
    }

    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: "user_profile,user_media",
      response_type: "code",
      state,
    });

    return `https://api.instagram.com/oauth/authorize?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(code: string): Promise<InstagramAccessTokenResponse> {
    if (!this.clientId || !this.clientSecret || !this.redirectUri) {
      const missing = [];
      if (!this.clientId) missing.push("INSTAGRAM_CLIENT_ID");
      if (!this.clientSecret) missing.push("INSTAGRAM_CLIENT_SECRET");
      if (!this.redirectUri) missing.push("INSTAGRAM_REDIRECT_URI");
      throw new Error(`Credenciais Instagram ausentes: ${missing.join(", ")}`);
    }

    try {
      const response = await axios.post(
        `${INSTAGRAM_GRAPH_API_URL}/oauth/access_token`,
        {
          client_id: this.clientId,
          client_secret: this.clientSecret,
          grant_type: "authorization_code",
          redirect_uri: this.redirectUri,
          code,
        }
      );

      return response.data;
    } catch (error) {
      console.error("[Instagram] Failed to exchange code for token:", error);
      throw new Error("Failed to authenticate with Instagram");
    }
  }

  /**
   * Get user profile information
   */
  async getUserProfile(accessToken: string): Promise<InstagramUser> {
    try {
      const response = await axios.get(
        `${INSTAGRAM_GRAPH_API_URL}/me`,
        {
          params: {
            fields: "id,username,name,biography,profile_picture_url,followers_count,follows_count,media_count,website",
            access_token: accessToken,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("[Instagram] Failed to get user profile:", error);
      throw new Error("Failed to fetch Instagram profile");
    }
  }

  /**
   * Get user media (posts)
   */
  async getUserMedia(
    accessToken: string,
    limit: number = 25,
    after?: string
  ): Promise<InstagramUserMediaResponse> {
    try {
      const params: Record<string, any> = {
        fields: "id,caption,media_type,media_url,timestamp,like_count,comments_count",
        access_token: accessToken,
        limit,
      };

      if (after) {
        params.after = after;
      }

      const response = await axios.get(
        `${INSTAGRAM_GRAPH_API_URL}/me/media`,
        { params }
      );

      return response.data;
    } catch (error) {
      console.error("[Instagram] Failed to get user media:", error);
      throw new Error("Failed to fetch Instagram media");
    }
  }

  /**
   * Refresh access token (if using long-lived tokens)
   */
  async refreshAccessToken(accessToken: string): Promise<string> {
    try {
      const response = await axios.get(
        `${INSTAGRAM_GRAPH_API_URL}/refresh_access_token`,
        {
          params: {
            grant_type: "ig_refresh_token",
            access_token: accessToken,
          },
        }
      );

      return response.data.access_token;
    } catch (error) {
      console.error("[Instagram] Failed to refresh access token:", error);
      throw new Error("Failed to refresh Instagram token");
    }
  }

  /**
   * Get insights for a media item
   */
  async getMediaInsights(
    mediaId: string,
    accessToken: string
  ): Promise<Record<string, any>> {
    try {
      const response = await axios.get(
        `${INSTAGRAM_GRAPH_API_URL}/${mediaId}/insights`,
        {
          params: {
            metric: "engagement,impressions,reach",
            access_token: accessToken,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("[Instagram] Failed to get media insights:", error);
      throw new Error("Failed to fetch media insights");
    }
  }

  /**
   * Revoke access token
   */
  async revokeAccessToken(accessToken: string): Promise<boolean> {
    try {
      await axios.delete(
        `${INSTAGRAM_GRAPH_API_URL}/me/permissions`,
        {
          params: {
            access_token: accessToken,
          },
        }
      );

      return true;
    } catch (error) {
      console.error("[Instagram] Failed to revoke access token:", error);
      return false;
    }
  }
}

export const instagramService = new InstagramService();

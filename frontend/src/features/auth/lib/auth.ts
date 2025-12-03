import { setCookie, destroyCookie, parseCookies } from 'nookies';

const TOKEN_KEY = process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || 'auth_token';

export interface AuthTokens {
  token: string;
  expAt: string;
}

export const authUtils = {
  saveTokens: (tokens: AuthTokens, ctx?: any) => {
    setCookie(ctx, TOKEN_KEY, JSON.stringify(tokens), {
      maxAge: 60 * 60,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
  },

  getTokens: (ctx?: any): AuthTokens | null => {
    const cookies = parseCookies(ctx);
    const tokenCookie = cookies[TOKEN_KEY];
    
    if (!tokenCookie) return null;
    
    try {
      return JSON.parse(tokenCookie);
    } catch {
      return null;
    }
  },

  removeTokens: (ctx?: any) => {
    destroyCookie(ctx, TOKEN_KEY, { path: '/' });
  },

  isTokenExpired: (tokens: AuthTokens): boolean => {
    return new Date(tokens.expAt) <= new Date();
  },

  getAuthToken: (ctx: any): string | null => {
    const tokens = authUtils.getTokens(ctx);
    if (!tokens || authUtils.isTokenExpired(tokens)) {
      authUtils.removeTokens(ctx);
      return null;
    }
    return tokens.token;
  }
};

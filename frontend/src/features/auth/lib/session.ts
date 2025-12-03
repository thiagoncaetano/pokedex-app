import { authUtils } from './auth';
import { Token, User } from '@/shared/models/auth';
import type { GetServerSidePropsContext } from 'next';

export class SessionEntity {
  public tokens!: Token;
  public currentUser!: User;

  static getToken(ctx: GetServerSidePropsContext) {
    const tokens = authUtils.getTokens(ctx);
    return tokens;
  }

  async getCurrentUser() {
    if (this.currentUser) return this.currentUser;
    
    const apiURL = process.env.API_URL || 'http://localhost:3001';
    const response = await fetch(`${apiURL}/auth/me`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.tokens.token}`
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const userData = await response.json();
    this.currentUser = userData.user;
    return this.currentUser;
  }

  static async get(ctx: GetServerSidePropsContext) {
    const tokens = SessionEntity.getToken(ctx);
    if (!tokens || authUtils.isTokenExpired(tokens)) return null;
    
    const session = new SessionEntity();
    session.tokens = tokens;
    
    try {
      await session.getCurrentUser();
      return session;
    } catch (error: any) {
      return null;
    }
  }
}

import { LoginResponse, MeResponse } from '../model/auth.model';
import { LoginFormData } from '../model/login/login.schema';
import { routes } from '@/routes';
import { authUtils } from '../lib/auth';

export class LoginAdapter {
  async login(data: LoginFormData): Promise<LoginResponse> {
    const res = await fetch(routes.api.login, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message || 'Login failed');
    }

    const loginData = await res.json();
    
    authUtils.saveTokens({
      token: loginData.token.token,
      expAt: loginData.token.expAt
    });

    return loginData;
  }

  async logout(): Promise<void> {
    try {
      const token = authUtils.getAuthToken();
      if (token) {
        await fetch('/api/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      authUtils.removeTokens();
    }
  }

  async getSession(): Promise<MeResponse | null> {
    try {
      const token = authUtils.getAuthToken();
      if (!token) return null;

      const res = await fetch(routes.api.me, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) return null;
      return res.json();
    } catch {
      return null;
    }
  }
}
import { User, AuthResponse } from '@/shared/models/auth';
import { LoginFormData } from '../model/login/login.schema';
import { routes } from '@/routes';
import { authUtils } from '@/features/auth/lib/auth';

export class AuthAdapter {
  async login(data: LoginFormData): Promise<AuthResponse> {
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
    await fetch(routes.api.logout, {
      method: 'POST'
    });
  }
}
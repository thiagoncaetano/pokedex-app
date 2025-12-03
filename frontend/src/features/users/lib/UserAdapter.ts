import { User, AuthResponse } from '@/shared/models/auth';
import { UserSignupFormData } from '../model/signup.schema';
import { routes } from '@/routes';
import { authUtils } from '@/features/auth/lib/auth';


export class UserAdapter {
  async signup(data: UserSignupFormData): Promise<AuthResponse> {
    const res = await fetch(routes.api.signup, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message || 'Signup failed');
    }

    const signupData = await res.json();
    
    if (signupData.token) {
      authUtils.saveTokens({
        token: signupData.token.token,
        expAt: signupData.token.expAt
      });
    }
    
    return signupData;
  }
}

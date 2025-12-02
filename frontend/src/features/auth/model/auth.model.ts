import type { User } from '@/features/users/model/user.model';

export interface Session {
  id: string;
  expAt: string;
  isActive: boolean;
}

export interface LoginResponse {
  user: User;
  session: Session;
  token: {
    token: string;
    expAt: string;
  };
}

export interface MeResponse {
  user: User;
}

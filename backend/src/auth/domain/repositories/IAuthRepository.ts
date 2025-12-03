import { User } from '../../../users/domain/entities/User';

export const AUTH_REPOSITORY_TOKEN = 'AuthRepository';

export interface AuthRepository {
  findByUsername(username: string): Promise<User | null>;
  save(user: User): Promise<void>;
}

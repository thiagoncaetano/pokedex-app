import { User } from '../entities/User';

export const USER_REPOSITORY_TOKEN = 'UserRepository';

export interface UserRepository {
  findByUsername(username: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<void>;
}

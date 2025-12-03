import { SessionEntity } from '../../infra/entities/session.entity';

export interface SessionRepository {
  create(session: Partial<SessionEntity>): Promise<SessionEntity>;
  findById(id: string): Promise<SessionEntity | null>;
  findByUserId(userId: string): Promise<SessionEntity[]>;
  findValidByUserId(userId: string): Promise<SessionEntity[]>;
  save(session: SessionEntity): Promise<SessionEntity>;
  deactivate(id: string): Promise<void>;
  deactivateAllByUserId(userId: string): Promise<void>;
  cleanExpired(): Promise<void>;
}

export const SESSION_REPOSITORY_TOKEN = 'SESSION_REPOSITORY_TOKEN';

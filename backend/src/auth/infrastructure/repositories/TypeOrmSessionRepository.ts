import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { SessionEntity } from '../entities/session.entity';
import { SessionRepository, SESSION_REPOSITORY_TOKEN } from '../../domain/repositories/ISessionRepository';

@Injectable()
export class TypeOrmSessionRepository implements SessionRepository {
  constructor(
    @InjectRepository(SessionEntity)
    private readonly sessionRepo: Repository<SessionEntity>,
  ) {}

  async create(sessionData: Partial<SessionEntity>): Promise<SessionEntity> {
    const session = this.sessionRepo.create(sessionData);
    return await this.sessionRepo.save(session);
  }

  async findById(id: string): Promise<SessionEntity | null> {
    return await this.sessionRepo.findOne({ 
      where: { id },
      relations: ['user']
    });
  }

  async findByUserId(userId: string): Promise<SessionEntity[]> {
    return await this.sessionRepo.find({ 
      where: { userId },
      relations: ['user'],
      order: { createdAt: 'DESC' }
    });
  }

  async findValidByUserId(userId: string): Promise<SessionEntity[]> {
    return await this.sessionRepo.find({
      where: {
        userId,
        isActive: true,
      },
      relations: ['user'],
      order: { createdAt: 'DESC' }
    });
  }

  async save(session: SessionEntity): Promise<SessionEntity> {
    return await this.sessionRepo.save(session);
  }

  async deactivate(id: string): Promise<void> {
    await this.sessionRepo.update(id, {
      isActive: false
    });
  }

  async deactivateAllByUserId(userId: string): Promise<void> {
    await this.sessionRepo.update(
      { userId, isActive: true },
      {
        isActive: false
      }
    );
  }

  async cleanExpired(): Promise<void> {
    await this.sessionRepo.delete({
      expAt: LessThan(new Date())
    });
  }
}

export const TypeOrmSessionRepositoryProvider = {
  provide: SESSION_REPOSITORY_TOKEN,
  useClass: TypeOrmSessionRepository,
};

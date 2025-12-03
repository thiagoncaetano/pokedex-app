import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { UserRepository, USER_REPOSITORY_TOKEN } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';

@Injectable()
export class TypeOrmUserRepository implements UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repo: Repository<UserEntity>,
  ) {}

  async findByUsername(username: string): Promise<User | null> {
    const entity = await this.repo.findOne({ where: { username } });
    if (!entity) return null;

    return new User(entity.id, entity.username, entity.password);
  }

  async findById(id: string): Promise<User | null> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) return null;

    return new User(entity.id, entity.username, entity.password);
  }

  async save(user: User): Promise<void> {
    const entity = new UserEntity();
    entity.id = user.id;
    entity.username = user.username;
    entity.password = user.passwordHash;

    await this.repo.save(entity);
  }
}

export const TypeOrmUserRepositoryProvider = {
  provide: USER_REPOSITORY_TOKEN,
  useClass: TypeOrmUserRepository,
};

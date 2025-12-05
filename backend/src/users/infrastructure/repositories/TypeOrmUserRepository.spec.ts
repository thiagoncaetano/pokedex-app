import { Repository } from 'typeorm';
import { TypeOrmUserRepository } from './TypeOrmUserRepository';
import { UserEntity } from '../entities/user.entity';
import { User } from '../../domain/entities/User';

describe('TypeOrmUserRepository', () => {
  let ormRepo: jest.Mocked<Repository<UserEntity>>;
  let repo: TypeOrmUserRepository;

  beforeEach(() => {
    ormRepo = {
      findOne: jest.fn(),
      save: jest.fn(),
    } as any;

    repo = new TypeOrmUserRepository(ormRepo as any);
  });

  describe('findByUsername', () => {
    it('should return User when entity is found', async () => {
      const entity: UserEntity = {
        id: 'user-1',
        username: 'ash',
        password: 'hashed',
      } as UserEntity;

      ormRepo.findOne.mockResolvedValue(entity);

      const result = await repo.findByUsername('ash');

      expect(ormRepo.findOne).toHaveBeenCalledTimes(1);
      expect(ormRepo.findOne).toHaveBeenCalledWith({ where: { username: 'ash' } });

      expect(result).toBeInstanceOf(User);
      expect(result?.id).toBe('user-1');
      expect(result?.username).toBe('ash');
      expect(result?.passwordHash).toBe('hashed');
    });

    it('should return null when entity is not found', async () => {
      ormRepo.findOne.mockResolvedValue(null);

      const result = await repo.findByUsername('unknown');

      expect(ormRepo.findOne).toHaveBeenCalledTimes(1);
      expect(ormRepo.findOne).toHaveBeenCalledWith({ where: { username: 'unknown' } });
      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('should return User when entity is found', async () => {
      const entity: UserEntity = {
        id: 'user-1',
        username: 'ash',
        password: 'hashed',
      } as UserEntity;

      ormRepo.findOne.mockResolvedValue(entity);

      const result = await repo.findById('user-1');

      expect(ormRepo.findOne).toHaveBeenCalledTimes(1);
      expect(ormRepo.findOne).toHaveBeenCalledWith({ where: { id: 'user-1' } });

      expect(result).toBeInstanceOf(User);
      expect(result?.id).toBe('user-1');
      expect(result?.username).toBe('ash');
      expect(result?.passwordHash).toBe('hashed');
    });

    it('should return null when entity is not found', async () => {
      ormRepo.findOne.mockResolvedValue(null);

      const result = await repo.findById('user-1');

      expect(ormRepo.findOne).toHaveBeenCalledTimes(1);
      expect(ormRepo.findOne).toHaveBeenCalledWith({ where: { id: 'user-1' } });
      expect(result).toBeNull();
    });
  });

  describe('save', () => {
    it('should map User to UserEntity and call save on TypeORM repository', async () => {
      const user = new User('user-1', 'ash', 'hashed');

      ormRepo.save.mockResolvedValue({} as any);

      await repo.save(user);

      expect(ormRepo.save).toHaveBeenCalledTimes(1);
      const savedEntity = (ormRepo.save as jest.Mock).mock.calls[0][0] as UserEntity;

      expect(savedEntity.id).toBe('user-1');
      expect(savedEntity.username).toBe('ash');
      expect(savedEntity.password).toBe('hashed');
    });
  });
});

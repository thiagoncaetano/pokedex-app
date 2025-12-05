import { Repository, LessThan } from 'typeorm';
import { TypeOrmSessionRepository } from './TypeOrmSessionRepository';
import { SessionEntity } from '../entities/session.entity';

jest.mock('typeorm', () => {
  const actual = jest.requireActual('typeorm');
  return {
    ...actual,
    LessThan: (value: any) => ({ _type: 'lessThan', value }),
  };
});

describe('TypeOrmSessionRepository', () => {
  let ormRepo: jest.Mocked<Repository<SessionEntity>>;
  let repo: TypeOrmSessionRepository;

  beforeEach(() => {
    ormRepo = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;

    repo = new TypeOrmSessionRepository(ormRepo as any);
  });

  it('create should delegate to TypeORM repository and return saved session', async () => {
    const partial: Partial<SessionEntity> = { userId: 'user-1' };
    const created = { id: 'session-1', userId: 'user-1' } as SessionEntity;

    ormRepo.create.mockReturnValue(created);
    ormRepo.save.mockResolvedValue(created);

    const result = await repo.create(partial);

    expect(ormRepo.create).toHaveBeenCalledTimes(1);
    expect(ormRepo.create).toHaveBeenCalledWith(partial);
    expect(ormRepo.save).toHaveBeenCalledTimes(1);
    expect(ormRepo.save).toHaveBeenCalledWith(created);
    expect(result).toBe(created);
  });

  it('findById should call findOne with correct where and relations', async () => {
    const session = { id: 'session-1' } as SessionEntity;
    ormRepo.findOne.mockResolvedValue(session);

    const result = await repo.findById('session-1');

    expect(ormRepo.findOne).toHaveBeenCalledTimes(1);
    expect(ormRepo.findOne).toHaveBeenCalledWith({
      where: { id: 'session-1' },
      relations: ['user'],
    });
    expect(result).toBe(session);
  });

  it('findByUserId should call find with correct where, relations and order', async () => {
    const sessions: SessionEntity[] = [];
    ormRepo.find.mockResolvedValue(sessions);

    const result = await repo.findByUserId('user-1');

    expect(ormRepo.find).toHaveBeenCalledTimes(1);
    expect(ormRepo.find).toHaveBeenCalledWith({
      where: { userId: 'user-1' },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
    expect(result).toBe(sessions);
  });

  it('findValidByUserId should filter by userId and isActive true', async () => {
    const sessions: SessionEntity[] = [];
    ormRepo.find.mockResolvedValue(sessions);

    const result = await repo.findValidByUserId('user-1');

    expect(ormRepo.find).toHaveBeenCalledTimes(1);
    expect(ormRepo.find).toHaveBeenCalledWith({
      where: {
        userId: 'user-1',
        isActive: true,
      },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
    expect(result).toBe(sessions);
  });

  it('save should delegate to TypeORM save', async () => {
    const session = { id: 'session-1' } as SessionEntity;
    ormRepo.save.mockResolvedValue(session);

    const result = await repo.save(session);

    expect(ormRepo.save).toHaveBeenCalledTimes(1);
    expect(ormRepo.save).toHaveBeenCalledWith(session);
    expect(result).toBe(session);
  });

  it('deactivate should update session isActive to false', async () => {
    ormRepo.update.mockResolvedValue({} as any);

    await repo.deactivate('session-1');

    expect(ormRepo.update).toHaveBeenCalledTimes(1);
    expect(ormRepo.update).toHaveBeenCalledWith('session-1', { isActive: false });
  });

  it('deactivateAllByUserId should update all active sessions for user to inactive', async () => {
    ormRepo.update.mockResolvedValue({} as any);

    await repo.deactivateAllByUserId('user-1');

    expect(ormRepo.update).toHaveBeenCalledTimes(1);
    expect(ormRepo.update).toHaveBeenCalledWith(
      { userId: 'user-1', isActive: true },
      { isActive: false },
    );
  });

  it('cleanExpired should delete sessions with expAt less than now', async () => {
    ormRepo.delete.mockResolvedValue({} as any);

    const now = new Date();
    const beforeCall = Date.now();

    await repo.cleanExpired();

    expect(ormRepo.delete).toHaveBeenCalledTimes(1);
    const arg = (ormRepo.delete as jest.Mock).mock.calls[0][0];
    expect(arg.expAt._type).toBe('lessThan');
    expect(arg.expAt.value instanceof Date).toBe(true);
    expect(arg.expAt.value.getTime()).toBeGreaterThanOrEqual(beforeCall - 10);
  });
});

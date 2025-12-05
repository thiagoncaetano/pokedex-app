import { Test, TestingModule } from '@nestjs/testing';
import { SignupUseCase, SignupCommand, SignupResult } from './SignupUseCase';
import { USER_REPOSITORY_TOKEN, UserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';
import { ConflictError } from '../../../common/errors/HTTPError';

describe('SignupUseCase', () => {
  let useCase: SignupUseCase;
  let userRepo: jest.Mocked<UserRepository>;

  beforeEach(async () => {
    const userRepoMock: Partial<jest.Mocked<UserRepository>> = {
      findByUsername: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignupUseCase,
        { provide: USER_REPOSITORY_TOKEN, useValue: userRepoMock },
      ],
    }).compile();

    useCase = module.get(SignupUseCase);
    userRepo = module.get(USER_REPOSITORY_TOKEN);
  });

  describe('execute', () => {
    it('should create new user and persist when username does not exist', async () => {
      const command: SignupCommand = {
        username: 'ash',
        password: 'pikachu123',
      };

      (userRepo.findByUsername as jest.Mock).mockResolvedValue(null);

      const createdUser: Partial<User> = {
        id: 'user-1',
        username: 'ash',
      };

      const createSpy = jest.spyOn(User, 'create').mockResolvedValue(createdUser as User);

      const result: SignupResult = await useCase.execute(command);

      expect(userRepo.findByUsername).toHaveBeenCalledTimes(1);
      expect(userRepo.findByUsername).toHaveBeenCalledWith('ash');

      expect(createSpy).toHaveBeenCalledTimes(1);
      const createArgs = createSpy.mock.calls[0][0];
      expect(createArgs.username).toBe('ash');
      expect(createArgs.password).toBe('pikachu123');
      expect(typeof createArgs.id).toBe('string');

      expect(userRepo.save).toHaveBeenCalledTimes(1);
      expect(userRepo.save).toHaveBeenCalledWith(createdUser);

      expect(result).toEqual({
        user: {
          id: 'user-1',
          username: 'ash',
        },
      });
    });

    it('should throw ConflictError when username already exists', async () => {
      const command: SignupCommand = {
        username: 'ash',
        password: 'pikachu123',
      };

      const existingUser: Partial<User> = {
        id: 'user-1',
        username: 'ash',
      };

      (userRepo.findByUsername as jest.Mock).mockResolvedValue(existingUser as User);

      await expect(useCase.execute(command)).rejects.toThrow(ConflictError);
      await expect(useCase.execute(command)).rejects.toThrow('Username already exists');
      expect(userRepo.save).not.toHaveBeenCalled();
    });
  });
});

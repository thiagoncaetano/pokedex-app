import { Test, TestingModule } from '@nestjs/testing';
import { LoginUseCase, LoginCommand, LoginResult } from './LoginUseCase';
import { USER_REPOSITORY_TOKEN, UserRepository } from '../../../users/domain/repositories/IUserRepository';
import { SESSION_REPOSITORY_TOKEN, SessionRepository } from '../../domain/repositories/ISessionRepository';
import { AuthDomainService } from '../../domain/services/AuthDomainService';
import { JwtDomainService } from '../../domain/services/JwtService';
import { UnauthorizedError } from '../../../common/errors/HTTPError';

describe('LoginUseCase', () => {
  let useCase: LoginUseCase;
  let userRepo: jest.Mocked<UserRepository>;
  let sessionRepo: jest.Mocked<SessionRepository>;
  let domain: jest.Mocked<AuthDomainService>;
  let jwtService: jest.Mocked<JwtDomainService>;

  beforeEach(async () => {
    const userRepoMock: Partial<jest.Mocked<UserRepository>> = {
      findByUsername: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
    };

    const sessionRepoMock: Partial<jest.Mocked<SessionRepository>> = {
      save: jest.fn(),
    } as Partial<jest.Mocked<SessionRepository>>;

    const domainMock: Partial<jest.Mocked<AuthDomainService>> = {
      validateUser: jest.fn(),
    };

    const jwtServiceMock: Partial<jest.Mocked<JwtDomainService>> = {
      generateAccessToken: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginUseCase,
        { provide: USER_REPOSITORY_TOKEN, useValue: userRepoMock },
        { provide: SESSION_REPOSITORY_TOKEN, useValue: sessionRepoMock },
        { provide: AuthDomainService, useValue: domainMock },
        { provide: JwtDomainService, useValue: jwtServiceMock },
      ],
    }).compile();

    useCase = module.get(LoginUseCase);
    userRepo = module.get(USER_REPOSITORY_TOKEN);
    sessionRepo = module.get(SESSION_REPOSITORY_TOKEN);
    domain = module.get(AuthDomainService);
    jwtService = module.get(JwtDomainService);
  });

  describe('execute', () => {
    it('should login successfully, create session and return user + token', async () => {
      const command: LoginCommand = {
        username: 'ash',
        password: 'pikachu123',
      };

      const user: any = {
        id: 'user-1',
        username: 'ash',
      };

      (userRepo.findByUsername as jest.Mock).mockResolvedValue(user);
      (domain.validateUser as jest.Mock).mockResolvedValue(true);

      const tokenResult = {
        token: 'jwt-token',
        expAt: new Date('2025-01-01T00:00:00.000Z'),
      };
      (jwtService.generateAccessToken as jest.Mock).mockReturnValue(tokenResult);

      (sessionRepo.save as jest.Mock).mockImplementation(async (session: any) => session);

      const result: LoginResult = await useCase.execute(command);

      expect(userRepo.findByUsername).toHaveBeenCalledTimes(1);
      expect(userRepo.findByUsername).toHaveBeenCalledWith('ash');

      expect(domain.validateUser).toHaveBeenCalledTimes(1);
      expect(domain.validateUser).toHaveBeenCalledWith(user, 'pikachu123');

      expect(sessionRepo.save).toHaveBeenCalledTimes(1);
      const savedSession = (sessionRepo.save as jest.Mock).mock.calls[0][0];
      expect(savedSession.userId).toBe('user-1');
      expect(savedSession.isActive).toBe(true);
      expect(savedSession.expAt).toBeInstanceOf(Date);

      expect(jwtService.generateAccessToken).toHaveBeenCalledTimes(1);
      expect(jwtService.generateAccessToken).toHaveBeenCalledWith(savedSession.id, 'user-1');

      expect(result).toEqual({
        user: {
          id: 'user-1',
          username: 'ash',
        },
        token: tokenResult,
      });
    });

    it('should throw UnauthorizedError when user is not found', async () => {
      const command: LoginCommand = {
        username: 'unknown',
        password: 'password',
      };

      (userRepo.findByUsername as jest.Mock).mockResolvedValue(null);

      await expect(useCase.execute(command)).rejects.toThrow(UnauthorizedError);
      await expect(useCase.execute(command)).rejects.toThrow('Invalid credentials');
    });

    it('should throw UnauthorizedError when password is invalid', async () => {
      const command: LoginCommand = {
        username: 'ash',
        password: 'wrong-password',
      };

      const user: any = {
        id: 'user-1',
        username: 'ash',
      };

      (userRepo.findByUsername as jest.Mock).mockResolvedValue(user);
      (domain.validateUser as jest.Mock).mockResolvedValue(false);

      await expect(useCase.execute(command)).rejects.toThrow(UnauthorizedError);
      await expect(useCase.execute(command)).rejects.toThrow('Invalid credentials');
    });
  });
});

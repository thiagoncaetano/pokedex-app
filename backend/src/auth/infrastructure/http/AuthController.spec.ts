import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './AuthController';
import { LoginUseCase, LoginResult } from '../../application/use-cases/LoginUseCase';
import { SESSION_REPOSITORY_TOKEN, SessionRepository } from '../../domain/repositories/ISessionRepository';
import { JwtDomainService } from '../../domain/services/JwtService';
import { LoginDto } from '../../application/dto/LoginDto';

describe('AuthController', () => {
  let controller: AuthController;
  let loginUseCase: jest.Mocked<LoginUseCase>;
  let sessionRepository: jest.Mocked<SessionRepository>;

  beforeEach(async () => {
    const loginUseCaseMock: Partial<jest.Mocked<LoginUseCase>> = {
      execute: jest.fn(),
    };

    const sessionRepositoryMock: Partial<jest.Mocked<SessionRepository>> = {
      deactivate: jest.fn(),
    };

    const jwtDomainServiceMock: Partial<jest.Mocked<JwtDomainService>> = {};

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: LoginUseCase, useValue: loginUseCaseMock },
        { provide: SESSION_REPOSITORY_TOKEN, useValue: sessionRepositoryMock },
        { provide: JwtDomainService, useValue: jwtDomainServiceMock },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    loginUseCase = module.get(LoginUseCase);
    sessionRepository = module.get(SESSION_REPOSITORY_TOKEN);
  });

  describe('login', () => {
    it('should call LoginUseCase.execute with dto and return its result', async () => {
      const dto: LoginDto = { username: 'ash', password: 'pikachu123' } as LoginDto;

      const loginResult: LoginResult = {
        user: { id: 'user-1', username: 'ash' },
        token: { token: 'jwt-token', expAt: new Date() },
      };

      loginUseCase.execute.mockResolvedValue(loginResult);

      const result = await controller.login(dto);

      expect(loginUseCase.execute).toHaveBeenCalledTimes(1);
      expect(loginUseCase.execute).toHaveBeenCalledWith(dto);
      expect(result).toEqual(loginResult);
    });
  });

  describe('getMe', () => {
    it('should return user information from request', async () => {
      const req: any = {
        user: {
          id: 'user-1',
          username: 'ash',
          session: { id: 'session-1' },
        },
      };

      const result = await controller.getMe(req);

      expect(result).toEqual({
        user: {
          id: 'user-1',
          username: 'ash',
        },
      });
    });
  });

  describe('logout', () => {
    it('should deactivate user session and return success message', async () => {
      const req: any = {
        user: {
          id: 'user-1',
          username: 'ash',
          session: { id: 'session-1' },
        },
      };

      const result = await controller.logout(req);

      expect(sessionRepository.deactivate).toHaveBeenCalledTimes(1);
      expect(sessionRepository.deactivate).toHaveBeenCalledWith('session-1');
      expect(result).toEqual({ message: 'Logout successful' });
    });
  });
});

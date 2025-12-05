import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './UserController';
import { SignupUseCase } from '../../application/use-cases/SignupUseCase';
import { LoginUseCase, LoginResult } from '../../../auth/application/use-cases/LoginUseCase';
import { SignupDto } from '../../application/dto/SignupDto';

describe('UserController', () => {
  let controller: UserController;
  let signupUseCase: jest.Mocked<SignupUseCase>;
  let loginUseCase: jest.Mocked<LoginUseCase>;

  beforeEach(async () => {
    const signupUseCaseMock: Partial<jest.Mocked<SignupUseCase>> = {
      execute: jest.fn(),
    };

    const loginUseCaseMock: Partial<jest.Mocked<LoginUseCase>> = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: SignupUseCase, useValue: signupUseCaseMock },
        { provide: LoginUseCase, useValue: loginUseCaseMock },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    signupUseCase = module.get(SignupUseCase);
    loginUseCase = module.get(LoginUseCase);
  });

  describe('signup', () => {
    it('should execute signup and then login, returning login result', async () => {
      const dto: SignupDto = {
        username: 'ash',
        password: 'pikachu123',
      } as SignupDto;

      const loginResult: LoginResult = {
        user: { id: 'user-1', username: 'ash' },
        token: { token: 'jwt-token', expAt: new Date() },
      };

      loginUseCase.execute.mockResolvedValue(loginResult);

      const result = await controller.signup(dto);

      expect(signupUseCase.execute).toHaveBeenCalledTimes(1);
      expect(signupUseCase.execute).toHaveBeenCalledWith(dto);
      expect(loginUseCase.execute).toHaveBeenCalledTimes(1);
      expect(loginUseCase.execute).toHaveBeenCalledWith({
        username: dto.username,
        password: dto.password,
      });
      expect(result).toEqual(loginResult);
    });
  });
});

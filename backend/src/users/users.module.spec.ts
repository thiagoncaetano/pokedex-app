import 'reflect-metadata';
import { UsersModule } from './users.module';
import { DatabaseModule } from '../common/database/database.module';
import { AuthModule } from '../auth/auth.module';
import { UserController } from './infrastructure/http/UserController';
import { SignupUseCase } from './application/use-cases/SignupUseCase';
import { LoginUseCase } from '../auth/application/use-cases/LoginUseCase';
import { TypeOrmUserRepositoryProvider } from './infrastructure/repositories/TypeOrmUserRepository';

describe('UsersModule', () => {
  it('should be defined', () => {
    expect(UsersModule).toBeDefined();
  });

  it('should import DatabaseModule and AuthModule', () => {
    const imports = Reflect.getMetadata('imports', UsersModule) || [];
    expect(imports).toEqual(expect.arrayContaining([DatabaseModule, AuthModule]));
  });

  it('should register UserController', () => {
    const controllers = Reflect.getMetadata('controllers', UsersModule) || [];
    expect(controllers).toEqual(expect.arrayContaining([UserController]));
  });

  it('should provide SignupUseCase, LoginUseCase and TypeOrmUserRepositoryProvider', () => {
    const providers = Reflect.getMetadata('providers', UsersModule) || [];
    expect(providers).toEqual(
      expect.arrayContaining([
        SignupUseCase,
        LoginUseCase,
        TypeOrmUserRepositoryProvider,
      ]),
    );
  });
});

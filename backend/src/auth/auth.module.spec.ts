import 'reflect-metadata';
import { AuthModule } from './auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './infrastructure/http/AuthController';
import { LoginUseCase } from './application/use-cases/LoginUseCase';
import { AuthDomainService } from './domain/services/AuthDomainService';
import { JwtDomainService } from './domain/services/JwtService';
import { JwtStrategy } from './infrastructure/strategies/JwtStrategy';
import { TypeOrmSessionRepositoryProvider } from './infrastructure/repositories/TypeOrmSessionRepository';
import { TypeOrmUserRepositoryProvider } from '@/users/infrastructure/repositories/TypeOrmUserRepository';

describe('AuthModule', () => {
  it('should be defined', () => {
    expect(AuthModule).toBeDefined();
  });

  it('should import TypeOrmModule and PassportModule', () => {
    const imports = Reflect.getMetadata('imports', AuthModule) || [];
    // verifica que existem modulos dinamicos de TypeOrm e Passport
    expect(imports.some((m: any) => m && m.module === TypeOrmModule)).toBe(true);
    expect(imports.some((m: any) => m && m.module === PassportModule)).toBe(true);
  });

  it('should register AuthController', () => {
    const controllers = Reflect.getMetadata('controllers', AuthModule) || [];
    expect(controllers).toEqual(expect.arrayContaining([AuthController]));
  });

  it('should provide core auth services and use cases', () => {
    const providers = Reflect.getMetadata('providers', AuthModule) || [];

    expect(providers).toEqual(
      expect.arrayContaining([
        LoginUseCase,
        AuthDomainService,
        JwtDomainService,
        JwtStrategy,
        TypeOrmSessionRepositoryProvider,
        TypeOrmUserRepositoryProvider,
      ]),
    );
  });

  it('should export key providers for other modules', () => {
    const exportsMeta = Reflect.getMetadata('exports', AuthModule) || [];

    expect(exportsMeta).toEqual(
      expect.arrayContaining([
        LoginUseCase,
        AuthDomainService,
        JwtDomainService,
        JwtStrategy,
        TypeOrmSessionRepositoryProvider,
        TypeOrmUserRepositoryProvider,
      ]),
    );
  });
});

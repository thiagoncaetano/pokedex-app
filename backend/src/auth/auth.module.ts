import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './infrastructure/http/AuthController';
import { LoginUseCase } from './application/use-cases/LoginUseCase';
import { AuthDomainService } from './domain/services/AuthDomainService';
import { JwtDomainService } from './domain/services/JwtService';
import { JwtStrategy } from './infrastructure/strategies/JwtStrategy';
import { TypeOrmSessionRepositoryProvider } from './infra/repositories/TypeOrmSessionRepository';
import { SessionEntity } from './infra/entities/session.entity';
import { TypeOrmUserRepositoryProvider } from '../users/infra/repositories/TypeOrmUserRepository';
import { UserEntity } from '../users/infra/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SessionEntity, UserEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' })
  ],
  controllers: [AuthController],
  providers: [
    LoginUseCase, 
    AuthDomainService, 
    JwtDomainService,
    JwtStrategy,
    TypeOrmSessionRepositoryProvider,
    TypeOrmUserRepositoryProvider
  ],
  exports: [
    LoginUseCase,
    AuthDomainService,
    JwtDomainService,
    JwtStrategy,
    TypeOrmSessionRepositoryProvider,
    TypeOrmUserRepositoryProvider
  ],
})
export class AuthModule {}

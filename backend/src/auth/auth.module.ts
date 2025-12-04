import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './infrastructure/http/AuthController';
import { LoginUseCase } from './application/use-cases/LoginUseCase';
import { AuthDomainService } from './domain/services/AuthDomainService';
import { JwtDomainService } from './domain/services/JwtService';
import { JwtStrategy } from './infrastructure/strategies/JwtStrategy';
import { TypeOrmSessionRepositoryProvider } from './infrastructure/repositories/TypeOrmSessionRepository';
import { SessionEntity } from './infrastructure/entities/session.entity';
import { UserEntity } from '@/users/infrastructure/entities/user.entity';
import { TypeOrmUserRepositoryProvider } from '@/users/infrastructure/repositories/TypeOrmUserRepository';

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

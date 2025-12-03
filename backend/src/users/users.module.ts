import { Module } from '@nestjs/common';
import { UserController } from './infrastructure/http/UserController';
import { SignupUseCase } from './application/use-cases/SignupUseCase';
import { TypeOrmUserRepositoryProvider } from './infra/repositories/TypeOrmUserRepository';
import { LoginUseCase } from '../auth/application/use-cases/LoginUseCase';
import { DatabaseModule } from '../common/database/database.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [UserController],
  providers: [SignupUseCase, LoginUseCase, TypeOrmUserRepositoryProvider],
})
export class UsersModule {}

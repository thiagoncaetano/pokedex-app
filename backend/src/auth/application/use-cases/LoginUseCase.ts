import { Injectable, Inject } from '@nestjs/common';
import { randomUUID } from 'crypto';
import type { UserRepository } from '../../../users/domain/repositories/IUserRepository';
import { USER_REPOSITORY_TOKEN } from '../../../users/domain/repositories/IUserRepository';
import type { SessionRepository } from '../../domain/repositories/ISessionRepository';
import { SESSION_REPOSITORY_TOKEN } from '../../domain/repositories/ISessionRepository';
import { AuthDomainService } from '../../domain/services/AuthDomainService';
import { JwtDomainService } from '../../domain/services/JwtService';
import { SessionEntity } from '../../infra/entities/session.entity';
import { User } from '../../../users/domain/entities/User';
import { LoginDto } from '../dto/LoginDto';
import { UnauthorizedError } from '../../../common/errors/HTTPError';

export interface LoginCommand {
  username: string;
  password: string;
}

export interface LoginResult {
  user: { id: string; username: string };
  token: { token: string; expAt: Date };
}

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN) private readonly userRepo: UserRepository,
    @Inject(SESSION_REPOSITORY_TOKEN) private readonly sessionRepo: SessionRepository,
    private readonly domain: AuthDomainService,
    private readonly jwtService: JwtDomainService,
  ) {}

  async execute(command: LoginCommand): Promise<LoginResult> {
    const user: User | null = await this.userRepo.findByUsername(command.username);
    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const isValid = await this.domain.validateUser(user, command.password);
    if (!isValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const session = new SessionEntity();
    session.id = randomUUID();
    session.userId = user.id;
    session.expAt = new Date(Date.now() + 60 * 60 * 1000);
    session.isActive = true;

    await this.sessionRepo.save(session);

    const token = this.jwtService.generateAccessToken(session.id, user.id);

    return {
      user: {
        id: user.id,
        username: user.username,
      },
      token,
    };
  }
}

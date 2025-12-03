import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { UserRepository } from '../../../users/domain/repositories/IUserRepository';
import type { SessionRepository } from '../../../auth/domain/repositories/ISessionRepository';
import { USER_REPOSITORY_TOKEN } from '../../../users/domain/repositories/IUserRepository';
import { SESSION_REPOSITORY_TOKEN } from '../../../auth/domain/repositories/ISessionRepository';
import { User } from '../../../users/domain/entities/User';
import { Inject } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN) private readonly userRepo: UserRepository,
    @Inject(SESSION_REPOSITORY_TOKEN) private readonly sessionRepo: SessionRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_SECRET || 'default-secret',
    });
  }

  async validate(payload: { sessionId: string; userId: string }): Promise<User> {
    const session = await this.sessionRepo.findById(payload.sessionId);
    if (!session || !session.isActive) {
      throw new Error('Session not found or inactive');
    }

    if (session.expAt <= new Date()) {
      throw new Error('Session expired');
    }

    const user = await this.userRepo.findById(payload.userId);
    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
}

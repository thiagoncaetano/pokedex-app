import { Controller, Post, Get, Body, HttpCode, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LoginUseCase, LoginResult } from '../../application/use-cases/LoginUseCase';
import { LoginDto } from '../../application/dto/LoginDto';
import type { User } from '../../../users/domain/entities/User';
import type { SessionRepository } from '../../domain/repositories/ISessionRepository';
import { SESSION_REPOSITORY_TOKEN } from '../../domain/repositories/ISessionRepository';
import { Inject } from '@nestjs/common';
import { JwtDomainService } from '../../domain/services/JwtService';

interface AuthenticatedRequest {
  user: User;
  headers: {
    authorization?: string;
  };
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    @Inject(SESSION_REPOSITORY_TOKEN) private readonly sessionRepo: SessionRepository,
    private readonly jwtService: JwtDomainService
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<LoginResult> {
    return this.loginUseCase.execute(loginDto);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async getMe(@Request() req: AuthenticatedRequest) {
    return {
      user: {
        id: req.user.id,
        username: req.user.username
      }
    };
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async logout(@Request() req: AuthenticatedRequest) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return { message: 'No token provided' };
    }

    try {
      const payload = this.jwtService.verifyAccessToken(token);
      await this.sessionRepo.deactivate(payload.sessionId);
      return { message: 'Logout successful' };
    } catch (error) {
      return { message: 'Invalid token' };
    }
  }
}

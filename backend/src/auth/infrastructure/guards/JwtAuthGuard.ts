import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { JwtStrategy } from '../strategies/JwtStrategy';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private jwtStrategy: JwtStrategy) {
    super();
  }
}

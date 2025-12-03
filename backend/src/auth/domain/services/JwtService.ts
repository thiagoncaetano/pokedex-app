import { Injectable } from '@nestjs/common';
import { sign, verify } from 'jsonwebtoken';

export interface JwtPayload {
  sessionId: string;
  userId: string;
  type: 'access';
}

@Injectable()
export class JwtDomainService {
  private readonly accessSecret: string;

  constructor() {
    this.accessSecret = process.env.JWT_ACCESS_SECRET || 'access-secret-key';
  }

  generateAccessToken(sessionId: string, userId: string): { token: string; expAt: Date } {
    const payload: JwtPayload = {
      sessionId,
      userId,
      type: 'access'
    };

    const token = sign(payload, this.accessSecret, {
      expiresIn: '1h',
      issuer: 'pokemon-app',
      audience: 'pokemon-app-client'
    });

    const expAt = new Date();
    expAt.setHours(expAt.getHours() + 1); // 1 hour from now

    return { token, expAt };
  }

  verifyAccessToken(token: string): JwtPayload {
    try {
      const decoded = verify(token, this.accessSecret) as JwtPayload;
      if (decoded.type !== 'access') {
        throw new Error('Invalid token type');
      }
      return decoded;
    } catch (error) {
      throw new Error('Invalid access token');
    }
  }
}

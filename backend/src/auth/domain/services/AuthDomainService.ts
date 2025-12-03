import { Injectable } from '@nestjs/common';
import { User } from '../../../users/domain/entities/User';

@Injectable()
export class AuthDomainService {
  async validateUser(user: User, password: string): Promise<boolean> {
    return await user.validatePassword(password);
  }
}

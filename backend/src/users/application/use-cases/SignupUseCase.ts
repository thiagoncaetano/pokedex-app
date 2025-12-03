import { Injectable, Inject } from '@nestjs/common';
import type { UserRepository } from '../../domain/repositories/IUserRepository';
import { USER_REPOSITORY_TOKEN } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';
import { randomUUID } from 'crypto';
import { ConflictError } from '../../../common/errors/HTTPError';

export interface SignupCommand {
  username: string;
  password: string;
}

export interface SignupResult {
  user: { id: string; username: string };
}

@Injectable()
export class SignupUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepo: UserRepository,
  ) {}

  async execute(command: SignupCommand): Promise<SignupResult> {
    const existingUser = await this.userRepo.findByUsername(command.username)
    if (existingUser) {
      throw new ConflictError('Username already exists');
    }

    const newUser = await User.create({
      id: randomUUID(),
      username: command.username,
      password: command.password,
    });

    await this.userRepo.save(newUser);

    return {
      user: {
        id: newUser.id,
        username: newUser.username,
      },
    };
  }
}

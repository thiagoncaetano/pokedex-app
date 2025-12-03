import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { SignupUseCase } from '../../application/use-cases/SignupUseCase';
import { LoginUseCase, LoginResult } from '../../../auth/application/use-cases/LoginUseCase';
import { SignupDto } from '../../application/dto/SignupDto';

@Controller('users')
export class UserController {
  constructor(
    private readonly signupUseCase: SignupUseCase,
    private readonly loginUseCase: LoginUseCase,
  ) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() signupDto: SignupDto): Promise<LoginResult> {
    await this.signupUseCase.execute(signupDto);
    return this.loginUseCase.execute({
      username: signupDto.username,
      password: signupDto.password,
    });
  }
}

import { IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';

export class SignupDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username must contain only letters, numbers and underscores',
  })
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  password: string;
}

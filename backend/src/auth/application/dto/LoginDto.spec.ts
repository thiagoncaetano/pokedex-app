import { validate } from 'class-validator';
import { LoginDto } from './LoginDto';

describe('LoginDto', () => {
  it('should be valid when username and password meet the constraints', async () => {
    const dto = new LoginDto();
    dto.username = 'ash';
    dto.password = 'pikachu123';

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should be invalid when username is empty', async () => {
    const dto = new LoginDto();
    dto.username = '' as any;
    dto.password = 'pikachu123';

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    const usernameError = errors.find((e) => e.property === 'username');
    expect(usernameError).toBeDefined();
  });

  it('should be invalid when password is too short', async () => {
    const dto = new LoginDto();
    dto.username = 'ash';
    dto.password = '1234'; // MinLength(5)

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    const passwordError = errors.find((e) => e.property === 'password');
    expect(passwordError).toBeDefined();
  });
});

import { validate } from 'class-validator';
import { SignupDto } from './SignupDto';

describe('SignupDto', () => {
  it('should be valid when username and password meet constraints', async () => {
    const dto = new SignupDto();
    dto.username = 'ash_ketchum';
    dto.password = 'pikachu123';

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should be invalid when username is too short', async () => {
    const dto = new SignupDto();
    dto.username = 'as'; // MinLength(3)
    dto.password = 'pikachu123';

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    const usernameError = errors.find((e) => e.property === 'username');
    expect(usernameError).toBeDefined();
  });

  it('should be invalid when username has invalid characters', async () => {
    const dto = new SignupDto();
    dto.username = 'ash!';
    dto.password = 'pikachu123';

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    const usernameError = errors.find((e) => e.property === 'username');
    expect(usernameError).toBeDefined();
  });

  it('should be invalid when password is too short', async () => {
    const dto = new SignupDto();
    dto.username = 'ash';
    dto.password = '1234'; // MinLength(5)

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    const passwordError = errors.find((e) => e.property === 'password');
    expect(passwordError).toBeDefined();
  });
});

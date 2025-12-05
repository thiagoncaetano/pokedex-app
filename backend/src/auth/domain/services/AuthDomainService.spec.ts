import { AuthDomainService } from './AuthDomainService';
import { User } from '../../../users/domain/entities/User';

describe('AuthDomainService', () => {
  let service: AuthDomainService;

  beforeEach(() => {
    service = new AuthDomainService();
  });

  it('should delegate to user.validatePassword and return true when valid', async () => {
    const user: Partial<User> = {
      validatePassword: jest.fn().mockResolvedValue(true),
    } as any;

    const result = await service.validateUser(user as User, 'pikachu123');

    expect(user.validatePassword).toHaveBeenCalledTimes(1);
    expect(user.validatePassword).toHaveBeenCalledWith('pikachu123');
    expect(result).toBe(true);
  });

  it('should delegate to user.validatePassword and return false when invalid', async () => {
    const user: Partial<User> = {
      validatePassword: jest.fn().mockResolvedValue(false),
    } as any;

    const result = await service.validateUser(user as User, 'wrong');

    expect(user.validatePassword).toHaveBeenCalledTimes(1);
    expect(user.validatePassword).toHaveBeenCalledWith('wrong');
    expect(result).toBe(false);
  });
});

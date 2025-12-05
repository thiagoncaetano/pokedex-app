import { User } from './User';

describe('User entity', () => {
  describe('create', () => {
    it('should hash password and create a User instance', async () => {
      const user = await User.create({ id: 'user-1', username: 'ash', password: 'pikachu123' });

      expect(user.id).toBe('user-1');
      expect(user.username).toBe('ash');
      expect(typeof user.passwordHash).toBe('string');
      expect(user.passwordHash.length).toBeGreaterThan(0);
      // nao deve armazenar a senha em texto puro
      expect(user.passwordHash).not.toBe('pikachu123');
    });
  });

  describe('validatePassword', () => {
    it('should return true when password matches stored hash', async () => {
      const user = await User.create({ id: 'user-1', username: 'ash', password: 'pikachu123' });

      const isValid = await user.validatePassword('pikachu123');

      expect(isValid).toBe(true);
    });

    it('should return false when password does not match stored hash', async () => {
      const user = await User.create({ id: 'user-1', username: 'ash', password: 'pikachu123' });

      const isValid = await user.validatePassword('wrong');

      expect(isValid).toBe(false);
    });
  });
});

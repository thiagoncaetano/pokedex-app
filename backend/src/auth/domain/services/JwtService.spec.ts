import { JwtDomainService, JwtPayload } from './JwtService';
import { sign, verify } from 'jsonwebtoken';

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

describe('JwtDomainService', () => {
  let service: JwtDomainService;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_ACCESS_SECRET = 'test-secret';
    service = new JwtDomainService();
  });

  describe('generateAccessToken', () => {
    it('should generate token with correct payload and return token and expAt ~1h ahead', () => {
      const mockedToken = 'jwt-token';
      (sign as jest.Mock).mockReturnValue(mockedToken);

      const before = new Date();
      const { token, expAt } = service.generateAccessToken('session-1', 'user-1');
      const after = new Date();

      expect(sign).toHaveBeenCalledTimes(1);
      const [payload, secret, options] = (sign as jest.Mock).mock.calls[0];

      expect(payload).toEqual<JwtPayload>({
        sessionId: 'session-1',
        userId: 'user-1',
        type: 'access',
      });
      expect(secret).toBe('test-secret');
      expect(options).toMatchObject({
        expiresIn: '1h',
        issuer: 'pokemon-app',
        audience: 'pokemon-app-client',
      });

      expect(token).toBe(mockedToken);
      expect(expAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      const oneHourMs = 60 * 60 * 1000;
      expect(expAt.getTime()).toBeLessThanOrEqual(after.getTime() + oneHourMs + 1000);
    });
  });

  describe('verifyAccessToken', () => {
    it('should return payload when token is valid and type is access', () => {
      const payload: JwtPayload = {
        sessionId: 'session-1',
        userId: 'user-1',
        type: 'access',
      };

      (verify as jest.Mock).mockReturnValue(payload);

      const result = service.verifyAccessToken('jwt-token');

      expect(verify).toHaveBeenCalledTimes(1);
      expect(verify).toHaveBeenCalledWith('jwt-token', 'test-secret');
      expect(result).toEqual(payload);
    });

    it('should throw error when token type is not access', () => {
      const payload: any = {
        sessionId: 'session-1',
        userId: 'user-1',
        type: 'refresh',
      };

      (verify as jest.Mock).mockReturnValue(payload);

      expect(() => service.verifyAccessToken('jwt-token')).toThrow('Invalid access token');
    });

    it('should throw error when verify throws', () => {
      (verify as jest.Mock).mockImplementation(() => {
        throw new Error('invalid token');
      });

      expect(() => service.verifyAccessToken('jwt-token')).toThrow('Invalid access token');
    });
  });
});

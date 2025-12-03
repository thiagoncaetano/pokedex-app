import * as crypto from 'crypto';

export class User {
  constructor(
    public readonly id: string,
    public readonly username: string,
    private readonly _passwordHash: string,
  ) {}

  get passwordHash(): string {
    return this._passwordHash;
  }

  static async create(props: { id: string; username: string; password: string }): Promise<User> {
    const passwordHash = crypto.pbkdf2Sync(props.password, '', 1000, 64, 'sha512').toString('hex');
    return new User(props.id, props.username, passwordHash);
  }

  async validatePassword(password: string): Promise<boolean> {
    const hash = crypto.pbkdf2Sync(password, '', 1000, 64, 'sha512').toString('hex');
    return hash === this._passwordHash;
  }
}

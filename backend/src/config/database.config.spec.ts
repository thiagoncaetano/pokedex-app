import databaseConfig from './database.config';

function withEnv(env: NodeJS.ProcessEnv, fn: () => void) {
  const oldEnv = { ...process.env };
  process.env = { ...process.env, ...env };
  try {
    fn();
  } finally {
    process.env = oldEnv;
  }
}

describe('database.config', () => {
  it('should return sqlite config by default when DB_TYPE is not set', () => {
    withEnv({ DB_TYPE: '', NODE_ENV: 'development', SQLITE_DATABASE_PATH: '' }, () => {
      const config = databaseConfig();

      expect(config.type).toBe('sqlite');
      expect(config.database).toBe('./data/pokemon.db');
      expect(config.entities).toBeDefined();
      expect(config.synchronize).toBe(true);
      expect(config.logging).toBe(true);
    });
  });

  it('should use SQLITE_DATABASE_PATH when provided', () => {
    withEnv({ DB_TYPE: 'sqlite', SQLITE_DATABASE_PATH: '/tmp/test.db', NODE_ENV: 'test' }, () => {
      const config = databaseConfig();

      expect(config.type).toBe('sqlite');
      expect(config.database).toBe('/tmp/test.db');
      // em test, synchronize ainda deve ser true (nao eh production)
      expect(config.synchronize).toBe(true);
      // logging apenas em development
      expect(config.logging).toBe(false);
    });
  });

  it('should return postgres config when DB_TYPE is postgres', () => {
    withEnv(
      {
        DB_TYPE: 'postgres',
        DB_HOST: 'db-host',
        DB_PORT: '5433',
        DB_USERNAME: 'user',
        DB_PASSWORD: 'pass',
        DB_DATABASE: 'dbname',
      },
      () => {
        const config = databaseConfig();

        expect(config.type).toBe('postgres');
        expect(config.host).toBe('db-host');
        expect(config.port).toBe(5433);
        expect(config.username).toBe('user');
        expect(config.password).toBe('pass');
        expect(config.database).toBe('dbname');
      },
    );
  });
});

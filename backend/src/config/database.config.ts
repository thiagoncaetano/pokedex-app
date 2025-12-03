import { registerAs } from '@nestjs/config';

export default registerAs('database', () => {
  const type = process.env.DB_TYPE || 'sqlite';
  
  // SQLite config (default for development)
  if (type === 'sqlite') {
    return {
      type: 'sqlite',
      database: process.env.SQLITE_DATABASE_PATH || './data/pokemon.db',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV === 'development',
    };
  }

  // PostgreSQL config (for production)
  return {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: process.env.NODE_ENV !== 'production',
    logging: process.env.NODE_ENV === 'development',
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  };
});

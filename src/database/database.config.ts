import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { config } from 'dotenv';

config();

export function createTypeOrmProdConfig(
  config: PostgresConnectionOptions,
): PostgresConnectionOptions {
  return {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE || '',
    synchronize: process.env.TYPE_ORM_SYNC === 'ON', //process.env.NODE_ENV === 'development',
    logger: 'advanced-console',
    migrations: ['dist/migrations/*{.ts,.js}'],
    migrationsTableName: 'migrations_typeorm',
    migrationsRun: false,
    // synchronize: true,
    logging: false,
    ...config,
  };
}

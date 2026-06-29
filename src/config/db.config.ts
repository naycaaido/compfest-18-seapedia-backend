import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { join } from 'path';
import { SeederOptions } from 'typeorm-extension';
import { DataSourceOptions } from 'typeorm';

config();

const configService = new ConfigService();

export const options: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: configService.get<string>('DB_HOST'),
  port: parseInt(configService.get<string>('DB_PORT')!, 5432),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_DATABASE'),

  // Supabase
  // url: process.env.DATABASE_URL,
  // ssl: { rejectUnauthorized: false },

  seeds: [join(process.cwd(), 'src', '**', '*.seed.{ts,js}')],
  synchronize: false,
  entities: [join(process.cwd(), 'src', '**', '*.entity.{ts,js}')],
  migrations: ['src/database/migrations/*-migration.ts'],
  migrationsRun: false,
  logging: true,
}

const AppDataSource = new DataSource(options);

console.log('Connecting to DB:', {
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  username: process.env.DB_USERNAME,
});

export default AppDataSource;
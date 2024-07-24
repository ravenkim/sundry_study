import { createPool } from 'mysql2/promise';
import { ConfigService } from '@nestjs/config';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async (configService: ConfigService) => {
      return createPool({
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        user: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.database'),
        connectionLimit: 10,
      });
    },
    inject: [ConfigService],
  },
];

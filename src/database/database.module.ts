import { Module } from '@nestjs/common';
import { Pool } from 'pg';

@Module({
  providers: [
    {
      provide: 'DATABASE_CONNECTION',
      useFactory: async () => {
        const pool = new Pool({
          user: 'ting',
          host: '219.250.205.19',
          database: 'ting',
          password: 'ting1!',
          port: 6075,
        });
        return pool;
      },
    },
  ],
  exports: ['DATABASE_CONNECTION'],
})
export class DatabaseModule {}
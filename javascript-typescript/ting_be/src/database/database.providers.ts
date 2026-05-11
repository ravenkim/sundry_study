import { createPool } from 'mysql2/promise'
import { ConfigService } from '@nestjs/config'

export const databaseProviders = [
    {
        provide: 'DATABASE_CONNECTION',
        useFactory: async (configService: ConfigService) => {
            return createPool({
                host: configService.get<string>('DATABASE_HOST'),
                port: configService.get<number>('DATABASE_PORT'),
                user: configService.get<string>('DATABASE_USER'),
                password: configService.get<string>('DATABASE_PASSWORD'),
                database: configService.get<string>('DATABASE_NAME'),
                connectionLimit: 10,
            })
        },
        inject: [ConfigService],
    },
]

import { Global, Module } from '@nestjs/common'
import { DatabaseService } from './database.service'
import { databaseProviders } from './database.providers'
import { PrismaService } from './prisma.service'

@Global()
@Module({
    providers: [...databaseProviders, DatabaseService, PrismaService],
    exports: [DatabaseService, PrismaService],
})
export class DatabaseModule {}

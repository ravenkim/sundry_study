import { Module, Global } from '@nestjs/common'
import { DatabaseService } from './database.service'
import { databaseProviders } from './database.providers'

@Global()
@Module({
    providers: [...databaseProviders, DatabaseService],
    exports: [DatabaseService],
})
export class DatabaseModule {}

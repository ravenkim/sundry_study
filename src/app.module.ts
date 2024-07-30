import { Module } from '@nestjs/common'
import { AppController } from 'app.controller'
import { AppService } from 'app.service'
import { AdminModule } from './modules/admin/admin.module'
import { DatabaseService } from './database/database.service'
import { databaseProviders } from './database/database.providers'
import { ConfigModule } from '@nestjs/config'

@Module({
    imports: [ConfigModule.forRoot(), AdminModule],
    controllers: [AppController],
    providers: [...databaseProviders, DatabaseService, AppService],
    exports: [DatabaseService],
})
export class AppModule {}

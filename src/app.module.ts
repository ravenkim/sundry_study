import { Module } from '@nestjs/common'
import { AppController } from 'app.controller'
import { AppService } from 'app.service'
import { AdminModule } from './modules/admin/admin.module'
import { ConfigModule } from '@nestjs/config'
import { DatabaseModule } from './database/database.module'
import { UsersModule } from './modules/users/users.module'
import { AuthModule } from './modules/auth/auth.module'

@Module({
    imports: [
        /*****************************공통***********************************/
        //config 모듈 (env 파일 접근 + 캐시 설정)
        ConfigModule.forRoot({
            cache: true,
            isGlobal: true,
        }),
        //디비 연동
        DatabaseModule,

        /*****************************모듈***********************************/
        //관리자
        AdminModule,

        UsersModule,
        AuthModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}

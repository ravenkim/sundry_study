import { Module } from '@nestjs/common'
import { KakaoController } from './kakao.controller'
import { KakaoService } from './kakao.service'
import { UsersModule } from '../../users/users.module'

@Module({
    imports: [UsersModule],
    controllers: [KakaoController],
    providers: [KakaoService],
})
export class KakaoModule {}

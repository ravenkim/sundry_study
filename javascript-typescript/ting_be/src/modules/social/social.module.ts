import { Module } from '@nestjs/common'
import { KakaoModule } from './kakao/kakao.module'
// import { GoogleModule } from './google/google.module'
// import { NaverModule } from './naver/naver.module'

@Module({
    imports: [
        KakaoModule,
        // GoogleModule,
        // NaverModule
    ],
})
export class SocialModule {}

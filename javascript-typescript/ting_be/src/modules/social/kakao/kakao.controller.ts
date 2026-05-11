import { Controller, Get, Query, Res } from '@nestjs/common'
import { KakaoService } from './kakao.service'
import { Response } from 'express'

@Controller('kakao')
export class KakaoController {
    constructor(private kakaoService: KakaoService) {}

    @Get('redirect')
    async handleKakaoRedirect(
        @Query('code') code: string,
        @Res() res: Response,
    ) {
        //회원가입 되었는지 확인
        // 안되어있으면 회원가입
        //필요한 정보 추가로 입력받아서 처리
        // 되어있으면 로그인 처리
        // const result = await this.kakaoService.handleKakaoRedirect(code)
        // res.json(result)
    }
}

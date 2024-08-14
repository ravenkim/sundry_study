import { Controller, Get, Query, Res } from '@nestjs/common'
import { KakaoService } from './kakao.service'
import { Response } from 'express'

@Controller('kakao')
export class KakaoController {
    constructor(private kakaoService: KakaoService) {
    }

    @Get('redirect')
    async handleKakaoRedirect(@Query('code') code: string, @Res() res: Response) {
        const result = await this.kakaoService.handleKakaoRedirect(code)
        res.json(result)
    }
}
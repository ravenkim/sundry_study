import { Body, Controller, Post, Req, Res } from '@nestjs/common'
import { AuthService } from './auth.service'
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'
import { CreateAccountRequestDto } from '../users/dto/createAccount.dto'
import { LoginRequestDto } from './dto/login.dto'
import { Response } from 'express'

@Controller('auth')
@ApiTags('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @ApiOperation({
        summary: '로그인',
    })
    @ApiBody({ type: LoginRequestDto })
    login(
        @Body() request: LoginRequestDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        return this.authService.login(request, res)
    }

    @Post('create-user')
    reissueToken(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        return this.authService.reissueToken(req, res)
    }
}

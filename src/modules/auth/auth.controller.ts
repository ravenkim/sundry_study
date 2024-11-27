import {
    Body,
    Controller,
    Post,
    Req,
    Res,
    Get,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'
import { LoginRequestDto } from './dto/login.dto'
import { Response } from 'express'
import { Public } from './decorators/public.decorator'


@Controller('auth')
@ApiTags('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @ApiBearerAuth() //todo 이거 안써도 public 제외 하고 일괄 적용 하는 방법
    @Get('test')
    test() {
        return '연결됨'
    }

    @Public()
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

import { Body, Controller, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'
import { CreateAccountRequestDto } from '../users/dto/createAccount.dto'
import { LoginRequestDto } from './dto/login.dto'

@Controller('auth')
@ApiTags('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @ApiOperation({
        summary: '로그인',
    })
    @ApiBody({ type: LoginRequestDto })
    login(@Body() request: LoginRequestDto) {



        return this.authService.login(request)
    }
}

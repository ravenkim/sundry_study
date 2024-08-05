import { Controller, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { ApiTags } from '@nestjs/swagger'

@Controller('auth')
@ApiTags('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    login() {
        return this.authService.login()
    }

}

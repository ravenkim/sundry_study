import { Body, Controller, Post } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'
import { UsersService } from './users.service'
import { CreateAccountRequestDto } from './dto/createAccount.dto'

@Controller('users')
@ApiTags('users')
export class UsersController {
    constructor(private readonly UsersService: UsersService) {}

    @Post('get-user')
    getUser() {
        return this.UsersService.getUser()
    }

    @Post('create-account')
    @ApiOperation({
        summary: '회원가입',
        // description: '설명',
    })
    @ApiBody({ type: CreateAccountRequestDto })
    createAccount(@Body() request: CreateAccountRequestDto) {
        return this.UsersService.createAccount(request)
    }

    // 회원가입
    @Post('create-user')
    createUser() {
        return this.UsersService.createUser()
    }
}

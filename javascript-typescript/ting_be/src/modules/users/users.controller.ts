import { Body, Controller, Post } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'
import { UsersService } from './users.service'
import { CreateAccountRequestDto } from './dto/createAccount.dto'
import { getUserInfoRequestDto } from './dto/user.dto'
import { Public } from '../auth/decorators/public.decorator'

@Controller('users')
@ApiTags('users')
export class UsersController {
    constructor(private readonly UsersService: UsersService) {}

    @Post('test')
    test(@Body() props: any) {
        return []
    }

    @Post('get-user-info')
    @ApiOperation({
        summary: 'id 로 유저 정보 조회',
    })
    @ApiBody({ type: getUserInfoRequestDto })
    getUserInfo(@Body() props: getUserInfoRequestDto) {
        return this.UsersService.getUser(props)
    }

    @Post('create-account')
    @ApiOperation({
        summary: '회원가입',
        // description: '설명',
    })
    @ApiBody({ type: CreateAccountRequestDto })
    createAccount(@Body() props: CreateAccountRequestDto) {
        return this.UsersService.createAccount(props)
    }

    // 회원가입
    @Post('create-user')
    createUser() {
        return this.UsersService.createUser()
    }

    @Post('testemail')
    @Public()
    testemail() {
        return this.UsersService.sendTestEmail()
    }
}

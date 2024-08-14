import { Controller, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { UsersService } from './users.service'


@Controller('users')
@ApiTags('users')
export class UsersController {


    constructor(
        private readonly UsersService: UsersService,
    ) {}

    @Post('get-user')
    getUser() {
        return this.UsersService.getUser()
    }


    // 회원가입
    @Post('create-user')
    createUser() {

        return this.UsersService.createUser()
    }
}

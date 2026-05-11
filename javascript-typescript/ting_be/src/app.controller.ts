import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'
import { ApiBearerAuth } from '@nestjs/swagger'
import { Public } from './modules/auth/decorators/public.decorator'

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    getHello(): object {
        return this.appService.getHello()
    }

    @Get('test')
    @Public()
    test() {
        return '연결됨'
    }

    @Get('loginTest')
    @Public()
    loginTest() {
        return '연결됨'
    }
}

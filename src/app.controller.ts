import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'
import { ApiBearerAuth } from '@nestjs/swagger'

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @ApiBearerAuth()
    @Get()
    getHello(): object {
        return this.appService.getHello()
    }

    @ApiBearerAuth()
    @Get('test')
    test() {
        return '연결됨'
    }
}

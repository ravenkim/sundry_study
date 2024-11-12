import { Controller, Get, Req } from '@nestjs/common'
import { CommonCodeManagementService } from './common-code-management.service'
import { ApiTags } from '@nestjs/swagger'
import { Request } from 'express'

@Controller('admin/common-code')
@ApiTags('admin/common-code')
export class CommonCodeManagementController {
    constructor(
        private readonly CommonCodeManagementService: CommonCodeManagementService,
    ) {}

    @Get('get-common-codes')
    getCommonCodes(@Req() req: Request) {
        return this.CommonCodeManagementService.getCommonCodes(req)
    }
}

// import { Controller, Get, Query } from '@nestjs/common';
//
// @Controller('cats')
// export class CatsController {
//     @Get()
//     findAll(@Query('age') age: number): string {
//         return `Cats with age ${age}`;
//     }
// }

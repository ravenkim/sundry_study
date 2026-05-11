import { Controller, Get, Req } from '@nestjs/common'
import { CommonCodeManagementService } from './common-code-management.service'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Request } from 'express'

@Controller('admin/common-code')
@ApiTags('admin/common-code')
export class CommonCodeManagementController {
    constructor(
        private readonly CommonCodeManagementService: CommonCodeManagementService,
    ) {}

    @ApiBearerAuth()
    @Get('asd')
    ttt(@Req() req: Request) {
        return 'ttt'
    }

    @ApiBearerAuth()
    @Get('get-common-codes')
    getCommonCodes(@Req() req: Request) {
        return this.CommonCodeManagementService.getCommonCodes(req)
    }
}

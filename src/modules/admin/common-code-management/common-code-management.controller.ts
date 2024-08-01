import { Controller, Get } from '@nestjs/common'
import { CommonCodeManagementService } from './common-code-management.service'
import { ApiTags } from '@nestjs/swagger'

@Controller('admin/common-code')
@ApiTags('admin/common-code')
export class CommonCodeManagementController {
    constructor(
        private readonly CommonCodeManagementService: CommonCodeManagementService,
    ) {}

    @Get('get-common-codes')
    getCommonCodes() {
        return this.CommonCodeManagementService.getCommonCodes()
    }
}

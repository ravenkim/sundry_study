import { Controller, Get } from '@nestjs/common'
import { AdminService } from './admin.service'
import { ApiTags } from '@nestjs/swagger';

@Controller('admin')
@ApiTags('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @Get('get-common-code')
    getCommonCode() {
        return this.adminService.getCommonCode()
    }
}

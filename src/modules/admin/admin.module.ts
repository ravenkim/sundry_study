import { Module } from '@nestjs/common'
import { AdminController } from './admin.controller'
import { AdminService } from './admin.service'
import { CommonCodeService } from './common-code-management/common-code.service'

@Module({
    controllers: [AdminController],
    providers: [AdminService, CommonCodeService],
})
export class AdminModule {}

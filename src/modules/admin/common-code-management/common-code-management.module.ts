import { Module } from '@nestjs/common'
import { CommonCodeManagementService } from './common-code-management.service'
import { CommonCodeManagementController } from './common-code-management.controller'

@Module({
    controllers: [CommonCodeManagementController],
    providers: [CommonCodeManagementService],
})
export class CommonCodeManagementModule {}

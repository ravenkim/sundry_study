import { Module } from '@nestjs/common'
import { CommonCodeManagementModule } from './common-code-management/common-code-management.module'

@Module({
    imports: [CommonCodeManagementModule],
})
export class AdminModule {}

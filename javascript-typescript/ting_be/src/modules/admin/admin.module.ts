import { Module } from '@nestjs/common'
import { CommonCodeManagementModule } from './common-code-management/common-code-management.module'
import { AuthModule } from '../auth/auth.module'

@Module({
    imports: [CommonCodeManagementModule],
})
export class AdminModule {}

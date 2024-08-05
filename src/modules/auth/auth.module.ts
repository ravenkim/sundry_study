import { JwtModule } from '@nestjs/jwt'
import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
    imports: [
        JwtModule.register({ global: true }),

    ],
    controllers: [AuthController,

    ],
    providers: [AuthService],
})
export class AuthModule {
}
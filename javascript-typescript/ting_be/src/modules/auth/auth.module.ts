import { JwtModule } from '@nestjs/jwt'
import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { PassportModule } from '@nestjs/passport'
import { JwtAccessTokenStrategy } from './strategy/accessToken.strategy'

@Module({
    imports: [PassportModule, JwtModule.register({ global: true })],
    controllers: [AuthController],
    providers: [AuthService, JwtAccessTokenStrategy],
})
export class AuthModule {}

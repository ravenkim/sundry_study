import { Injectable } from '@nestjs/common'
import { DatabaseService } from '../../database/database.service'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {

    constructor(
        private readonly databaseService: DatabaseService,
        private jwtService: JwtService
    ) {}

    async login() {

        //비밀번호 일치 여부 확인





        const payload = {

        }

        //토큰 만들어서 넘겨주기
        const accessToken = await this.jwtService.signAsync(payload),
        const refreshToken = ''

        return {
            access_token: accessToken,
            refresh_token: refreshToken,
        }
    }

    async logout() {
    }


}
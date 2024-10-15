import { Injectable } from '@nestjs/common'
import { DatabaseService } from '../../database/database.service'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { LoginRequestDto } from './dto/login.dto'

@Injectable()
export class AuthService {
    constructor(
        private readonly databaseService: DatabaseService,
        private jwtService: JwtService,
    ) {}

    async login(request: LoginRequestDto) {
        // const result = await bcrypt.compare(
        //     'string',
        //     '$2b$10$9VUffo3MkgPZeNLojzZi7exEYM2AHHEDDa2HQnx89g2x4WDky2t4u',
        // )

        console.log(request)

        const userLoginId = request.userLoginId
        const userPassword = request.userPassword

        const result = await this.databaseService.query(
            'src/modules/auth/sql/login.sql',
            [userLoginId],
        )

        if (await bcrypt.compare(userPassword, result[0].user_password)) {
            console.log('로그인 성곤')
            console.log(result)
        } else {
            console.log('로그인 실패 ')
        }


        //
        //
        // //들고올 유저정보 (프로필 처럼 보일 정보)
        // //유저아이디, 유저 프로필, 유저 닉네임, 유저 권한, 유저 재화,
        //
        //
        //
        // const payload = {
        //     id:1
        // }
        //
        // //토큰 만들어서 넘겨주기
        // const accessToken = await this.jwtService.signAsync(payload)
        // const refreshToken = ''
        //
        //
        // const results = {
        //     access_token: accessToken,
        //     refresh_token: refreshToken,
        // }

        return {
            aa: 11,
        }
    }

    async logout() {}
}

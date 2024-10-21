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

    async createAccessToken(user_id: number) {
        const user_info = await this.databaseService.query(
            'src/modules/auth/sql/login.sql',
            [user_id],
        )
    }

    async login(request: LoginRequestDto) {
        const userLoginId = request.userLoginId
        const userPassword = request.userPassword

        //아이디로 유저 정보 조회
        const result = await this.databaseService.query(
            'src/modules/auth/sql/login.sql',
            [userLoginId],
        )

        //로그인시 줄 정보들 모음
        const { user_id, user_email, user_authority } = result[0]
        const payload = {
            user_id: user_id,
            user_email: user_email,
        }

        const accessToken = this.jwtService.sign(payload, { expiresIn: '300s' })

        console.log(accessToken)

        if (await bcrypt.compare(userPassword, result[0].user_password)) {
            console.log('로그인 성곤')

            //     토큰 2개 만들어 보내기 하나 저장
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

    async logout() {
        // 디비 refresh token을 삭제하고, access token을 디비 블랙리스트로 추가
    }
}

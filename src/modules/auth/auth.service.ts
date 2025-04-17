import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common'
import { DatabaseService } from '../../database/database.service'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { LoginRequestDto } from './dto/login.dto'
import { PrismaService } from '../../database/prisma.service'
import { Request, Response } from 'express'

@Injectable()
export class AuthService {
    constructor(
        private readonly databaseService: DatabaseService,
        private jwtService: JwtService,
        private prisma: PrismaService,
    ) {}

    async createAccessToken(id: number) {
        const userInfo = await this.prisma.user.findUnique({
            where: {
                id: id,
            },
        })
        const payload = {
            id: userInfo.id,
            email: userInfo.email,
            role: userInfo.role,
        }
        return this.jwtService.sign(payload, {
            secret: process.env.ACCESS_TOKEN_SECRET,
            expiresIn: '15m', // 예: 15분
        })
    }

    async createRefreshToken(id: number) {
        const payload = { id: id }
        return this.jwtService.sign(payload, {
            secret: process.env.REFRESH_TOKEN_SECRET,
            expiresIn: '7d', // 예: 7일
        })
    }

    //리프래시 토큰 검증 >  토큰 재발급
    async reissueToken(req: Request, res: Response) {
        const cookies = Object.assign({}, req.cookies)
        const refreshToken = undefined //cookies.refreshToken

        if (!refreshToken) {
            throw new BadRequestException('refreshToken 이 없습니다.')
            // errotype 이 400 이라서 나중에 수정해야함
        }

        // 만료확인 // 유저 정보 확인
        // 같은 리프래시 인지 확인

        console.log(cookies)
        console.log(refreshToken)

        const user = 1 // 쿠키에서 가져오게끔 수정

        const accessToken = this.createAccessToken(user)
        const newRefreshToken = this.createRefreshToken(user)

        // 디비에 갈아끼기

        res.cookie('refreshToken', newRefreshToken, {
            domain: 'localhost',
            path: '/',
            httpOnly: false,
        })
        return accessToken
    }

    async login(props: LoginRequestDto, res: Response) {
        const { loginId, password } = props

        const userInfo = await this.prisma.user.findUnique({
            where: {
                login_id: loginId,
            },
        })

        if (await bcrypt.compare(password, userInfo.password)) {
            const accessToken = this.createAccessToken(userInfo.id)

            // todo 자동 로그인시 발급 시간 길게
            const refreshToken = this.createRefreshToken(userInfo.id)

            res.cookie('refreshToken', refreshToken, {
                domain: 'localhost',
                path: '/',
                httpOnly: false,
            })
            return accessToken
            //     토큰 2개 만들어 보내기 하나 저장
        } else {
            // todo 로그인 실패 여러번 할시 로그인 제한 https://velog.io/@dldldl1022/Node.js%EB%A5%BC-%EC%9D%B4%EC%9A%A9%ED%95%B4%EC%84%9C-%EB%A1%9C%EA%B7%B8%EC%9D%B8-%EC%8B%9C%EB%8F%84-%ED%9A%9F%EC%88%98-%EC%A0%9C%ED%95%9C%ED%95%98%EA%B8%B0%EB%A1%9C%EA%B7%B8%EC%9D%B8-%EC%8B%A4%ED%8C%A8-%EC%8B%9C-10%EB%B6%84%EA%B0%84-%EC%9E%A0%EA%B8%88
            throw new BadRequestException('잘못된 ID 혹은 비밀번호 입니다')
        }

        // //아이디로 유저 정보 조회
        // const result = await this.databaseService.query(
        //     'src/modules/auth/sql/login.sql',
        //     [userLoginId],
        // )
        //
        // //로그인시 줄 정보들 모음
        // const { user_id, user_email, user_authority } = result[0]
        // const payload = {
        //     user_id: user_id,
        //     user_email: user_email,
        // }
        //
        // const accessToken = this.jwtService.sign(payload, { expiresIn: '300s' })
        //
        // console.log(accessToken)
        //

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

        return 'aaa'
    }

    async logout() {
        // 디비 refresh token을 삭제하고, access token을 디비 블랙리스트로 추가
    }
}

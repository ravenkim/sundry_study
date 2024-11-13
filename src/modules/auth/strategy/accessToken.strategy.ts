import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Request } from 'express'
import { ExtractJwt, Strategy } from 'passport-jwt'

@Injectable()
export class JwtAccessTokenStrategy extends PassportStrategy(
    Strategy,
    'access_token',
) {
    constructor(private readonly configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            // access toke  n secret key
            secretOrKey: process.env.ACCESS_TOKEN_SECRET,
            // configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
            // 만료된 토큰은 거부
            ignoreExpiration: false,
            // validate 함수에 첫번째 인자에 request를 넘겨줌
            passReqToCallback: true,
        })
    }

    validate(req: Request, payload) {
        console.log(payload)
        // request에 저장을 해놔야 Guard후에 controller 메서드에서 사용 가능
        req.user = payload
        return payload
    }
}

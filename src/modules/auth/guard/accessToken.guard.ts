import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class JwtAccessTokenGuard extends AuthGuard('access_token') {}

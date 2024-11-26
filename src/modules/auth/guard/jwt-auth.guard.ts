import {
    Injectable,
    CanActivate,
    ExecutionContext,
    SetMetadata,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { JwtAccessTokenGuard } from './accessToken.guard'

export const IS_PUBLIC_KEY = 'isPublic'
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true)


@Injectable()
export class JwtAuthGuard extends JwtAccessTokenGuard implements CanActivate {
    constructor(private reflector: Reflector) {
        super()
    }

    canActivate(context: ExecutionContext): boolean {
        const isPublic = this.reflector.getAllAndOverride<boolean>(
            IS_PUBLIC_KEY,
            [context.getHandler(), context.getClass()],
        )
        if (isPublic) {
            return true
        }
        return <boolean>super.canActivate(context)
    }
}

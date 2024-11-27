import {
    Injectable,
    CanActivate,
    ExecutionContext,
    SetMetadata,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Reflector } from '@nestjs/core'
import { IS_PUBLIC_KEY } from '../decorators/public.decorator'

@Injectable()
export class JwtAuthGuard
    extends AuthGuard('access_token')
    implements CanActivate
{
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

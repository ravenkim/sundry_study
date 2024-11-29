import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const minRole = this.reflector.get<number>(
            'roles',
            context.getHandler(),
        )

        const request = context.switchToHttp().getRequest()
        const user = request.user // 기본값 설정

        // 기본적으로 접근 가능
        if (minRole === undefined) {
            return true
        }

        return user.role >= minRole // 최소 역할 이상의 접근 허용
    }
}

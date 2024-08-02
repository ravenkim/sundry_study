import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common'
import { Observable, throwError } from 'rxjs'
import { map, catchError } from 'rxjs/operators'

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map((data) => this.transformResponse(data)),
            catchError((err) => {
                return throwError(() =>
                    this.transformResponse(null, true, err.message),
                )
            }),
        )
    }

    transformResponse(
        data: any,
        error: boolean = false,
        errorMsg: string = '',
    ): { data: string; error: boolean } {
        if (error) {
            return {
                data: errorMsg,
                error: true,
            }
        }

        const hasError = this.validateData(data)
        return {
            data: data,
            error: hasError,
        }
    }

    validateData(data: any): boolean {
        // 예시 검증 로직을 작성합니다.
        return !data || data.someCondition === false
    }
}
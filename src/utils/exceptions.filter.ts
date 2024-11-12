// src/utils/exceptions.filter.ts

import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common'
import { Request, Response } from 'express'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp()
        const response = ctx.getResponse<Response>()

        const exceptionResponse = exception.getResponse
            ? exception.getResponse()
            : exception.message
              ? exception.message
              : null

        let errorMsg: string

        if (Array.isArray(exceptionResponse)) {
            errorMsg = exceptionResponse.join(', ')
        } else if (typeof exceptionResponse === 'object') {
            if (Array.isArray((exceptionResponse as any).message)) {
                errorMsg = (exceptionResponse as any).message.join(', ')
            } else {
                errorMsg = (exceptionResponse as any).message
            }
        } else {
            errorMsg = exceptionResponse
        }

        // 어떤 애러가 발생했는지 백에서도 찍어줌
        console.error(errorMsg)

        // 예외가 발생해도 통신은 정상적으로 작동했기에 200으로 처리
        response.status(HttpStatus.OK).json({
            data: errorMsg,
            error: true,
        })
    }
}

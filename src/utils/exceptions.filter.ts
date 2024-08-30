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
        const status = exception.getStatus
            ? exception.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR
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

        response.status(status).json({
            data: errorMsg,
            error: true,
        })
    }
}

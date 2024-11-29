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



        // console.log(exception)
        const exceptionResponse = exception.getResponse()

        const message = exceptionResponse.message
        const statusCode = exceptionResponse.statusCode

        // 어떤 애러가 발생했는지 백에서도 찍어줌
        console.error(message)

        // 예외가 발생해도 통신은 정상적으로 작동했기에 200으로 처리
        response.status(HttpStatus.OK).json({
            data: message,
            error: true,
            errorType: statusCode,
        })
    }
}

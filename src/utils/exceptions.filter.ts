import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common'

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp()
        const response = ctx.getResponse()
        let status = HttpStatus.INTERNAL_SERVER_ERROR
        let errorMsg = 'Internal Server Error'

        if (exception instanceof HttpException) {
            status = exception.getStatus()
            errorMsg = exception.message
        } else if (typeof exception === 'string') {
            errorMsg = exception
        }

        response.status(status).json({
            data: errorMsg,
            error: true,
        })
    }
}

import {
    ValidationError,
    BadRequestException,
    HttpStatus,
} from '@nestjs/common'

export const validationExceptionFactory = (errors: ValidationError[]) => {
    const messages = errors.map((error) => ({
        property: error.property,
        constraints: error.constraints,
    }))

    const errorDetails = {
        message: '잘못된 데이터 형식입니다',
        statusCode: HttpStatus.BAD_REQUEST,
        errors: messages,
    }

    throw new BadRequestException(errorDetails)
}

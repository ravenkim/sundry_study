
import { ValidationError, BadRequestException } from '@nestjs/common';

export const validationExceptionFactory = (errors: ValidationError[]) => {
    return new BadRequestException('입력된 데이터의 형식이 맞지 않습니다');
};
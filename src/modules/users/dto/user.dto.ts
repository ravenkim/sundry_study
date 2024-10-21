import { ApiProperty } from '@nestjs/swagger'
import { IsNumber } from 'class-validator'

export class getUserInfoRequestDto {
    @ApiProperty()
    @IsNumber()
    userId: number
}

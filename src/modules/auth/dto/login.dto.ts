import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class CreateAccountRequestDto {
    @ApiProperty()
    @IsString()
    userLoginId: string

    @ApiProperty()
    @IsString()
    userPassword: string
}

export class CreateAccountResponseDto {}

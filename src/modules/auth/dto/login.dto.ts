import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class LoginRequestDto {
    @ApiProperty()
    @IsString()
    loginId: string

    @ApiProperty()
    @IsString()
    password: string
}

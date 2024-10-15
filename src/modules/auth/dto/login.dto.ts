import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class LoginRequestDto {
    @ApiProperty()
    @IsString()
    userLoginId: string

    @ApiProperty()
    @IsString()
    userPassword: string
}

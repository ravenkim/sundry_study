import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString } from 'class-validator'

export class CreateAccountRequestDto {
    @ApiProperty()
    @IsString()
    loginId: string

    @ApiProperty()
    @IsString()
    password: string

    @ApiProperty({ format: 'email' })
    @IsEmail()
    email: string
}

export class CreateAccountResponseDto {}

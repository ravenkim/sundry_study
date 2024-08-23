import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString } from 'class-validator'

export class CreateAccountRequestDto {
    @ApiProperty()
    @IsString()
    userLoginId: string

    @ApiProperty()
    @IsString()
    userPassword: string

    @ApiProperty({ format: 'email' })
    @IsEmail()
    userEmail: string
}

export class CreateAccountResponseDto {}

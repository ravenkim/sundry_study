import { ApiProperty } from '@nestjs/swagger'

export class CreateAccountRequestDto {
    @ApiProperty()
    userLoginId: string

    @ApiProperty()
    userPassword: string

    @ApiProperty()
    userEmail: string

    @ApiProperty()
    userSignupChannel: string
}

export class CreateAccountResponseDto {}

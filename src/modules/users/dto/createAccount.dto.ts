import { ApiProperty } from '@nestjs/swagger'

export class CreateAccountRequestDto {
    @ApiProperty()
    name: string

    @ApiProperty()
    age: number
}

export class CreateAccountResponseDto {

}

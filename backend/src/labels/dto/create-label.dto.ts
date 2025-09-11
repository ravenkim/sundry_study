import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class Position {
  @ApiProperty({ example: 1 })
  @IsNumber()
  row: number;

  @ApiProperty({ example: 0 })
  @IsNumber()
  column: number;
}

class Label {
  @ApiProperty({ description: 'ID', example: 0 })
  @IsNumber()
  id: number;

  @ApiProperty({ description: 'File name', example: 'docker-compose.yaml' })
  @IsString()
  fileName: string;

  @ApiProperty({ example: 'Inserted', enum: ['Inserted', 'Deleted'] })
  @IsString()
  changeType: 'Inserted' | 'Deleted';

  @ApiProperty({ description: 'Selected range', type: [Position] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Position)
  selectedRange: Position[];
}

export class CreateLabelDto {
  @ApiProperty({
    example:
      'https://github.com/fika-dev/code-change-labeler/commit/f5083a140c755ef3c0c577b6e933c3c85d0ae2b9',
  })
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiProperty({ example: 1757575602336 })
  @IsNumber()
  time: number;

  @ApiProperty({ description: 'Array of labels', type: [Label] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Label)
  labels: Label[];
}

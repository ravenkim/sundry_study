import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class LabelSelection {
  @ApiProperty({ example: { line: 1, col: 0 } })
  @IsObject()
  start: {
    line: number;
    col: number;
  };

  @ApiProperty({ example: { line: 1, col: 10 } })
  @IsObject()
  end: {
    line: number;
    col: number;
  };
}

class Label {
  @ApiProperty({ description: 'File path', example: 'src/app.ts' })
  @IsString()
  file: string;

  @ApiProperty({ example: 'inserted', enum: ['inserted', 'deleted'] })
  @IsString()
  changeType: 'inserted' | 'deleted';

  @ApiProperty({ description: 'Selected code snippet', type: LabelSelection })
  @IsObject()
  @ValidateNested()
  @Type(() => LabelSelection)
  selection: LabelSelection;

  @ApiProperty({ description: 'Label for the code change', example: 'bug-fix' })
  @IsString()
  label: string;
}

export class CreateLabelDto {
  @ApiProperty({ example: 'https://github.com/owner/repo/pull/123' })
  @IsString()
  @IsNotEmpty()
  pullRequestUrl: string;

  @ApiProperty({ example: '2023-01-01T12:00:00Z' })
  @IsDate()
  @Type(() => Date)
  diffFetchedAt: Date;

  @ApiProperty({ description: 'Array of labels', type: [Label] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Label)
  labels: Label[];
}

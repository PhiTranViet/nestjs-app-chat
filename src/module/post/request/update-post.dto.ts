import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdatePostDto {
  @ApiProperty({
    type: String,
    example: 'This is title',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  title?: string;


  @ApiProperty({
    type: String,
    example: 'This is title',
  })
  @IsOptional()
  @IsString()
  content?: string;
}
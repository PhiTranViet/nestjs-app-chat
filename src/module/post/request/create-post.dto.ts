import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreatePostDto {
  @ApiProperty({
    type: String,
    example: 'This is title',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  title: string;



  @ApiProperty({
    type: String,
    example: 'This is content',
  })
  @IsNotEmpty()
  @IsString()
  content: string;
}

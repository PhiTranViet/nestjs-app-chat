import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  MaxLength,
  MinLength,
  IsNumber,
} from 'class-validator';

export class CreateChatDto {
  @ApiProperty({
    description: 'The name of the chat',
    example: 'Development Team',
  })
  @IsString()
  name: string;


  @ApiProperty({
    description: 'isGroup',
    example: 'true',
  })
  @IsBoolean()
  isGroup: boolean;

  @ApiProperty({ description: 'ID of the chatUserIdTo', example: 1 })
  @IsNumber()
  chatUserIdTo: number;
}

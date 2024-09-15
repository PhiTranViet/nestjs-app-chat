import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsNumber } from 'class-validator';

export class SendMessageDto {
  @ApiProperty({
    description: 'ID của chat hoặc group mà tin nhắn được gửi đến',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  chatId: number;

  @ApiProperty({
    description: 'Nội dung của tin nhắn',
    example: 'Hello, how are you?',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'Loại tin nhắn (text, image, video)',
    example: 'text',
  })
  @IsEnum(['text', 'image', 'video'], {
    message: 'Type phải là text, image hoặc video',
  })
  @IsNotEmpty()
  type: 'text' | 'image' | 'video';
}
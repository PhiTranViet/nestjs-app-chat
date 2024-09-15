import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsNumber } from 'class-validator';

export class SendMessageDto {
  @ApiProperty({
    description: 'ID của groupId  mà tin nhắn được gửi đến',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  groupId: number;

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
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, MaxLength, MinLength } from 'class-validator';

export class UpdateGroupDto {
  @ApiProperty({
    description: 'name group',
    example: 'Team Development',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'status group',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
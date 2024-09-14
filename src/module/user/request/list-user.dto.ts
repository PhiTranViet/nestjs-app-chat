import { IsOptional, IsString, IsNumberString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ListUserDto {
  @ApiPropertyOptional({ description: 'Page number' })
  @IsNumberString()
  @IsOptional()
  page?: string;

  @ApiPropertyOptional({ description: 'Number of items per page' })
  @IsNumberString()
  @IsOptional()
  limit?: string;

  @ApiPropertyOptional({ description: 'Filter by username' })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiPropertyOptional({ description: 'Filter by email' })
  @IsString()
  @IsOptional()
  email?: string;
}
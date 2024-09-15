import { IsOptional, IsString, IsNumberString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginatedtDto {
    @ApiPropertyOptional({ description: 'Page number' })
    @IsNumberString()
    @IsOptional()
    page?: string;
  
    @ApiPropertyOptional({ description: 'Number of items per page' })
    @IsNumberString()
    @IsOptional()
    limit?: string;

    @ApiPropertyOptional({ description: 'Filter by text' })
    @IsString()
    @IsOptional()
    search?: string;
}
import { IsOptional, IsString, IsNumberString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginatedPostDto {
    @ApiPropertyOptional({ description: 'Page number' })
    @IsNumberString()
    @IsOptional()
    page?: string;
  
    @ApiPropertyOptional({ description: 'Number of items per page' })
    @IsNumberString()
    @IsOptional()
    limit?: string;

    @ApiPropertyOptional({ description: 'Filter by content' })
    @IsString()
    @IsOptional()
    content?: string;


    @ApiPropertyOptional({ description: 'Filter by title' })
    @IsString()
    @IsOptional()
    title?: string;


    @ApiPropertyOptional({ description: 'Filter by authorName' })
    @IsString()
    @IsOptional()
    authorName?: string;

}
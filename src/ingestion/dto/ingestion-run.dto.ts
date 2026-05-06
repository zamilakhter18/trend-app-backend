import { IsOptional, IsString, IsArray } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class IngestionRunDto {
  @ApiPropertyOptional({
    description: 'Specific platforms to run ingestion for',
    example: ['instagram', 'tiktok'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  platforms?: string[];

  @ApiPropertyOptional({
    description: 'Additional configuration or parameters for the pipeline',
    example: 'full-scan',
  })
  @IsOptional()
  @IsString()
  mode?: string;
}

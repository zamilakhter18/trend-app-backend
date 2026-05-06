import { IsOptional, IsString, IsNumber, IsDateString, Min, Max, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateSponsoredContentDto {
  @ApiPropertyOptional({
    description: 'Name of the sponsor organization',
    example: 'Nike',
  })
  @IsOptional()
  @IsString()
  sponsor_name?: string;

  @ApiPropertyOptional({
    description: 'Name of the marketing campaign',
    example: 'Summer Fashion 2026',
  })
  @IsOptional()
  @IsString()
  campaign_name?: string;

  @ApiPropertyOptional({
    description: 'Total budget allocated for this promotion',
    example: 12000,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  budget?: number;

  @ApiPropertyOptional({
    description: 'Priority score for feed injection (0-100)',
    example: 98,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  priority_score?: number;

  @ApiPropertyOptional({
    description: 'Start date of the campaign',
    example: '2026-06-05',
  })
  @IsOptional()
  @IsDateString()
  start_date?: string;

  @ApiPropertyOptional({
    description: 'End date of the campaign',
    example: '2026-07-15',
  })
  @IsOptional()
  @IsDateString()
  end_date?: string;

  @ApiPropertyOptional({
    description: 'Whether the campaign is currently active',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

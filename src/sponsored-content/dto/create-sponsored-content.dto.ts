import { IsNotEmpty, IsString, IsNumber, IsOptional, IsUUID, IsDateString, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSponsoredContentDto {
  @ApiProperty({
    description: 'The UUID of the trend to promote',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsNotEmpty()
  @IsUUID()
  trend_id!: string;

  @ApiProperty({
    description: 'Name of the sponsor organization',
    example: 'Nike',
  })
  @IsNotEmpty()
  @IsString()
  sponsor_name!: string;

  @ApiProperty({
    description: 'Name of the marketing campaign',
    example: 'Summer Fashion 2026',
  })
  @IsNotEmpty()
  @IsString()
  campaign_name!: string;

  @ApiProperty({
    description: 'Total budget allocated for this promotion',
    example: 10000,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  budget!: number;

  @ApiProperty({
    description: 'Priority score for feed injection (0-100)',
    example: 95,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(100)
  priority_score!: number;

  @ApiProperty({
    description: 'Start date of the campaign',
    example: '2026-06-01',
  })
  @IsNotEmpty()
  @IsDateString()
  start_date!: string;

  @ApiProperty({
    description: 'End date of the campaign',
    example: '2026-06-30',
  })
  @IsNotEmpty()
  @IsDateString()
  end_date!: string;
}

import { IsNotEmpty, IsString, IsIn, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class EngageDto {
  @ApiProperty({
    description: 'The UUID of the trend to engage with',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsNotEmpty()
  @IsUUID()
  trend_id!: string;

  @ApiProperty({
    description: 'The type of engagement',
    enum: ['like', 'comment', 'share'],
    example: 'like',
  })
  @IsNotEmpty()
  @IsString()
  @IsIn(['like', 'comment', 'share'])
  type!: string;

  @ApiPropertyOptional({
    description: 'Optional content for the engagement (e.g., comment text)',
    example: 'This trend is fire!',
  })
  @IsOptional()
  @IsString()
  content?: string;
}

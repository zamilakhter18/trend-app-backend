import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AnalyzeTrendDto {
  @ApiProperty({
    description: 'The UUID of the trend to analyze',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsNotEmpty()
  @IsUUID()
  trend_id!: string;

  @ApiProperty({
    description: 'The raw trend content to be processed by LLM',
    example: 'AI is transforming the fashion industry with generative designs...',
  })
  @IsNotEmpty()
  @IsString()
  content!: string;
}

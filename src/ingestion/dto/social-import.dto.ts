import { IsNotEmpty, IsString, IsEnum, IsUrl, IsArray, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Platform } from '../../common/enums/platform.enum';

export class SocialImportDto {
  @ApiProperty({
    description: 'The source platform of the trend',
    enum: Platform,
    example: Platform.INSTAGRAM,
  })
  @IsNotEmpty()
  @IsEnum(Platform)
  source!: Platform;

  @ApiProperty({
    description: 'The external ID from the source platform',
    example: 'abc123',
  })
  @IsNotEmpty()
  @IsString()
  external_id!: string;

  @ApiProperty({
    description: 'Title of the trend',
    example: 'Minimal Fashion Trend',
  })
  @IsNotEmpty()
  @IsString()
  title!: string;

  @ApiPropertyOptional({
    description: 'Detailed description of the trend',
    example: 'Trending fashion reels highlighting minimalist aesthetics.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'URL to the media content (video/image)',
    example: 'https://example.com/video.mp4',
  })
  @IsNotEmpty()
  @IsUrl()
  media_url!: string;

  @ApiProperty({
    description: 'List of hashtags associated with the trend',
    example: ['fashion', 'minimal'],
  })
  @IsArray()
  @IsString({ each: true })
  hashtags!: string[];

  @ApiProperty({
    description: 'Current engagement count (likes/comments)',
    example: 10000,
  })
  @IsNumber()
  engagement_count!: number;

  @ApiProperty({
    description: 'Calculated velocity/growth score',
    example: 88.2,
  })
  @IsNumber()
  velocity_score!: number;
}

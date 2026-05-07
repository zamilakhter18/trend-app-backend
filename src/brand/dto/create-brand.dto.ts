import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsUrl, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBrandDto {
  @ApiProperty({
    description: 'The name of the brand',
    example: 'Nike',
  })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiPropertyOptional({
    description: 'Whether the brand is verified',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  verified?: boolean;

  @ApiPropertyOptional({
    description: 'Billing metadata for the brand',
    example: { taxId: '12-3456789', address: '123 Nike Way' },
  })
  @IsOptional()
  billing_metadata?: any;

  @ApiPropertyOptional({
    description: 'Website URL of the brand',
    example: 'https://nike.com',
  })
  @IsOptional()
  @IsUrl()
  website_url?: string;

  @ApiPropertyOptional({
    description: 'Logo URL of the brand',
    example: 'https://nike.com/logo.png',
  })
  @IsOptional()
  @IsUrl()
  logo_url?: string;

  @ApiPropertyOptional({
    description: 'The UUID of the user who owns/manages this brand',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsUUID()
  owner_id?: string;
}

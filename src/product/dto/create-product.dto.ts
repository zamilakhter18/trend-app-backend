import { IsNotEmpty, IsString, IsNumber, IsOptional, IsUUID, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    description: 'The UUID of the trend this product is associated with',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsNotEmpty()
  @IsUUID()
  trend_id!: string;

  @ApiProperty({
    description: 'Name of the product',
    example: 'Sustainable Bamboo Toothbrush',
  })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiPropertyOptional({
    description: 'Detailed description of the product',
    example: 'A high-quality toothbrush made from 100% biodegradable bamboo.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Price of the product',
    example: 9.99,
  })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiPropertyOptional({
    description: 'Currency code (ISO 4217)',
    example: 'USD',
    default: 'USD',
  })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({
    description: 'Affiliate or store link for purchase',
    example: 'https://amazon.com/example-product',
  })
  @IsNotEmpty()
  @IsUrl()
  affiliate_url!: string;

  @ApiPropertyOptional({
    description: 'URL to the product image',
    example: 'https://example.com/product-image.jpg',
  })
  @IsOptional()
  @IsUrl()
  image_url?: string;
}

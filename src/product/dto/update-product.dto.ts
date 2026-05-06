import { IsString, IsNumber, IsOptional, IsUrl } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProductDto {
  @ApiPropertyOptional({
    description: 'Updated name of the product',
    example: 'Premium Bamboo Toothbrush',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Updated description of the product',
    example: 'An even better toothbrush made from sustainable bamboo.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Updated price of the product',
    example: 12.99,
  })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiPropertyOptional({
    description: 'Updated currency code',
    example: 'EUR',
  })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional({
    description: 'Updated affiliate link',
    example: 'https://new-store.com/example-product',
  })
  @IsOptional()
  @IsUrl()
  affiliate_url?: string;

  @ApiPropertyOptional({
    description: 'Updated product image URL',
    example: 'https://example.com/new-image.jpg',
  })
  @IsOptional()
  @IsUrl()
  image_url?: string;
}

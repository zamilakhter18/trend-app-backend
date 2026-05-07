import { IsNotEmpty, IsString, IsNumber, IsOptional, IsUUID, IsUrl, IsBoolean } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateProductDto {
  @ApiProperty({
    description: "The UUID of the trend this product is associated with",
    example: "550e8400-e29b-41d4-a716-446655440000",
  })
  @IsNotEmpty()
  @IsUUID()
  trend_id!: string;

  @ApiProperty({
    description: "Name of the product",
    example: "Sustainable Bamboo Toothbrush",
  })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiPropertyOptional({
    description: "Detailed description of the product",
    example: "A high-quality toothbrush made from 100% biodegradable bamboo.",
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: "Price of the product",
    example: 9.99,
  })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiPropertyOptional({
    description: "Currency code (ISO 4217)",
    example: "USD",
    default: "USD",
  })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({
    description: "Affiliate or store link for purchase",
    example: "https://amazon.com/example-product",
  })
  @IsNotEmpty()
  @IsUrl()
  affiliate_url!: string;

  @ApiPropertyOptional({
    description: "URL to the product image",
    example: "https://example.com/product-image.jpg",
  })
  @IsOptional()
  @IsUrl()
  image_url?: string;

  @ApiPropertyOptional({ description: "Is this product sponsored?", default: false })
  @IsOptional()
  @IsBoolean()
  is_sponsored?: boolean;

  @ApiPropertyOptional({ description: "Is this product authentic/verified?", default: true })
  @IsOptional()
  @IsBoolean()
  is_authentic?: boolean;

  @ApiPropertyOptional({ description: "Name of the merchant", example: "Amazon" })
  @IsOptional()
  @IsString()
  merchant_name?: string;

  @ApiPropertyOptional({ description: "Affiliate network name", example: "Impact" })
  @IsOptional()
  @IsString()
  affiliate_network?: string;

  @ApiPropertyOptional({ description: "Tracking params and other commerce metadata", example: { subid: "123" } })
  @IsOptional()
  commerce_metadata?: any;
}

import { IsNotEmpty, IsString, IsNumber, IsOptional, IsUUID, IsUrl } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsUUID()
  trend_id: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsNotEmpty()
  @IsUrl()
  affiliate_url: string;

  @IsOptional()
  @IsUrl()
  image_url?: string;
}

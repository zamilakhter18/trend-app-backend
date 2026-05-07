import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsOptional, IsEnum } from "class-validator";
import { TrendPhaseEnum } from "../../common/helpers/enum";

export class CreateTrendDto {
  @ApiProperty({ example: "Minimalist Streetwear", description: "The title of the trend" })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiPropertyOptional({ example: "A trend focused on simple, clean lines...", description: "Trend description" })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: "instagram", description: "Source of the trend" })
  @IsString()
  @IsOptional()
  source?: string;

  @ApiPropertyOptional({ example: "ext-123", description: "External ID from source platform" })
  @IsString()
  @IsOptional()
  externalId?: string;

  @ApiPropertyOptional({ enum: TrendPhaseEnum, default: TrendPhaseEnum.EMERGING })
  @IsEnum(TrendPhaseEnum)
  @IsOptional()
  phase?: TrendPhaseEnum;

  @ApiPropertyOptional({ example: "ORGANIC", default: "ORGANIC" })
  @IsString()
  @IsOptional()
  contentType?: string;

  @ApiPropertyOptional({ example: "PUBLISHED", default: "PUBLISHED" })
  @IsString()
  @IsOptional()
  status?: string;
}

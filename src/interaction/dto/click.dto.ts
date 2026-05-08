import { IsNotEmpty, IsUUID, IsOptional, IsEnum, IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { ClickSourceType } from "../../common/helpers/enum";

export class ClickDto {
  @ApiProperty({
    description: "The UUID of the product being clicked",
    example: "d290f1ee-6c54-4b01-90e6-d701748f0851",
  })
  @IsNotEmpty()
  @IsUUID()
  product_id!: string;

  @ApiPropertyOptional({
    description: "The UUID of the trend context",
    example: "550e8400-e29b-41d4-a716-446655440000",
  })
  @IsOptional()
  @IsUUID()
  trend_id?: string;

  @ApiPropertyOptional({
    description: "The UUID of the campaign context",
    example: "d290f1ee-6c54-4b01-90e6-d701748f0853",
  })
  @IsOptional()
  @IsUUID()
  campaign_id?: string;

  @ApiPropertyOptional({
    description: "The source of the click",
    enum: ClickSourceType,
    example: ClickSourceType.ORGANIC_FEED,
  })
  @IsOptional()
  @IsEnum(ClickSourceType)
  source_type?: ClickSourceType;

  @ApiPropertyOptional({
    description: "The UUID of the creator who drove the traffic",
    example: "d290f1ee-6c54-4b01-90e6-d701748f0854",
  })
  @IsOptional()
  @IsUUID()
  creator_id?: string;

  @ApiPropertyOptional({
    description: "A session identifier for deduplication and journey tracking",
    example: "session_123456",
  })
  @IsOptional()
  @IsString()
  session_id?: string;
}

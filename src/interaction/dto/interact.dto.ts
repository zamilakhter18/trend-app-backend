import { IsString, IsOptional, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class InteractDto {
  @ApiProperty({ example: "uuid", description: "ID of the trend", required: false })
  @IsUUID()
  @IsOptional()
  trend_id?: string;

  @ApiProperty({ example: "uuid", description: "ID of the product", required: false })
  @IsUUID()
  @IsOptional()
  product_id?: string;

  @ApiProperty({ example: "VIEW", description: "Type of interaction (VIEW, SAVE, CLICK, SHARE)" })
  @IsString()
  interaction_type!: string;

  @ApiProperty({ example: "FEED", description: "Source of the interaction", required: false })
  @IsString()
  @IsOptional()
  source_type?: string;

  @ApiProperty({ example: "This is great!", description: "Optional content/comment", required: false })
  @IsString()
  @IsOptional()
  content?: string;
}

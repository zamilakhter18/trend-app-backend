import { IsString, IsOptional, IsUUID, IsEnum } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { InteractionSourceTypeEnum, InteractionTypeEnum } from "../../common/helpers/enum";

export class InteractDto {
  @ApiProperty({ example: "550e8400-e29b-41d4-a716-446655440000", description: "ID of the trend", required: false })
  @IsUUID()
  @IsOptional()
  trend_id?: string;

  @ApiProperty({ example: "d290f1ee-6c54-4b01-90e6-d701748f0851", description: "ID of the product", required: false })
  @IsUUID()
  @IsOptional()
  product_id?: string;

  @ApiProperty({ enum: InteractionTypeEnum, description: "Type of interaction (VIEW, SAVE, CLICK, SHARE)" })
  @IsEnum(InteractionTypeEnum)
  interaction_type!: InteractionTypeEnum;

  @ApiProperty({ enum: InteractionSourceTypeEnum, description: "Source of the interaction", required: false })
  @IsEnum(InteractionSourceTypeEnum)
  @IsOptional()
  source_type?: InteractionSourceTypeEnum;

  @ApiProperty({ example: "AI is transforming the fashion industry with generative designs...", description: "Optional content/comment", required: false })
  @IsString()
  @IsOptional()
  content?: string;
}

import { IsString, IsOptional, IsUUID, IsEnum } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { InteractionSourceTypeEnum, InteractionTypeEnum } from "../../common/helpers/enum";

export class InteractDto {
  @ApiProperty({ example: "uuid", description: "ID of the trend", required: false })
  @IsUUID()
  @IsOptional()
  trend_id?: string;

  @ApiProperty({ example: "uuid", description: "ID of the product", required: false })
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

  @ApiProperty({ example: "This is great!", description: "Optional content/comment", required: false })
  @IsString()
  @IsOptional()
  content?: string;
}

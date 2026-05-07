import { IsUUID, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SaveDto {
  @ApiProperty({ example: "uuid", description: "ID of the trend to save", required: false })
  @IsUUID()
  @IsOptional()
  trend_id?: string;

  @ApiProperty({ example: "uuid", description: "ID of the product to save", required: false })
  @IsUUID()
  @IsOptional()
  product_id?: string;
}

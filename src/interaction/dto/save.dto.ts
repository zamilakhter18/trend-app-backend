import { IsUUID, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SaveDto {
  @ApiProperty({ example: "550e8400-e29b-41d4-a716-446655440000", description: "ID of the trend to save", required: false })
  @IsUUID()
  @IsOptional()
  trend_id?: string;

  @ApiProperty({ example: "d290f1ee-6c54-4b01-90e6-d701748f0851", description: "ID of the product to save", required: false })
  @IsUUID()
  @IsOptional()
  product_id?: string;
}

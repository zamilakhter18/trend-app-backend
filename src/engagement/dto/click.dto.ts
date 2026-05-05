import { IsNotEmpty, IsUUID } from 'class-validator';

export class ClickDto {
  @IsNotEmpty()
  @IsUUID()
  product_id: string;
}

import { IsNotEmpty, IsUUID } from 'class-validator';

export class SaveDto {
  @IsNotEmpty()
  @IsUUID()
  trend_id: string;
}

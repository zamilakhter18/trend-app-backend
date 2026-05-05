import { IsNotEmpty, IsString, IsIn, IsOptional, IsUUID } from 'class-validator';

export class EngageDto {
  @IsNotEmpty()
  @IsUUID()
  trend_id: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['like', 'comment', 'share'])
  type: string;

  @IsOptional()
  @IsString()
  content?: string;
}

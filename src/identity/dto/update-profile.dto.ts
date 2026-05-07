import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsOptional, IsUrl } from "class-validator";

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: "trendsetter_new", description: "Updated username" })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiPropertyOptional({ example: "Jane Doe", description: "Updated full name" })
  @IsString()
  @IsOptional()
  fullName?: string;

  @ApiPropertyOptional({ example: "https://example.com/new-avatar.png", description: "Updated avatar URL" })
  @IsUrl()
  @IsOptional()
  avatarUrl?: string;
}

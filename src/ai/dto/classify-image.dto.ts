import { IsNotEmpty, IsUrl } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ClassifyImageDto {
  @ApiProperty({
    description: "The URL of the image to be classified by Vision API",
    example: "https://example.com/outfit-of-the-day.jpg",
  })
  @IsNotEmpty()
  @IsUrl()
  image_url!: string;
}

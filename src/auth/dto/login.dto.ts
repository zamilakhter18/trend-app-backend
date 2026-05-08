import { IsEmail, IsNotEmpty, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
  @ApiProperty({
    description: "The email of the user",
    example: "user@yopmail.com",
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: "The password of the user",
    example: "password123",
    minLength: 6,
  })
  @IsNotEmpty()
  @MinLength(6)
  password!: string;
}

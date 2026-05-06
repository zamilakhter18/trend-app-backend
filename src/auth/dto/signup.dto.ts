import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SignupDto {
  @ApiProperty({
    description: 'The email address for the new account',
    example: 'newuser@example.com',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: 'A secure password (at least 6 characters)',
    example: 'securePass123',
    minLength: 6,
  })
  @IsNotEmpty()
  @MinLength(6)
  password!: string;

  @ApiProperty({
    description: 'Unique username for the profile',
    example: 'trendsetter99',
  })
  @IsNotEmpty()
  @IsString()
  username!: string;

  @ApiPropertyOptional({
    description: 'Legal or display name of the user',
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  full_name?: string;

  @ApiPropertyOptional({
    description: 'URL to the user profile avatar image',
    example: 'https://example.com/avatar.png',
  })
  @IsOptional()
  @IsString()
  avatar_url?: string;
}

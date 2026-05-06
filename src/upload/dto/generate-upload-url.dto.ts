import { IsNotEmpty, IsString, IsEnum, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { StorageBucket } from '../../common/enums/storage-bucket.enum';

export class GenerateUploadUrlDto {
  @ApiProperty({
    description: 'The target Supabase Storage bucket',
    enum: StorageBucket,
    example: StorageBucket.TREND_MEDIA,
  })
  @IsNotEmpty()
  @IsEnum(StorageBucket)
  bucket!: StorageBucket;

  @ApiProperty({
    description: 'The name of the file to be uploaded, including extension',
    example: 'my-awesome-trend.mp4',
  })
  @IsNotEmpty()
  @IsString()
  file_name!: string;

  @ApiProperty({
    description: 'The MIME type of the file. Must be "image/*" or "video/*"',
    example: 'video/mp4',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^(image\/|video\/)/, {
    message: 'Content type must be an image or video',
  })
  content_type!: string;
}

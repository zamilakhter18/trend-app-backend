import { Injectable, Logger, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { ServiceResponse } from '../common/interfaces/service-response.interface';
import { GenerateUploadUrlDto } from './dto/generate-upload-url.dto';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);

  constructor(private supabaseService: SupabaseService) {}

  /**
   * Generates a signed URL for direct client-side uploads to Supabase Storage
   */
  async generateUploadUrl(dto: GenerateUploadUrlDto, userId: string): Promise<ServiceResponse> {
    try {
      const { bucket, file_name, content_type } = dto;
      
      // Sanitize file name and create a unique path
      const fileExt = path.extname(file_name);
      const uniqueFileName = `${uuidv4()}${fileExt}`;
      const filePath = `${userId}/${uniqueFileName}`;

      const client = this.supabaseService.getClient();

      // Generate signed URL from Supabase
      const { data, error } = await client.storage
        .from(bucket)
        .createSignedUploadUrl(filePath);

      if (error) {
        throw new InternalServerErrorException(`Supabase error: ${error.message}`);
      }

      // Construct the public URL after upload
      const publicUrlData = client.storage.from(bucket).getPublicUrl(filePath);

      return {
        success: true,
        message: 'Upload URL generated successfully',
        data: {
          signed_url: data.signedUrl,
          path: data.path,
          public_url: publicUrlData.data.publicUrl,
        },
      };
    } catch (error) {
      this.logger.error(`Failed to generate signed URL: ${error.message}`);
      return { success: false, message: error.message };
    }
  }

  /**
   * Retrieves the public URL for a stored object
   */
  getPublicUrl(bucket: string, objectPath: string): ServiceResponse {
    try {
      const client = this.supabaseService.getClient();
      const { data } = client.storage.from(bucket).getPublicUrl(objectPath);
      
      return {
        success: true,
        message: 'Public URL retrieved successfully',
        data: { public_url: data.publicUrl },
      };
    } catch (error) {
      this.logger.error(`Failed to get public URL: ${error.message}`);
      return { success: false, message: error.message };
    }
  }
}

import { Controller, Post, Get, Body, Param, Res } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiCreatedResponse, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiBearerAuth, ApiOkResponse } from "@nestjs/swagger";
import { UploadService } from "./upload.service";
import { GenerateUploadUrlDto } from "./dto/generate-upload-url.dto";
import { ResponseHandler } from "../common/helpers/response-handler";
import { GetFullUser } from "../common/decorators/get-full-user.decorator";
import { UserProfile } from "../db/entities/UserProfile.entity";
import { Public } from "../common/decorators/public.decorator";
import type { Response } from "express";

@ApiTags("Media Upload")
@Controller("upload")
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    private responseHandler: ResponseHandler,
  ) {}

  @ApiBearerAuth("JWT-auth")
  @Post("generate-url")
  @ApiOperation({
    summary: "Generate a signed URL for direct client-side media uploads",
    description: "Generates a secure, temporary URL that the client application (e.g., Flutter) can use to upload a file directly to Supabase Storage. The URL is pre-signed and expires after a short time.",
  })
  @ApiCreatedResponse({
    description: "Signed URL generated successfully.",
    example: {
      statusCode: 201,
      message: "Upload URL generated successfully",
      data: {
        signed_url: "https://supabase.io/storage/v1/upload/sign/...",
        path: "user-id/uuid.mp4",
        public_url: "https://supabase.io/storage/v1/object/public/bucket/user-id/uuid.mp4",
      },
    },
  })
  @ApiBadRequestResponse({ description: "Invalid bucket or file type" })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  async generateUploadUrl(@Body() dto: GenerateUploadUrlDto, @GetFullUser() user: UserProfile, @Res() res: Response) {
    try {
      const result = await this.uploadService.generateUploadUrl(dto, user.userId);
      if (result.success) {
        return this.responseHandler.successResponseWithData(res, result.message, result.data);
      }
      return this.responseHandler.errorResponse(res, result.message);
    } catch (error) {
      return this.responseHandler.catchErrorResponse(res, (error as Error).message);
    }
  }

  @Public()
  @Get("public-url/:bucket/:path")
  @ApiOperation({ summary: "Get the public URL of a stored media file" })
  @ApiOkResponse({
    description: "Public URL retrieved.",
    example: {
      statusCode: 200,
      message: "Public URL retrieved successfully",
      data: {
        public_url: "https://supabase.io/storage/v1/object/public/bucket/user-id/uuid.mp4",
      },
    },
  })
  getPublicUrl(@Param("bucket") bucket: string, @Param("path") path: string, @Res() res: Response) {
    const result = this.uploadService.getPublicUrl(bucket, path);
    return this.responseHandler.successResponseWithData(res, result.message, result.data);
  }
}

import { Controller, Post, Body, HttpCode, HttpStatus, Res } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiOkResponse, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiInternalServerErrorResponse, ApiCreatedResponse, ApiForbiddenResponse, ApiConflictResponse, ApiBearerAuth } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { SignupDto } from "./dto/signup.dto";
import { LoginDto } from "./dto/login.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { ResponseHandler } from "../common/helpers/response-handler";
import { messages } from "../common/helpers/message";
import type { Response } from "express";
import { Public } from "../common/decorators/public.decorator";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private responseHandler: ResponseHandler,
  ) {}

  @Public()
  @Post("signup")
  @ApiOperation({ summary: "Register a new user and create profile" })
  @ApiCreatedResponse({
    description: "User successfully created with profile and tokens",
    example: {
      statusCode: 201,
      message: "User registered successfully",
      data: {
        user: {
          userId: "uuid",
          email: "user@example.com",
          username: "trendsetter99",
          fullName: "John Doe",
          avatarUrl: "https://example.com/avatar.png",
          role: "user",
        },
        access_token: "abc...",
        refresh_token: "xyz...",
      },
    },
  })
  @ApiConflictResponse({
    description: "Conflict",
    example: {
      statusCode: 400,
      message: "Username already taken",
    },
  })
  @ApiBadRequestResponse({
    description: "Bad Request",
    example: {
      statusCode: 400,
      message: "Bad request",
    },
  })
  @ApiInternalServerErrorResponse({
    description: "Internal Server Error",
    example: {
      statusCode: 500,
      message: "Something went wrong",
    },
  })
  async signup(@Body() signupDto: SignupDto, @Res() res: Response) {
    try {
      const result = await this.authService.signup(signupDto);
      if (result.success) {
        return this.responseHandler.successResponseWithData(res, result.message, result.data);
      }
      return this.responseHandler.errorResponse(res, result.message);
    } catch (error) {
      return this.responseHandler.catchErrorResponse(res, (error as Error).message || messages.INTERNAL_SERVER_ERROR);
    }
  }

  @Public()
  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Login with credentials" })
  @ApiOkResponse({
    description: "Login successful",
    example: {
      statusCode: 200,
      message: "Login successful",
      data: {
        user: { userId: "uuid", username: "user1" },
        access_token: "abc...",
        refresh_token: "xyz...",
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: "Unauthorized",
    example: {
      statusCode: 401,
      message: "Unauthorized access",
    },
  })
  @ApiInternalServerErrorResponse({
    description: "Internal Server Error",
    example: {
      statusCode: 500,
      message: "Something went wrong",
    },
  })
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    try {
      const result = await this.authService.login(loginDto);
      if (result.success) {
        return this.responseHandler.successResponseWithData(res, result.message, result.data);
      }
      return this.responseHandler.unAuthorizeErrorResponse(res, result.message);
    } catch (error) {
      return this.responseHandler.catchErrorResponse(res, (error as Error).message || messages.INTERNAL_SERVER_ERROR);
    }
  }

  @Public()
  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Refresh access token using a valid refresh token" })
  @ApiOkResponse({
    description: "Token refreshed successfully",
    example: {
      statusCode: 200,
      message: "Token refreshed successfully",
      data: {
        access_token: "new-abc...",
        refresh_token: "new-xyz...",
      },
    },
  })
  @ApiForbiddenResponse({
    description: "Invalid or expired refresh token",
    example: {
      statusCode: 403,
      message: "Invalid or expired refresh token",
    },
  })
  @ApiInternalServerErrorResponse({
    description: "Internal Server Error",
    example: {
      statusCode: 500,
      message: "Something went wrong",
    },
  })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto, @Res() res: Response) {
    try {
      const result = await this.authService.refreshToken(refreshTokenDto.refresh_token);
      if (result.success) {
        return this.responseHandler.successResponseWithData(res, result.message, result.data);
      }
      return this.responseHandler.forbiddenErrorResponse(res, result.message);
    } catch (error) {
      return this.responseHandler.catchErrorResponse(res, (error as Error).message || messages.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiBearerAuth("JWT-auth")
  @Post("logout")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Logout the current user" })
  @ApiOkResponse({
    description: "Logout successful",
    example: {
      statusCode: 200,
      message: "Logged out successfully",
    },
  })
  @ApiInternalServerErrorResponse({
    description: "Internal Server Error",
    example: {
      statusCode: 500,
      message: "Something went wrong",
    },
  })
  async logout(@Res() res: Response) {
    try {
      const result = await this.authService.logout();
      if (result.success) {
        return this.responseHandler.successResponse(res, result.message);
      }
      return this.responseHandler.errorResponse(res, result.message);
    } catch (error) {
      return this.responseHandler.catchErrorResponse(res, (error as Error).message || messages.INTERNAL_SERVER_ERROR);
    }
  }
}

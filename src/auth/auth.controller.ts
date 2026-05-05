import { Controller, Post, Body, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiInternalServerErrorResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { ResponseHandler } from '../common/helpers/response-handler';
import { messages } from '../common/helpers/message';
import type { Response } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private responseHandler: ResponseHandler,
  ) {}

  @Post('signup')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiCreatedResponse({
    description: 'User successfully created',
    example: {
      statusCode: 201,
      message: 'User registered successfully',
      data: { id: 'uuid', email: 'user@example.com' },
    },
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    example: {
      statusCode: 400,
      message: 'Bad request',
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error',
    example: {
      statusCode: 500,
      message: 'Something went wrong',
    },
  })
  async signup(@Body() signupDto: SignupDto, @Res() res: Response) {
    try {
      const result = await this.authService.signup(signupDto);
      return this.responseHandler.successResponseWithData(res, messages.SIGNUP_SUCCESS, result);
    } catch (error) {
      return this.responseHandler.catchErrorResponse(res, messages.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with credentials' })
  @ApiOkResponse({
    description: 'Login successful',
    example: {
      statusCode: 200,
      message: 'Login successful',
      data: { token: 'jwt-token' },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    example: {
      statusCode: 401,
      message: 'Unauthorized access',
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error',
    example: {
      statusCode: 500,
      message: 'Something went wrong',
    },
  })
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    try {
      const result = await this.authService.login(loginDto);
      if (result && result.session?.access_token) {
        return this.responseHandler.successResponseWithToken(res, messages.LOGIN_SUCCESS, result.session.access_token);
      }
      return this.responseHandler.unAuthorizeErrorResponse(res, messages.UNAUTHORIZED);
    } catch (error) {
      return this.responseHandler.catchErrorResponse(res, messages.INTERNAL_SERVER_ERROR);
    }
  }
}

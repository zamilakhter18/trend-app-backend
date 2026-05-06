import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { ServiceResponse } from '../common/interfaces/service-response.interface';
import { messages } from '../common/helpers/message';
import { CustomJwtService } from '../common/helpers/jwt.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserProfile } from '../db/entities/UserProfile.entity';

@Injectable()
export class AuthService {
  constructor(
    private supabaseService: SupabaseService,
    private jwtService: CustomJwtService,
    @InjectRepository(UserProfile)
    private userRepository: Repository<UserProfile>,
  ) {}

  /**
   * Helper to generate both access and refresh tokens
   */
  private generateTokens(user: UserProfile) {
    const payload = {
      sub: user.userId,
      email: user.username,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, '15m');
    const refreshToken = this.jwtService.sign(payload, '7d');

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async signup(signupDto: SignupDto): Promise<ServiceResponse> {
    const client = this.supabaseService.getClient();
    const { email, password, username, full_name, avatar_url } = signupDto;

    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          full_name,
          avatar_url,
        },
      },
    });

    if (error) {
      return { success: false, message: error.message };
    }

    // Attempt to find the newly created user profile to generate tokens
    const user = await this.userRepository.findOne({
      where: { userId: data.user?.id },
    });

    let tokens = {};
    if (user) {
      tokens = this.generateTokens(user);
    }

    return {
      success: true,
      message: messages.SIGNUP_SUCCESS,
      data: {
        user: data.user,
        ...tokens,
      },
    };
  }

  async login(loginDto: LoginDto): Promise<ServiceResponse> {
    const client = this.supabaseService.getClient();
    const { email, password } = loginDto;

    const { data, error } = await client.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, message: error.message };
    }

    // After successful Supabase login, find the user and generate custom JWTs
    const user = await this.userRepository.findOne({
      where: { userId: data.user?.id },
    });

    if (!user) {
      return { success: false, message: 'User profile not found' };
    }

    const tokens = this.generateTokens(user);

    return {
      success: true,
      message: messages.LOGIN_SUCCESS,
      data: {
        user: data.user,
        ...tokens,
      },
    };
  }

  async refreshToken(refreshToken: string): Promise<ServiceResponse> {
    try {
      // 1. Verify the refresh token
      const payload = await this.jwtService.verify(refreshToken);

      // 2. Validate user existence
      const user = await this.userRepository.findOne({
        where: { userId: payload.sub || payload.userId },
      });

      if (!user) {
        return { success: false, message: 'User not found or deleted' };
      }

      // 3. Generate new tokens (Rotation)
      const tokens = this.generateTokens(user);

      return {
        success: true,
        message: 'Token refreshed successfully',
        data: tokens,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Invalid or expired refresh token',
      };
    }
  }
}

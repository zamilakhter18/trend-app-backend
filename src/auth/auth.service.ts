import { Injectable } from '@nestjs/common';
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

    return { success: true, message: messages.SIGNUP_SUCCESS, data };
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

    // After successful Supabase login, find the user and generate a custom JWT
    const user = await this.userRepository.findOne({
      where: { userId: data.user?.id },
    });

    if (!user) {
      return { success: false, message: 'User profile not found' };
    }

    const payload = {
      sub: user.userId,
      email: user.username,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, '1h');

    return {
      success: true,
      message: messages.LOGIN_SUCCESS,
      data: {
        user: data.user,
        access_token: accessToken,
      },
    };
  }
}

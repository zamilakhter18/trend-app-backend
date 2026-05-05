import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { ServiceResponse } from '../common/interfaces/service-response.interface';
import { messages } from '../common/helpers/message';

@Injectable()
export class AuthService {
  constructor(private supabaseService: SupabaseService) {}

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

    return { success: true, message: messages.LOGIN_SUCCESS, data };
  }
}

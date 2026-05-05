import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private supabaseService: SupabaseService) {}

  async signup(signupDto: SignupDto) {
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
      throw new BadRequestException(error.message);
    }

    return data;
  }

  async login(loginDto: LoginDto) {
    const client = this.supabaseService.getClient();
    const { email, password } = loginDto;

    const { data, error } = await client.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new UnauthorizedException(error.message);
    }

    return data;
  }
}

import { Injectable } from "@nestjs/common";
import { SupabaseService } from "../supabase/supabase.service";
import { SignupDto } from "./dto/signup.dto";
import { LoginDto } from "./dto/login.dto";
import { ServiceResponse } from "../common/interfaces/service-response.interface";
import { messages } from "../common/helpers/message";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserProfile } from "../db/entities/UserProfile.entity";

@Injectable()
export class AuthService {
  constructor(
    private supabaseService: SupabaseService,
    @InjectRepository(UserProfile) private userRepository: Repository<UserProfile>,
  ) {}

  async signup(signupDto: SignupDto): Promise<ServiceResponse> {
    const { email, password, username, full_name, avatar_url } = signupDto;

    // 1. Check if username already exists in our database
    const existingUser = await this.userRepository.findOne({
      where: { username },
    });

    if (existingUser) {
      return { success: false, message: messages.USERNAME_TAKEN };
    }

    // 2. Signup via Supabase Auth
    const client = this.supabaseService.getClient();
    const { data: authData, error: authError } = await client.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return { success: false, message: authError.message };
    }

    if (!authData.user) {
      return { success: false, message: messages.AUTH_FAILED };
    }

    try {
      // 3. Create User Profile in our database
      const profile = this.userRepository.create({
        userId: authData.user.id,
        email,
        username,
        fullName: full_name,
        avatarUrl: avatar_url,
      });

      const savedProfile = await this.userRepository.save(profile);

      return {
        success: true,
        message: messages.SIGNUP_SUCCESS,
        data: {
          user: savedProfile,
          access_token: authData.session?.access_token,
          refresh_token: authData.session?.refresh_token,
        },
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.code === "23505" ? "Email or username already exists" : "Profile creation failed",
      };
    }
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

    // After successful Supabase login, find the user
    const user = await this.userRepository.findOne({
      where: { userId: data.user?.id },
    });

    if (!user) {
      return { success: false, message: messages.USER_NOT_FOUND };
    }

    return {
      success: true,
      message: messages.LOGIN_SUCCESS,
      data: {
        user,
        access_token: data.session?.access_token,
        refresh_token: data.session?.refresh_token,
      },
    };
  }

  async refreshToken(refreshToken: string): Promise<ServiceResponse> {
    const client = this.supabaseService.getClient();
    const { data, error } = await client.auth.refreshSession({ refresh_token: refreshToken });

    if (error) {
      return {
        success: false,
        message: messages.INVALID_REFRESH_TOKEN,
      };
    }

    return {
      success: true,
      message: messages.TOKEN_REFRESH_SUCCESS,
      data: {
        access_token: data.session?.access_token,
        refresh_token: data.session?.refresh_token,
      },
    };
  }

  async logout(): Promise<ServiceResponse> {
    const client = this.supabaseService.getClient();
    const { error } = await client.auth.signOut();

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true, message: messages.LOGOUT_SUCCESS };
  }
}

import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as jwt from "jsonwebtoken";

@Injectable()
export class CustomJwtService {
  private readonly secret: string;

  constructor(private configService: ConfigService) {
    const jwtSecret = this.configService.get<string>("JWT_SECRET");
    if (!jwtSecret) {
      throw new InternalServerErrorException("JWT_SECRET is missing from configuration");
    }
    this.secret = jwtSecret;
  }

  /**
   * Signs a payload to create a JWT token.
   * @param payload The data to be encoded in the token.
   * @param expireTime Optional expiration time (e.g., '1h', '24h', 3600).
   * @returns Signed JWT token.
   */
  sign(payload: any, expireTime?: string | number): string {
    const options: jwt.SignOptions = {};
    if (expireTime) {
      options.expiresIn = expireTime as any;
    }
    return jwt.sign(payload, this.secret, options);
  }

  /**
   * Verifies a JWT token.
   * @param token The token to verify.
   * @returns The decoded payload.
   * @throws Error if token is invalid or expired.
   */
  verify(token: string): any {
    try {
      return jwt.verify(token, this.secret);
    } catch (error) {
      throw error;
    }
  }
}

import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { CustomJwtService } from "../helpers/jwt.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserProfile } from "../../db/entities/UserProfile.entity";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: CustomJwtService,
    @InjectRepository(UserProfile)
    private userRepository: Repository<UserProfile>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()]);

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (isPublic) {
      if (token) {
        try {
          const payload = await this.jwtService.verify(token);
          const user = await this.userRepository.findOne({
            where: { userId: payload.sub || payload.userId },
          });
          if (user) {
            request.user = user;
          }
        } catch (err) {
          // Silently fail for public routes if token is invalid
        }
      }
      return true;
    }

    if (!token) {
      throw new UnauthorizedException("Token missing");
    }

    try {
      const payload = await this.jwtService.verify(token);
      const user = await this.userRepository.findOne({
        where: { userId: payload.sub || payload.userId },
      });

      if (!user) {
        throw new ForbiddenException("User not found or deleted");
      }

      request.user = user;
    } catch (err) {
      throw new ForbiddenException("Invalid token");
    }

    return true;
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}

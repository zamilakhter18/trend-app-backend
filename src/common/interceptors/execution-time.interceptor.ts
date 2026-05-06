import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class ExecutionTimeInterceptor implements NestInterceptor {
  private readonly logger = new Logger('API-EXECUTION');

  // ANSI color codes
  private readonly colors = {
    yellow: '\x1b[33m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    reset: '\x1b[0m',
  };

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        let statusCode = response.statusCode;

        // Handle "Not Modified" as 200 for logging purposes as per requirement
        if (statusCode === 304) {
          statusCode = 200;
        }

        const executionTime = Date.now() - now;
        const color = statusCode >= 400 ? this.colors.red : this.colors.green;

        this.logger.log(
          `${this.colors.yellow}[API]${this.colors.reset} ` +
            `${method} ${url} ` +
            `${color}${statusCode}${this.colors.reset} ` +
            `${this.colors.yellow}+${executionTime}ms${this.colors.reset}`,
        );
      }),
    );
  }
}

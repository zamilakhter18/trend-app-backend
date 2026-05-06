import { Module, Global } from '@nestjs/common';
import { ResponseHandler } from './helpers/response-handler';
import { CustomJwtService } from './helpers/jwt.service';

@Global()
@Module({
  providers: [ResponseHandler, CustomJwtService],
  exports: [ResponseHandler, CustomJwtService],
})
export class CommonModule {}

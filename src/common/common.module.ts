import { Module, Global } from '@nestjs/common';
import { ResponseHandler } from './helpers/response-handler';

@Global()
@Module({
  providers: [ResponseHandler],
  exports: [ResponseHandler],
})
export class CommonModule {}

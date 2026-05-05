import { Module } from '@nestjs/common';
import { TrendService } from './trend.service';
import { TrendController } from './trend.controller';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  providers: [TrendService],
  controllers: [TrendController],
})
export class TrendModule {}

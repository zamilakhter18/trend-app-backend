import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupabaseModule } from './supabase/supabase.module';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { FeedModule } from './feed/feed.module';
import { TrendModule } from './trend/trend.module';
import { AiModule } from './ai/ai.module';
import { EngagementModule } from './engagement/engagement.module';
import { ProductModule } from './product/product.module';
import { ScoringModule } from './scoring/scoring.module';
import { IdentityModule } from './identity/identity.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 60, // 1 minute default TTL
      max: 100, // maximum number of items in cache
    }),
    ScheduleModule.forRoot(),
    SupabaseModule,
    AuthModule,
    ProfileModule,
    FeedModule,
    TrendModule,
    AiModule,
    EngagementModule,
    ProductModule,
    ScoringModule,
    IdentityModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

})
export class AppModule {}

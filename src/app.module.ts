import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { CacheModule } from "@nestjs/cache-manager";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { SupabaseModule } from "./supabase/supabase.module";
import { AuthModule } from "./auth/auth.module";
import { ProfileModule } from "./profile/profile.module";
import { FeedModule } from "./feed/feed.module";
import { TrendModule } from "./trend/trend.module";
import { AiModule } from "./ai/ai.module";
import { InteractionModule } from "./interaction/interaction.module";
import { ProductModule } from "./product/product.module";
import { ScoringModule } from "./scoring/scoring.module";
import { IdentityModule } from "./identity/identity.module";
import { IngestionModule } from "./ingestion/ingestion.module";
import { SponsoredContentModule } from "./sponsored-content/sponsored-content.module";
import { BrandModule } from "./brand/brand.module";
import { UploadModule } from "./upload/upload.module";
import { CommonModule } from "./common/common.module";
import { DbModule } from "./db/db.module";
import { SearchModule } from "./search/search.module";
import { RewardsModule } from "./rewards/rewards.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { APP_GUARD } from "@nestjs/core";
import { AuthGuard } from "./common/guards/auth.guard";
import { RolesGuard } from "./common/guards/role.guard";
import { UserProfile } from "./db/entities/UserProfile.entity";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: false,
      ssl: {
        rejectUnauthorized: false,
      },
    }),
    TypeOrmModule.forFeature([UserProfile]),
    CacheModule.register({
      isGlobal: true,
      ttl: 60, // 1 minute default TTL
      max: 100, // maximum number of items in cache
    }),
    ScheduleModule.forRoot(),
    CommonModule,
    DbModule,
    SupabaseModule,
    AuthModule,
    ProfileModule,
    FeedModule,
    TrendModule,
    AiModule,
    InteractionModule,
    ProductModule,
    ScoringModule,
    IdentityModule,
    IngestionModule,
    SponsoredContentModule,
    BrandModule,
    UploadModule,
    SearchModule,
    RewardsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}

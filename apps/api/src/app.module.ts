import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { IdentityModule } from './identity/identity.module';
import { CatalogModule } from './catalog/catalog.module';
import { RightsModule } from './rights/rights.module';
import { PlaybackModule } from './playback/playback.module';
import { AiModule } from './ai/ai.module';
import { PlaylistModule } from './playlist/playlist.module';
import { UploadModule } from './upload/upload.module';
import { SearchModule } from './search/search.module';
import { RecommendationModule } from './recommendation/recommendation.module';
import { AdminModule } from './admin/admin.module';
import { CreatorModule } from './creator/creator.module';
import { PrismaModule } from './common/prisma.module';
import { HealthController } from './common/health.controller';
import { RateLimitInterceptor } from './common/interceptors/rate-limit.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    IdentityModule,
    CatalogModule,
    RightsModule,
    PlaybackModule,
    AiModule,
    PlaylistModule,
    UploadModule,
    SearchModule,
    RecommendationModule,
    AdminModule,
    CreatorModule,
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: RateLimitInterceptor,
    },
  ],
})
export class AppModule {}

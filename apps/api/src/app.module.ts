import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IdentityModule } from './identity/identity.module';
import { CatalogModule } from './catalog/catalog.module';
import { RightsModule } from './rights/rights.module';
import { PlaybackModule } from './playback/playback.module';
import { AiModule } from './ai/ai.module';
import { PlaylistModule } from './playlist/playlist.module';
import { PrismaModule } from './common/prisma.module';

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
  ],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { RightsModule } from '../rights/rights.module';

@Module({
  imports: [RightsModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}

import { Module } from '@nestjs/common';
import { RightsService } from './rights.service';
import { RightsController } from './rights.controller';
import { EntitlementService } from './entitlement.service';

@Module({
  controllers: [RightsController],
  providers: [RightsService, EntitlementService],
  exports: [RightsService, EntitlementService],
})
export class RightsModule {}

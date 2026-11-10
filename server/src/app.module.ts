import { DbModule } from '@app/db';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { redisConnection } from './common/utils/redis.js';
import { WorkflowModule } from './workflow/workflow.module.js';

@Module({
  imports: [
    DbModule,
    BullModule.forRoot({ connection: redisConnection() }),
    WorkflowModule,
  ],
})
export class AppModule {}

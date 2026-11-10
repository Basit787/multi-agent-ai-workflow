import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { WORKFLOW_QUEUE } from './workflow.constants.js';
import { WorkflowController } from './workflow.controller.js';
import { WorkflowEvents } from './workflow.events.js';
import { WorkflowProcessor } from './workflow.processor.js';
import { WorkflowService } from './workflow.service.js';

@Module({
  imports: [BullModule.registerQueue({ name: WORKFLOW_QUEUE })],
  controllers: [WorkflowController],
  providers: [WorkflowService, WorkflowEvents, WorkflowProcessor],
})
export class WorkflowModule {}

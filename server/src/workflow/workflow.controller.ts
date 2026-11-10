import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  type MessageEvent,
  Param,
  ParseIntPipe,
  Post,
  Req,
  Sse,
  UseGuards,
} from '@nestjs/common';
import { interval, map, merge, type Observable } from 'rxjs';
import { AuthGuard, Roles, RolesGuard } from '../auth/auth.guard.js';
import type { AuthRequest } from '../auth/types/auth.types.js';
import { TaskDto } from './dto/task.dto.js';
import { WorkflowEvents } from './workflow.events.js';
import { WorkflowService } from './workflow.service.js';

@Controller('workflows')
@UseGuards(AuthGuard)
export class WorkflowController {
  constructor(
    private readonly workflowService: WorkflowService,
    private readonly workflowEvents: WorkflowEvents,
  ) {}

  @Get()
  list(@Req() req: AuthRequest) {
    return this.workflowService.listForUser(req.user.id);
  }

  @Post()
  create(@Req() req: AuthRequest, @Body() body: TaskDto) {
    return this.workflowService.start(body.task, req.user.id);
  }

  @Post('run')
  @HttpCode(200)
  run(@Req() req: AuthRequest, @Body() body: TaskDto) {
    return this.workflowService.run(body.task, req.user.id);
  }

  @Get('all')
  @UseGuards(RolesGuard)
  @Roles(['admin'])
  all() {
    return this.workflowService.listAll();
  }

  @Sse('events')
  events(@Req() req: AuthRequest): Observable<MessageEvent> {
    return merge(
      this.workflowEvents
        .forUser(req.user.id)
        .pipe(map((data) => ({ type: 'workflow', data }))),
      interval(25_000).pipe(map(() => ({ type: 'ping', data: '' }))),
    );
  }

  @Get(':id')
  get(@Req() req: AuthRequest, @Param('id', ParseIntPipe) id: number) {
    return this.workflowService.get(id, req.user);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Req() req: AuthRequest, @Param('id', ParseIntPipe) id: number) {
    await this.workflowService.remove(id, req.user);
  }
}

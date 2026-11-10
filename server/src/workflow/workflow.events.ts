import { Injectable } from '@nestjs/common';
import { filter, firstValueFrom, map, type Observable, Subject } from 'rxjs';
import type { WorkflowEvent } from './types/workflow.types.js';

type UserEvent = WorkflowEvent & { userId: number | null };

@Injectable()
export class WorkflowEvents {
  private readonly events$ = new Subject<UserEvent>();

  emit(event: UserEvent) {
    this.events$.next(event);
  }

  forUser(userId: number): Observable<WorkflowEvent> {
    return this.events$.pipe(
      filter((event) => event.userId === userId),
      map(({ userId: _, ...event }) => event),
    );
  }

  finished(workflowId: number) {
    return firstValueFrom(
      this.events$.pipe(
        filter(
          (event) =>
            event.workflowId === workflowId &&
            (event.status === 'completed' || event.status === 'failed'),
        ),
      ),
    );
  }
}

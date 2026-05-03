import { inject, Injectable } from '@angular/core';
import { TaskService } from '../../services/task';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as TaskActions from './task.actions';
import { catchError, map, mergeMap, of, switchMap } from 'rxjs';
import { Task, TaskLoad } from '../../core/models/task.model'; // Додано TaskLoad
import { formatError } from '../../share/utils/error.utils';

@Injectable()
export class TaskEffects {
  private actions$ = inject(Actions);
  private taskService = inject(TaskService);

  // Оновлений ефект завантаження з підтримкою пагінації (як на фото)
  loadTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.loadTasks),
      switchMap(({ page, pageSize, filter, status }) =>
        this.taskService.getTasks(page, pageSize, filter, status).pipe(
          map((response: TaskLoad) => 
            TaskActions.loadTasksSuccess({ 
              tasks: response.tasks, 
              total: response.total 
            })
          ),
          catchError(err => of(TaskActions.loadTasksFailure({ error: formatError(err) })))
        )
      )
    )
  );

  createTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.createTask),
      mergeMap(({ task }) =>
        this.taskService.createTask(task).pipe(
          map((createdTask: Task) => TaskActions.createTaskSuccess({ task: createdTask })),
          catchError(err => of(TaskActions.createTaskFailure({ error: formatError(err) })))
        )
      )
    )
  );

  updateTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.updateTask),
      switchMap(({ task }) =>
        this.taskService.updateTask(task.id, task).pipe(
          map((updatedTask: Task) => TaskActions.updateTaskSuccess({ task: updatedTask })),
          catchError(err => of(TaskActions.updateTaskFailure({ error: formatError(err) })))
        )
      )
    )
  );

  patchTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.patchTask),
      switchMap(({ id, changes }) =>
        this.taskService.patchTask(id, changes).pipe(
          map((updatedTask: Task) => TaskActions.patchTaskSuccess({ task: updatedTask })),
          catchError(err => of(TaskActions.patchTaskFailure({ error: formatError(err) })))
        )
      )
    )
  );

  deleteTask$ = createEffect(() =>
  this.actions$.pipe(
    ofType(TaskActions.deleteTask),
    mergeMap(({ id }) =>
      this.taskService.deleteTask(id).pipe(
        map((res: any) => TaskActions.deleteTaskSuccess({ id, total: res.total })),
        catchError(err => of(TaskActions.deleteTaskFailure({ error: formatError(err) })))
      )
    )
  )
);
}
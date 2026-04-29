import { inject, Injectable } from '@angular/core';
import { TaskService } from '../../services/task'; // Перевірте, чи ваш сервіс точно в task.ts (а не task.service.ts)
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as TaskActions from './task.actions';
import { catchError, map, mergeMap, of, switchMap } from 'rxjs';
import { Task } from '../../core/models/task.model';
import { formatError } from '../../share/utils/error.utils';

@Injectable()
export class TaskEffects {
  // Змінні класу
  private actions$ = inject(Actions);
  private taskService = inject(TaskService);

  // ВАЖЛИВО: Усі ефекти тепер знаходяться ВСЕРЕДИНІ класу!

  loadTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.loadTasks),
      switchMap(({ status }) =>
        this.taskService.getTasks(status).pipe(
          map((tasks: Task[]) => TaskActions.loadTasksSuccess({ tasks })),
          catchError(err => of(TaskActions.loadTasksFailure({ error: formatError(err) }))) // Виправлено: loadTasksFailure
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
          catchError(err => of(TaskActions.createTaskFailure({ error: formatError(err) }))) // Виправлено: createTaskFailure
        )
      )
    )
  );

  updateTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.updateTask),
      switchMap(({ task }) =>
        // Якщо taskService вимагає id окремо, передаємо task.id. Якщо ні - тільки task.
        this.taskService.updateTask(task.id, task).pipe(
          map((updatedTask: Task) => TaskActions.updateTaskSuccess({ task: updatedTask })),
          catchError(err => of(TaskActions.updateTaskFailure({ error: formatError(err) }))) // Виправлено
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
          map(() => TaskActions.deleteTaskSuccess({ id })),
          catchError(err => of(TaskActions.deleteTaskFailure({ error: formatError(err) }))) // Виправлено
        )
      )
    )
  );
} // Фігурна дужка закриває клас тут
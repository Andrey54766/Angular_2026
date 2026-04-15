import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { tap, catchError, finalize, switchMap } from 'rxjs/operators'; // Додано оператори
import { Task } from '../../core/models/task.model';
import { TaskService } from '../../services/task';

@Injectable({
  providedIn: 'root',
})
export class TaskStateService { // Перейменовано для відповідності іншим файлам
  private _tasks$ = new BehaviorSubject<Task[]>([]);
  private _selectedTask$ = new BehaviorSubject<Task | null>(null);
  private _loading$ = new BehaviorSubject<boolean>(false);
  private _error$ = new BehaviorSubject<string | null>(null);

  public readonly tasks$: Observable<Task[]> = this._tasks$.asObservable();
  public readonly selectedTask$: Observable<Task | null> = this._selectedTask$.asObservable();
  public readonly loading$: Observable<boolean> = this._loading$.asObservable();
  public readonly error$: Observable<string | null> = this._error$.asObservable();

  constructor(private taskService: TaskService) {}

  loadTasks(status?: string): void {
    this._loading$.next(true);
    this._error$.next(null);

    this.taskService.getTasks(status)
      .pipe(
        tap((tasks: Task[]) => this._tasks$.next(tasks)),
        catchError(err => {
          this._error$.next(err.message);
          return throwError(() => err.message);
        }),
        finalize(() => this._loading$.next(false))
      ).subscribe();
  }

  createTask(task: Task): void {
    this._loading$.next(true);
    this._error$.next(null);

    this.taskService.createTask(task)
      .pipe(
        switchMap((added: Task) => {
          const current: Task[] = this._tasks$.getValue();
          return of([...current, added]);
        }),
        tap((updatedTasks: Task[]) => this._tasks$.next(updatedTasks)),
        catchError(err => {
          this._error$.next(err.message);
          return throwError(() => err.message);
        }),
        finalize(() => this._loading$.next(false))
      )
      .subscribe();
  }

  updateTask(task: Task): void {
    this._loading$.next(true);
    this._error$.next(null);

    this.taskService.updateTask(task.id, task)
      .pipe(
        switchMap(updated => {
          const current = this._tasks$.getValue();
          const updatedTasks = current.map(t => t.id === updated.id ? updated : t);
          return of(updatedTasks);
        }),
        tap((updatedTasks: Task[]) => this._tasks$.next(updatedTasks)),
        catchError(err => {
          this._error$.next(err.message);
          return throwError(() => err.message);
        }),
        finalize(() => this._loading$.next(false))
      )
      .subscribe();
  }

  patchTask(id: string, task: Partial<Task>): void {
    this._loading$.next(true);
    this._error$.next(null);

    this.taskService.patchTask(id, task)
      .pipe(
        switchMap(patched => {
          const updated = this._tasks$.getValue().map(t =>
            t.id === patched.id ? { ...t, ...patched } : t
          );
          return of(updated);
        }),
        tap((updatedTasks: Task[]) => this._tasks$.next(updatedTasks)),
        catchError(err => {
          this._error$.next(err.message);
          return throwError(() => err.message);
        }),
        finalize(() => this._loading$.next(false))
      )
      .subscribe();
  }

  deleteTask(id: string): void {
    this._loading$.next(true);
    this._error$.next(null);

    this.taskService.deleteTask(id)
      .pipe(
        switchMap(() => {
          const filtered = this._tasks$.getValue().filter(t => t.id !== id);
          return of(filtered);
        }),
        tap(updatedList => this._tasks$.next(updatedList)), // Виправлено опечатку updared -> updated
        catchError(err => {
          this._error$.next(err.message);
          return throwError(() => err.message);
        }),
        finalize(() => this._loading$.next(false))
      )
      .subscribe();
  }

  selectTask(task: Task | null): void {
    this._selectedTask$.next(task);
  }
}
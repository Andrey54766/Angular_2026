import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { tap, catchError, finalize, switchMap } from 'rxjs/operators';
import { Task } from '../../core/models/task.model';
import { TaskService } from '../../services/task';

@Injectable({
  providedIn: 'root',
})
export class TaskStateService {
  private _tasks$ = new BehaviorSubject<Task[]>([]);
  private _selectedTask$ = new BehaviorSubject<Task | null>(null);
  private _loading$ = new BehaviorSubject<boolean>(false);
  private _error$ = new BehaviorSubject<string | null>(null);

  public readonly tasks$: Observable<Task[]> = this._tasks$.asObservable();
  public readonly selectedTask$: Observable<Task | null> = this._selectedTask$.asObservable();
  public readonly loading$: Observable<boolean> = this._loading$.asObservable();
  public readonly error$: Observable<string | null> = this._error$.asObservable();

  constructor(@Inject(TaskService) private taskService: TaskService) { }

  // Правильна реалізація очищення помилки
  clearError(): void {
    this._error$.next(null);
  }

  // Допоміжний метод для обробки повідомлень про помилки
  private getErrorMessage(err: any): string {
    if (err.error?.errors) {
      return `${err.error.message}. ${err.error.errors}`;
    }
    return err.error?.message || err.message || 'Помилка сервера';
  }

  loadTasks(status?: string): void {
    this._loading$.next(true);
    this.clearError();

    this.taskService.getTasks(status)
      .pipe(
        tap((tasks: Task[]) => this._tasks$.next(tasks)),
        catchError(err => {
          this._error$.next(this.getErrorMessage(err));
          return throwError(() => err);
        }),
        finalize(() => this._loading$.next(false))
      ).subscribe();
  }

  createTask(task: Task): void {
    this._loading$.next(true);
    this.clearError();

    this.taskService.createTask(task)
      .pipe(
        switchMap((added: Task) => {
          const current = this._tasks$.getValue();
          return of([...current, added]);
        }),
        tap((updatedTasks: Task[]) => this._tasks$.next(updatedTasks)),
        catchError(err => {
          this._error$.next(this.getErrorMessage(err));
          return throwError(() => err);
        }),
        finalize(() => this._loading$.next(false))
      )
      .subscribe();
  }

  updateTask(task: Task): void {
    this._loading$.next(true);
    this.clearError();

    this.taskService.updateTask(task.id, task)
      .pipe(
        switchMap((updated: Task) => {
          const current = this._tasks$.getValue();
          const newList = current.map(t => t.id === updated.id ? updated : t);
          return of(newList);
        }),
        tap((updatedTasks: Task[]) => this._tasks$.next(updatedTasks)),
        catchError(err => {
          this._error$.next(this.getErrorMessage(err));
          return throwError(() => err);
        }),
        finalize(() => this._loading$.next(false))
      )
      .subscribe();
  }

  patchTask(id: string, task: Partial<Task>): void {
    this.clearError();

    this.taskService.patchTask(id, task)
      .pipe(
        switchMap((patched: Task) => {
          const current = this._tasks$.getValue();
          const newList = current.map(t => 
            t.id === patched.id ? { ...t, ...patched } : t
          );
          return of(newList);
        }),
        tap((updatedTasks: Task[]) => this._tasks$.next(updatedTasks)),
        catchError(err => {
          this._error$.next(this.getErrorMessage(err));
          return throwError(() => err);
        })
      )
      .subscribe();
  }

  deleteTask(id: string): void {
    this._loading$.next(true);
    this.clearError();

    this.taskService.deleteTask(id).pipe(
      switchMap(() => {
        const filtered = this._tasks$.getValue().filter(t => t.id !== id);
        return of(filtered);
      }),
      tap((updatedList: Task[]) => this._tasks$.next(updatedList)),
      catchError(err => {
        this._error$.next(this.getErrorMessage(err));
        return throwError(() => err);
      }),
      finalize(() => this._loading$.next(false))
    ).subscribe();
  }

  selectTask(task: Task | null): void {
    this._selectedTask$.next(task);
  }
}
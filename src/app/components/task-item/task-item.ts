import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Task } from '../../core/models/task.model';
import { TaskStatus } from '../../core/models/status.enum';
import { MatSelectChange } from '@angular/material/select';

// ІМПОРТИ NgRx ТА RxJS (Додано)
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.state';
import * as TaskActions from '../../store/task/task.actions';
import * as TaskSelectors from '../../store/task/task.selectors';
import { selectRouteParams } from '../../store/router/router.selectors';
import { Observable, Subject } from 'rxjs';
import { takeUntil, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-task-item',
  standalone: false,
  templateUrl: './task-item.html',
  styleUrl: './task-item.scss'
})
export class TaskItemComponent implements OnInit, OnDestroy {

  task$!: Observable<Task | null>;
  private destroy$ = new Subject<void>();
  protected readonly TaskStatus = TaskStatus;

  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
  this.task$ = this.store.select(selectRouteParams).pipe(
    takeUntil(this.destroy$),
    switchMap(params => {
      const id = params['id'];
      // ДОДАНО: логування для перевірки
      console.log('Шукаємо завдання з ID із URL:', id); 
      return this.store.select(TaskSelectors.selectTaskById(id));
    }),
    // Якщо завдання не знайдено в стейті, спробуємо його завантажити (опціонально)
    tap(task => {
      if (!task) console.warn('Завдання не знайдено у глобальному стейті');
    })
  );
}

  updateStatus(id: string, event: MatSelectChange): void {
    this.store.dispatch(TaskActions.patchTask({ 
      id: id, 
      changes: { status: event.value as TaskStatus } 
    }));
  }

  getStatusClass(status: TaskStatus): string {
    return `chip-${status.toLowerCase()}`;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
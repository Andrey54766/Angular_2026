import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core'; 
import { FormControl } from '@angular/forms'; 
import { Task } from '../../core/models/task.model';
import { TaskStatus } from '../../core/models/status.enum';
import { TaskFormComponent } from '../task-form/task-form'; 
import { MatDialog } from '@angular/material/dialog'; 
import { MatSnackBar } from '@angular/material/snack-bar'; 
import { MatSelectChange } from '@angular/material/select';
import { Observable, Subject, combineLatest } from 'rxjs'; 
import { takeUntil, startWith, debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.state';
import * as TaskActions from '../../store/task/task.actions';
import * as TaskSelectors from '../../store/task/task.selectors';

@Component({
  selector: 'app-task-list',
  standalone: false,
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss'
})
export class TaskListComponent implements OnInit, OnDestroy {
  
  private destroy$ = new Subject<void>();
  myTasks$!: Observable<Task[]>;
  hasLoading: boolean = false;
  filterControl = new FormControl('');
  
  loading$!: Observable<boolean>;
  error$!: Observable<string | null>;

  constructor(
    private store: Store<AppState>, 
    public dialog: MatDialog,       
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    this.store.dispatch(TaskActions.loadTasks({}));

    this.loading$ = this.store.select(TaskSelectors.selectTaskLoading);
    this.error$ = this.store.select(TaskSelectors.selectTaskError);

    this.myTasks$ = combineLatest([
      this.store.select(TaskSelectors.selectFilteredTasks),
      this.filterControl.valueChanges.pipe(
        startWith(''),
        debounceTime(300),
        distinctUntilChanged()
      )
    ]).pipe(
      map(([tasks, filter]): Task[] => {
        const query = filter?.toLowerCase() || '';
        return tasks.filter(task => 
          task.title.toLowerCase().includes(query) || 
          (task.description && task.description.toLowerCase().includes(query)) || 
          task.assignee.toLowerCase().includes(query)
        );
      })
    );

    this.error$.pipe(takeUntil(this.destroy$)).subscribe(error => {
      if (error) {
        this.snackBar.open(error, 'Закрити', { 
          duration: 4000, 
          panelClass: ['error-snackbar'] 
        });
        this.store.dispatch(TaskActions.selectTask({ id: null }));
      }
    });

    this.loading$.pipe(takeUntil(this.destroy$)).subscribe(loading => {
      this.hasLoading = loading;
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openDialog(): void {
    this.dialog.open(TaskFormComponent, {
      height: '70vh',
      width: '80vw',
    });
  }

  // ВИПРАВЛЕНО (помилка TS2554): Прибрали аргумент task, бо id вже в Store
  editTask(): void { 
    this.openDialog();
  }

  // ВИПРАВЛЕНО (помилка TS2345): Змінили тип на any для сумісності з подією
  deleteTask(event: any): void {
    const id = typeof event === 'string' ? event : event.id;
    if (id) {
      this.store.dispatch(TaskActions.deleteTask({ id }));
    }
  }

  onSelected(event: MatSelectChange): void {
    this.store.dispatch(TaskActions.setFilterStatus({ status: event.value }));
  }

  protected readonly TaskStatus = TaskStatus;
}
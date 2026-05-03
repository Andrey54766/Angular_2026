import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core'; 
import { Router } from '@angular/router'; 
import { FormControl } from '@angular/forms'; 
import { Task } from '../../core/models/task.model';
import { TaskStatus } from '../../core/models/status.enum';
import { TaskFormComponent } from '../task-form/task-form'; 
import { MatDialog } from '@angular/material/dialog'; 
import { MatSnackBar } from '@angular/material/snack-bar'; 
import { MatSelectChange } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table'; 
import { MatPaginator, PageEvent } from '@angular/material/paginator'; 
import { Observable, Subject, combineLatest, take } from 'rxjs'; 
import { takeUntil, startWith, debounceTime, distinctUntilChanged, filter, tap, switchMap, map } from 'rxjs/operators';

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
export class TaskListComponent implements OnInit, AfterViewInit, OnDestroy {

  displayedColumns: string[] = ['title', 'description', 'assignee', 'dueDate', 'status', 'actions'];
  dataSource = new MatTableDataSource<Task>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private destroy$ = new Subject<void>();
  tasks$!: Observable<Task[]>;
  loading$!: Observable<boolean>;
  error$!: Observable<string | null>;
  totalTasks$!: Observable<number>;

  hasLoading: boolean = false;
  
  // Контролери для фільтрації
  filterControl = new FormControl('');
  statusControl = new FormControl('all'); 

  constructor(
    private store: Store<AppState>,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router, 
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Ініціалізація селекторів
    this.tasks$ = this.store.select(TaskSelectors.selectAllTasks);
    this.loading$ = this.store.select(TaskSelectors.selectTaskLoading);
    this.error$ = this.store.select(TaskSelectors.selectTaskError);
    this.totalTasks$ = this.store.select(TaskSelectors.selectTaskTotal);

    // Скидання на першу сторінку при зміні тексту пошуку
    this.filterControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => this.paginator?.firstPage());

    // Скидання на першу сторінку при зміні статусу
    this.statusControl.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => this.paginator?.firstPage());

    // Оновлення даних у таблиці при зміні стейту
    this.tasks$.pipe(takeUntil(this.destroy$)).subscribe(tasks => {
      this.dataSource.data = tasks;
    });

    // Обробка помилок
    this.error$.pipe(takeUntil(this.destroy$)).subscribe(error => {
      if (error) {
        this.snackBar.open(error, 'Закрити', { duration: 4000 });
        this.store.dispatch(TaskActions.selectTask({ id: null }));
      }
    });

    // Стан завантаження (спінер)
    this.loading$.pipe(takeUntil(this.destroy$)).subscribe(loading => {
      this.hasLoading = loading;
      this.cdr.detectChanges();
    });
  }

  ngAfterViewInit(): void {
    // Головний потік пагінації та фільтрації
    this.paginator.page.pipe(
      startWith({ pageIndex: 0, pageSize: 5 } as PageEvent),
      switchMap(({ pageIndex, pageSize }) => 
        combineLatest([
          this.filterControl.valueChanges.pipe(startWith(this.filterControl.value)),
          this.statusControl.valueChanges.pipe(startWith(this.statusControl.value))
        ]).pipe(
          takeUntil(this.destroy$),
          tap(([filterValue, statusValue]) => {
            this.loadTasks(
              pageIndex + 1, 
              pageSize, 
              filterValue ?? '', 
              statusValue === 'all' ? '' : (statusValue ?? '')
            );
          })
        )
      ),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  // Метод, якого не вистачало (виправляє помилку TS2339)
  onSelected(event: MatSelectChange): void {
    // Сторінка скинеться автоматично через підписку в ngOnInit, 
    // але ми можемо залишити метод для додаткової логіки.
    this.paginator.firstPage();
  }

  private loadTasks(page: number, pageSize: number, filter = '', status = ''): void {
    this.store.dispatch(TaskActions.loadTasks({ page, pageSize, filter, status }));
  }

  private goToLastPage(): void {
    this.totalTasks$.pipe(take(1)).subscribe(total => {
      const lastPage = Math.ceil((total + 1) / this.paginator.pageSize);
      this.paginator.pageIndex = lastPage - 1;
      this.loadTasks(lastPage, this.paginator.pageSize, this.filterControl.value ?? '', this.statusControl.value ?? '');
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      height: '70vh',
      width: '80vw',
    });

    dialogRef.afterClosed().pipe(
      filter(result => result === 'created' || result === 'updated'),
      takeUntil(this.destroy$)
    ).subscribe((result) => {
      if (result === 'created') this.goToLastPage();
    });
  }

  viewTask(id: string): void {
    this.router.navigate([{ outlets: { primary: ['tasks', 'view', id], aside: null } }]);
  }

  editTask(id: string): void { 
    this.store.dispatch(TaskActions.selectTask({ id }));
    this.openDialog();
  }

  deleteTask(id: string): void {
    this.store.dispatch(TaskActions.deleteTask({ id }));
    // Після видалення перевіряємо, чи не залишилася порожня сторінка (логіка була раніше)
    this.tasks$.pipe(take(1)).subscribe(tasks => {
      if (tasks.length === 1 && this.paginator.pageIndex > 0) {
        this.paginator.previousPage();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected readonly TaskStatus = TaskStatus;
}
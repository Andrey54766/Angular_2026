import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core'; 
import { FormControl } from '@angular/forms'; 
import { Task } from '../../core/models/task.model';
import { TaskStatus } from '../../core/models/status.enum';
import { TaskStateService } from '../../share/state/task-state';
import { TaskFormComponent } from '../task-form/task-form'; 
import { MatDialog } from '@angular/material/dialog'; 
import { MatSnackBar } from '@angular/material/snack-bar'; 
import { MatSelectChange } from '@angular/material/select';
import { Observable, Subject, combineLatest } from 'rxjs'; 
import { takeUntil, startWith, debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

@Component({
  selector: 'app-task-list',
  standalone: false,
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss'
})
export class TaskListComponent implements OnInit, OnDestroy {
  
  private destroy$ = new Subject<void>();
  myTasks$!: Observable<Task[]>;
  
  selectedStatus: TaskStatus | 'all' = 'all';
  editingTask: Task | null = null;
  hasLoading: boolean = false;

  filterControl = new FormControl('');

  constructor(
    public taskStateService: TaskStateService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef // Додано для виправлення NG0100
  ) {}

  ngOnInit(): void {
    // 1. Налаштовуємо потік даних (State + Search)
    this.myTasks$ = combineLatest([
      this.taskStateService.tasks$,
      this.filterControl.valueChanges.pipe(
        startWith(''),
        debounceTime(300),
        distinctUntilChanged()
      )
    ]).pipe(
      map(([tasks, filter]: [Task[], string | null]): Task[] => {
        const query = filter?.toLowerCase() || '';
        return tasks.filter(task => 
          task.title.toLowerCase().includes(query) || 
          (task.description && task.description.toLowerCase().includes(query)) || 
          task.assignee.toLowerCase().includes(query)
        );
      })
    );

    // 2. Підписка на завантаження з примусовим детектуванням змін (FIX NG0100)
    this.taskStateService.loading$.pipe(takeUntil(this.destroy$)).subscribe(loading => {
      this.hasLoading = loading;
      this.cdr.detectChanges(); 
    });

    // 3. Підписка на помилки
    this.taskStateService.error$.pipe(takeUntil(this.destroy$)).subscribe(error => {
      if (error) {
        this.snackBar.open(error, 'Закрити', { duration: 4000 });
        this.taskStateService.clearError(); 
      }
    });

    // 4. Початковий завантаження
    setTimeout(() => this.taskStateService.loadTasks());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  editTask(task: Task): void {
    this.taskStateService.selectTask(task);
    this.openDialog();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      height: '70vh',
      width: '80vw',
    });
    dialogRef.afterClosed().subscribe(() => {
      this.taskStateService.selectTask(null);
    });
  }

  deleteTask(id: string): void {
    this.taskStateService.deleteTask(id);
  }

  onSelected(event: MatSelectChange): void {
    this.selectedStatus = event.value;
    this.taskStateService.loadTasks(event.value === 'all' ? undefined : event.value);
  }

  protected readonly TaskStatus = TaskStatus;
}
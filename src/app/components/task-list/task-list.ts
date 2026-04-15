import { Component, OnInit, OnDestroy } from '@angular/core'; 
import { Task } from '../../core/models/task.model';
import { TaskStatus } from '../../core/models/status.enum';
import { TaskStateService } from '../../share/state/task-state';
import { TaskFormComponent } from '../task-form/task-form'; 
import { MatDialog } from '@angular/material/dialog'; 
import { Observable, Subject } from 'rxjs'; 

@Component({
  selector: 'app-task-list',
  standalone: false,
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss'
})
export class TaskListComponent implements OnInit, OnDestroy {
  
  private destroy$ = new Subject<void>();
  myTasks$!: Observable<Task[]>;
  
  selectedStatus: TaskStatus | '' = '';
  editingTask: Task | null = null;

  constructor(
    public taskStateService: TaskStateService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // 1. Пов'язуємо змінну з потоком даних у стейті
    this.myTasks$ = this.taskStateService.tasks$; 
    // 2. Ініціюємо перше завантаження даних
    this.taskStateService.loadTasks(); 
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  statusChange(task: Task): void {
    console.log('Статус змінено для завдання:', task.title);
  }

  addTask(task: Task): void {
    if (this.editingTask) {
      this.taskStateService.updateTask(task);
      this.editingTask = null;
    } else {
      this.taskStateService.createTask(task);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      height: '70vh',
      width: '80vw',
      // Передаємо поточне завдання для редагування, якщо воно є
      data: { editTask: this.editingTask } 
    });

    dialogRef.afterClosed().subscribe(() => {
      this.editingTask = null;
      this.taskStateService.selectTask(null);
    });
  }

  editTask(task: Task): void {
    this.editingTask = { ...task };
    this.taskStateService.selectTask(task); 
    this.openDialog(); 
  }

  deleteTask(id: string): void {
    this.taskStateService.deleteTask(id);
  }

  onSelected(event: any): void {
    // Для MatSelect значення знаходиться безпосередньо в event.value
    this.selectedStatus = event.value;
    this.taskStateService.loadTasks(this.selectedStatus === '' ? undefined : this.selectedStatus);
  }

  protected readonly TaskStatus = TaskStatus;
}
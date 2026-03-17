import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Task } from '../../core/models/task.model';
import { TaskStatus } from '../../core/models/status.enum';
// ДОДАНО: імпорт сервісу
import { TaskService } from '../../services/task'; 

@Component({
  selector: 'app-task-item',
  standalone: false,
  templateUrl: './task-item.html',
  styleUrl: './task-item.scss'
})
export class TaskItemComponent {
  @Input() task!: Task;
  @Output() taskDeleted = new EventEmitter<number>();
  @Output() taskEdited: EventEmitter<Task> = new EventEmitter<Task>();

  protected readonly TaskStatus = TaskStatus;

  // ВИПРАВЛЕНО: підключаємо сервіс через конструктор
  constructor(private taskService: TaskService) {}

  deleteTask(id: number | undefined): void {
    if (!id) return; 
    this.taskDeleted.emit(id);
  }

  editTask(): void {
    this.taskEdited.emit(this.task);
  }

  getStatusClasses() {
    return {
      'done': this.task.status === TaskStatus.DONE,
      'in-progress': this.task.status === TaskStatus.IN_PROGRESS,
      'todo': this.task.status === TaskStatus.TODO
    };
  }

  updateStatus(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;

    if (!this.task.id) return;

    // Тепер taskService визначений і метод спрацює
    this.taskService.patchTask(this.task.id, { status: selectedValue as TaskStatus }).subscribe({
      next: (updatedTask: Task) => {
        // Оновлюємо статус в самому об'єкті, щоб Angular перемалював текст у спані
        this.task.status = updatedTask.status;
      },
      error: (error: any) => console.error('Помилка оновлення статусу', error),
    });
  }
}
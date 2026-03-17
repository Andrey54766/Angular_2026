import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Task } from '../../core/models/task.model';
import { TaskStatus } from '../../core/models/status.enum';

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
  taskService: any;

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
  const selectedValue: string = (event.target as HTMLSelectElement).value;

  if (!this.task.id) return;

  this.taskService.patchTask(this.task.id, { status: selectedValue as TaskStatus }).subscribe({
    next: (updatedTask: Task) => this.task.status = updatedTask.status,
    error: (error: any) => console.error('Помилка оновлення статусу', error),
  });
  }
}
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
  @Output() taskEdited = new EventEmitter<Task>();

  protected readonly TaskStatus = TaskStatus;

  deleteTask(id: number): void {
    this.taskDeleted.emit(id);
  }

  editTask(): void {
    this.taskEdited.emit(this.task);
  }

  getStatusClasses() {
    return {
      'status-done': this.task.status === TaskStatus.DONE,
      'status-progress': this.task.status === TaskStatus.IN_PROGRESS,
      'status-todo': this.task.status === TaskStatus.TODO
    };
  }

  updateStatus(event: any) {
    const statusValue = event.target.value as TaskStatus;
    this.task.status = statusValue;
  }
}
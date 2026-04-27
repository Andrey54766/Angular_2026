// 1. ПЕРЕВІРТЕ ІМПОРТ: EventEmitter має бути ТІЛЬКИ з '@angular/core'
import { Component, Input, Output, EventEmitter } from '@angular/core'; 

import { Task } from '../../core/models/task.model';
import { TaskStatus } from '../../core/models/status.enum';
import { TaskStateService } from '../../share/state/task-state';
import { MatSelectChange } from '@angular/material/select'; 

@Component({
  selector: 'app-task-item',
  standalone: false,
  templateUrl: './task-item.html',
  styleUrl: './task-item.scss' 
})
export class TaskItemComponent {
  
  @Input() task!: Task; 
  
  // 2. ВАЖЛИВО: Переконайтеся, що тут написано <string>, а не просто EventEmitter
  @Output() taskDeleted = new EventEmitter<string>();
  @Output() taskEdited = new EventEmitter<Task>();

  protected readonly TaskStatus = TaskStatus;

  constructor(private taskStateService: TaskStateService) {}

  deleteTask(id: string): void {
    if (!id) return;
    // 3. Викидаємо подію в батьківський компонент, передаючи йому рядок 'id'
    this.taskDeleted.emit(id); 
  }

  editTask(): void {
    this.taskEdited.emit(this.task);
  }

  getStatusClasses() {
    return {
      'done': this.task.status === TaskStatus.DONE,
      'todo': this.task.status === TaskStatus.TODO,
      'in-progress': this.task.status === TaskStatus.IN_PROGRESS
    };
  }

  updateStatus(event: MatSelectChange) {
    const selectedValue = event.value;

    if (!this.task.id) return;

    this.taskStateService.patchTask(this.task.id, { status: selectedValue as TaskStatus });
  }
}
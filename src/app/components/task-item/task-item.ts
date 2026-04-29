import { Component, Input, Output, EventEmitter } from '@angular/core'; 
import { Task } from '../../core/models/task.model';
import { TaskStatus } from '../../core/models/status.enum';
import { MatSelectChange } from '@angular/material/select'; 

// ІМПОРТИ NgRx (перевірте шлях до вашого store)
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.state';
import * as TaskActions from '../../store/task/task.actions';

@Component({
  selector: 'app-task-item',
  standalone: false,
  templateUrl: './task-item.html',
  styleUrl: './task-item.scss' 
})
export class TaskItemComponent {
  
  @Input() task!: Task; // отримуємо об'єкт завдання
  
  // Змінюємо тип емітера на void згідно з фото
  @Output() taskEdited: EventEmitter<void> = new EventEmitter<void>();

  protected readonly TaskStatus = TaskStatus;

  // Інжектимо Store замість сервісу
  constructor(private store: Store<AppState>) {}

  deleteTask(id: string): void {
    // Диспатчимо екшен видалення в Store
    this.store.dispatch(TaskActions.deleteTask({ id }));
  }

  editTask(): void {
    const id = this.task.id;
    // Повідомляємо Store, яке завдання обране, та емітимо подію для відкриття діалогу
    this.store.dispatch(TaskActions.selectTask({ id }));
    this.taskEdited.emit();
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
    const id = this.task.id;

    // Використовуємо patchTask екшен для часткового оновлення статусу
    this.store.dispatch(TaskActions.patchTask({ 
      id: id, 
      changes: { status: selectedValue as TaskStatus } 
    }));
  }
}
import { Pipe, PipeTransform } from '@angular/core';
import { TaskStatus } from '../../core/models/status.enum';

@Pipe({
  name: 'taskStatus',
  standalone: false
})
export class TaskStatusPipe implements PipeTransform {

  transform(status: TaskStatus): string {
    const statusMap: { [key in TaskStatus]: string } = {
      [TaskStatus.TODO]: 'До роботи',
      [TaskStatus.IN_PROGRESS]: 'В процесі',
      [TaskStatus.DONE]: 'Виконано'
    };

    return statusMap[status] || 'Невідомий статус';
  }

}
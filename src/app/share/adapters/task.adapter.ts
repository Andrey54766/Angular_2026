import { Task } from '../../core/models/task.model';
import { TaskApi } from '../../core/api/task-api.model';
import { TaskStatus } from '../../core/models/status.enum';

export class TaskAdapter {
  static fromAPI(response: TaskApi): Task {
    return {
      id: response._id,
      title: response.title,
      description: response.description || '',
      assignee: response.assignee,
      dueDate: response.dueDate ? response.dueDate.split('T')[0] : '', 
      status: response.status as TaskStatus
    }
  }

  static toAPI(task: Task): Omit<TaskApi, '_id'> {
  const date = task.dueDate ? new Date(task.dueDate) : new Date();
  const safeDate = !isNaN(date.getTime()) ? date.toISOString() : new Date().toISOString();

  return {
    title: task.title || 'Нове завдання', // ВАЖЛИВО: підставляємо значення, якщо пусто
    description: task.description || '',
    assignee: task.assignee || 'Невідомий', // ВАЖЛИВО: валідатор вимагає це поле!
    dueDate: safeDate,
    status: task.status || TaskStatus.TODO
  }
}

  static toPartialApi(partialTask: Partial<Task>): Partial<TaskApi> {
    const apiTask: any = {};
    if (partialTask.dueDate) {
      const d = new Date(partialTask.dueDate);
      if (!isNaN(d.getTime())) apiTask.dueDate = d.toISOString();
    }
    if (partialTask.status) apiTask.status = partialTask.status;
    if (partialTask.title) apiTask.title = partialTask.title;
    return apiTask;
  }
}
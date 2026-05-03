import { TaskApi, TaskLoadApi } from '../../core/api/task-api.model';
import { Task, TaskLoad } from '../../core/models/task.model';
import { TaskStatus } from '../../core/models/status.enum';

export class TaskAdapter {
  static fromAPI(response: any): Task {
    return {
      // ВИПРАВЛЕНО: беремо або id, або _id (якщо сервер прислав оригінальний об'єкт)
      id: response.id || response._id, 
      title: response.title,
      description: response.description || '',
      assignee: response.assignee,
      dueDate: response.dueDate ? response.dueDate.split('T')[0] : '', 
      status: response.status as TaskStatus
    }
  }

  static fromLoadAPI(response: any): TaskLoad {
    return {
      // Переконуємося, що кожне завдання проходить через fromAPI
      tasks: (response.tasks || response).map((task: any) => TaskAdapter.fromAPI(task)),
      total: response.total || 0
    };
  }

  // Ваші існуючі методи toAPI та toPartialApi залишаються нижче без змін...
  static toAPI(task: Task): Omit<TaskApi, '_id'> {
    const date = task.dueDate ? new Date(task.dueDate) : new Date();
    const safeDate = !isNaN(date.getTime()) ? date.toISOString() : new Date().toISOString();

    return {
      title: task.title,
      description: task.description || '',
      assignee: task.assignee,
      dueDate: safeDate,
      status: task.status
    };
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
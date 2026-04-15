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
      // Безпечно дістаємо дату у форматі YYYY-MM-DD
      dueDate: response.dueDate ? response.dueDate.split('T')[0] : '', 
      status: response.status as TaskStatus
    }
  }

  static toAPI(task: Task): Omit<TaskApi, '_id'> {
    // Перевіряємо валідність дати перед конвертацією в ISO
    let formattedDate = '';
    if (task.dueDate) {
      const d = new Date(task.dueDate);
      formattedDate = !isNaN(d.getTime()) ? d.toISOString() : new Date().toISOString();
    } else {
      formattedDate = new Date().toISOString();
    }

    return {
      title: task.title,
      description: task.description || '',
      assignee: task.assignee,
      dueDate: formattedDate,
      status: task.status
    }
  }

  static toPartialApi(partialTask: Partial<Task>): Partial<TaskApi> {
    const apiTask: any = {};
    
    if (partialTask.dueDate) {
      const d = new Date(partialTask.dueDate);
      if (!isNaN(d.getTime())) {
        apiTask.dueDate = d.toISOString();
      }
    }
    
    if (partialTask.status) {
      apiTask.status = partialTask.status;
    }
    
    // Додаємо інші поля, якщо вони є у Partial
    if (partialTask.title) apiTask.title = partialTask.title;
    if (partialTask.assignee) apiTask.assignee = partialTask.assignee;
    if (partialTask.description !== undefined) apiTask.description = partialTask.description;

    return apiTask;
  }
}
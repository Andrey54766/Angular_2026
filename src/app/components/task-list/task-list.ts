import { Component } from '@angular/core';
import { Task } from '../../core/models/task.model';
import { TaskStatus } from '../../core/models/status.enum';
import { tasks } from '../../core/moc_data/tasks';

@Component({
  selector: 'app-task-list',
  standalone: false,
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss'
})
export class TaskListComponent {
  myTasks: Task[] = tasks;
  selectedStatus: 'all' | TaskStatus = 'all'; 
  TaskStatus = TaskStatus;
  
  editingTask: Task | null = null;

  addTask(task: Task): void {
    if (this.editingTask) {

      this.myTasks = this.myTasks.map(t => 
        t.id === task.id ? { ...task } : t
      );
      this.editingTask = null; 
    } else {
      const maxId: number = this.myTasks.length > 0 
        ? Math.max(...this.myTasks.map(t => t.id)) 
        : 0;
      
      const newTask = {
        ...task,
        id: maxId + 1,
      };
      
      this.myTasks.push(newTask);
    }
  }

  editTask(task: Task): void {
    this.editingTask = { ...task };
  }

  onSelected(event: Event) {
    const element = event.target as HTMLSelectElement;
    this.selectedStatus = element.value as 'all' | TaskStatus;
  }

  deleteTask(id: number) {
    this.myTasks = this.myTasks.filter(t => t.id !== id);
  }
}
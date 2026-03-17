// import { Injectable } from '@angular/core';
// import {Task} from '../core/models/task.model'
// import {tasks} from '../core/moc_data/tasks'

// @Injectable({
//   providedIn: 'root',
// })
// export class TaskService {
  
//   private tasks: Task[] = [...tasks];

//   constructor() { }

//   addTask(newTask: Task): void {
//     const maxId = this.tasks.length > 0 ? Math.max(...this.tasks.map(task => task.id)) : 0;
//     newTask = {
//       ...newTask,
//       id: maxId + 1,
//     }
//     this.tasks.push(newTask);
//   }

//   updateTask(updateTask: Task): void { 
//     this.tasks = this.tasks.map(t => 
//       t.id === updateTask.id ? { ...updateTask } : t 
//     );
//   }

//   deleteTask(index: number): void {
//     this.tasks = this.tasks.filter(task => task.id !== index);
//   }

//   getTasks(): Task[] {
//     return this.tasks;
//   }



import { Inject, Injectable } from '@angular/core';
import { Task } from '../core/models/task.model';
// 1. ДОДАНО: HttpParams в імпорт сюди
import { HttpClient, HttpParams } from '@angular/common/http'; 
import { Observable } from 'rxjs';
import { AppConfig, CONFIG_TOKEN } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(
    private http: HttpClient,
    @Inject(CONFIG_TOKEN) private config: AppConfig
  ) {}

  // Оновлений метод з використанням HttpParams
  getTasks(status?: string): Observable<Task[]> {
    let params = new HttpParams();

    // Якщо статус передано, додаємо його до параметрів запиту
    if (status) {
      params = params.set('status', status);
    }

    return this.http.get<Task[]>(`${this.config.apiUrl}/v1/tasks`, { params: params });
  }

  createTask(newTask: Task): Observable<Task> {
    return this.http.post<Task>(`${this.config.apiUrl}/v1/tasks`, newTask);
  }

  updateTask(id: number, updateTask: Task): Observable<Task> {
    const { id: _, ...update } = updateTask;
    return this.http.put<Task>(`${this.config.apiUrl}/v1/tasks/${id}`, update);
  }

  patchTask(id: number, updateTask: Partial<Task>): Observable<Task> {
    return this.http.patch<Task>(`${this.config.apiUrl}/v1/tasks/${id}`, updateTask);
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.config.apiUrl}/v1/tasks/${id}`);
  }
}
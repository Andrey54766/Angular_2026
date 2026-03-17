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



// 1. ВИПРАВЛЕНО: 'Inject' з великої літери
import { Inject, Injectable } from '@angular/core'; 
import { Task } from '../core/models/task.model';
import { HttpClient } from '@angular/common/http';
// 2. ВИПРАВЛЕНО: Додано імпорт Observable, без нього метод не знає, що це таке
import { Observable } from 'rxjs'; 

// 3. ПЕРЕВІРТЕ ЦЕЙ ШЛЯХ: Якщо у вас папка називається 'config', а не 'share/config',
// змініть на '../config/config'
import { AppConfig, CONFIG_TOKEN } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(
    private http: HttpClient,
    // Тепер @Inject працюватиме, бо ми імпортували його з великої літери
    @Inject(CONFIG_TOKEN) private config: AppConfig
  ) {}

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.config.apiUrl}/v1/tasks`);
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
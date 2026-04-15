import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'; 
import { Observable } from 'rxjs';
// 1. ДОДАНО: імпорт оператора map
import { map } from 'rxjs/operators'; 

import { Task } from '../core/models/task.model';
// 2. ДОДАНО: імпорт інтерфейсу API та Адаптера (перевір шляхи)
import { TaskApi } from '../core/api/task-api.model';
import { TaskAdapter } from '../share/adapters/task.adapter';
import { AppConfig, CONFIG_TOKEN } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(
    private http: HttpClient,
    @Inject(CONFIG_TOKEN) private config: AppConfig
  ) {}

  getTasks(status?: string): Observable<Task[]> {
    let params = new HttpParams();

    if (status) {
      params = params.set('status', status);
    }

    // Отримуємо масив TaskApi та конвертуємо кожен елемент у Task
    return this.http.get<TaskApi[]>(`${this.config.apiUrl}/v2/tasks`, { params: params }).pipe(
      map((tasks: TaskApi[]): Task[] => tasks.map(task => TaskAdapter.fromAPI(task)))
    );
  }

  createTask(newTask: Task): Observable<Task> {
    // Конвертуємо Task у формат API перед відправкою
    return this.http.post<TaskApi>(`${this.config.apiUrl}/v2/tasks`, TaskAdapter.toAPI(newTask)).pipe(
      map((task: TaskApi): Task => TaskAdapter.fromAPI(task))
    );
  }

  updateTask(id: string, updateTask: Task): Observable<Task> {
    // Повне оновлення через адаптер
    return this.http.put<TaskApi>(`${this.config.apiUrl}/v2/tasks/${id}`, TaskAdapter.toAPI(updateTask)).pipe(
      map((task: TaskApi): Task => TaskAdapter.fromAPI(task))
    );
  }

  patchTask(id: string, updateTask: Partial<Task>): Observable<Task> {
    const formattedTask = TaskAdapter.toPartialApi(updateTask);
    // Відправляємо часткові дані на сервер
    return this.http.patch<TaskApi>(`${this.config.apiUrl}/v2/tasks/${id}`, { ...updateTask, ...formattedTask }).pipe(
      map((task: TaskApi): Task => TaskAdapter.fromAPI(task))
    );
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.config.apiUrl}/v2/tasks/${id}`);
  }
}
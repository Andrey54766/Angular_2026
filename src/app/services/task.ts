import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; // Додано для трансформації даних

import { Task } from '../core/models/task.model';
import { TaskApi } from '../core/api/task-api.model';
import { TaskAdapter } from '../share/adapters/task.adapter';
import { AppConfig, CONFIG_TOKEN } from '../config/config';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly baseUrl: string;

  constructor(
    private http: HttpClient,
    @Inject(CONFIG_TOKEN) private config: AppConfig
  ) {
    // ВИПРАВЛЕНО: додано /v2/ до шляху, щоб не було помилки 404
    this.baseUrl = `${this.config.apiUrl}/v2/tasks`;
  }

  getTasks(status?: string): Observable<Task[]> {
    let params = new HttpParams();
    if (status && status !== 'all') {
      params = params.set('status', status);
    }
    // Використовуємо адаптер для перетворення масиву з сервера
    return this.http.get<TaskApi[]>(this.baseUrl, { params }).pipe(
      map((tasks: TaskApi[]) => tasks.map(task => TaskAdapter.fromAPI(task)))
    );
  }

  createTask(task: Task): Observable<Task> {
    // Конвертуємо Task у TaskApi перед відправкою
    const apiData = TaskAdapter.toAPI(task);
    return this.http.post<TaskApi>(this.baseUrl, apiData).pipe(
      map(response => TaskAdapter.fromAPI(response))
    );
  }

  updateTask(id: string, task: Task): Observable<Task> {
    const apiData = TaskAdapter.toAPI(task);
    return this.http.put<TaskApi>(`${this.baseUrl}/${id}`, apiData).pipe(
      map(response => TaskAdapter.fromAPI(response))
    );
  }

  patchTask(id: string, task: Partial<Task>): Observable<Task> {
    const apiData = TaskAdapter.toPartialApi(task);
    return this.http.patch<TaskApi>(`${this.baseUrl}/${id}`, apiData).pipe(
      map(response => TaskAdapter.fromAPI(response))
    );
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
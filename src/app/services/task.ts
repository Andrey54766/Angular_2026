import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; // Додано для трансформації даних

import { Task, TaskLoad } from '../core/models/task.model';
import { TaskApi, TaskLoadApi } from '../core/api/task-api.model';
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

  getTasks(page: number, pageSize: number, filter?: string, status?: string): Observable<TaskLoad> {
  let params = new HttpParams()
    .set('page', page)
    .set('limit', pageSize);

  if (filter) params = params.set('filter', filter);
  if (status) params = params.set('status', status);

  return this.http.get<TaskLoadApi>(`${this.config.apiUrl}/v2/tasks`, { params: params }).pipe(
    map(TaskAdapter.fromLoadAPI)
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

  deleteTask(id: string): Observable<{ message: string, total: number }> {
  return this.http.delete<{ message: string, total: number }>(
    `${this.config.apiUrl}/v2/tasks/${id}`
  );
}
}
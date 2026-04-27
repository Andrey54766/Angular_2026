import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { TaskService } from './task';
import { CONFIG_TOKEN, AppConfig } from '../config/config';
import { Task } from '../core/models/task.model';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;
  const config: AppConfig = { apiUrl: 'http://localhost:3100/api' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: CONFIG_TOKEN, useValue: config }],
    });
    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call GET /tasks', () => {
    const expected: Task[] = [];
    service.getTasks().subscribe(tasks => expect(tasks).toEqual(expected));

    const req = httpMock.expectOne(`${config.apiUrl}/tasks`);
    expect(req.request.method).toBe('GET');
    req.flush(expected);
  });
});

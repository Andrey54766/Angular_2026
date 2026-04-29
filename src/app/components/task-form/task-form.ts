import { Component, OnInit, OnDestroy } from '@angular/core'; 
import { FormGroup, FormBuilder, Validators } from '@angular/forms'; // Використовуємо FormBuilder
import { Subject, Observable } from 'rxjs'; 
import { takeUntil } from 'rxjs/operators'; 
import { MatDialogRef } from '@angular/material/dialog'; 

import { Task } from '../../core/models/task.model'; 
import { TaskStatus } from '../../core/models/status.enum'; 
import { TaskFormValidator } from '../../share/directives/task-form.validator'; 

// Імпорти для NgRx
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.state';
import * as TaskActions from '../../store/task/task.actions';
import * as TaskSelectors from '../../store/task/task.selectors';

@Component({
  selector: 'app-task-form',
  standalone: false,
  templateUrl: './task-form.html',
  styleUrl: './task-form.scss',
})
export class TaskFormComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  selectedTask$!: Observable<Task | null>;
  taskForm!: FormGroup;
  editMode: boolean = false;

  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder, // Впроваджуємо конструктор форм
    public dialogRef: MatDialogRef<TaskFormComponent>,
  ) {}

  ngOnInit(): void {
    // Отримуємо потік обраного завдання із Store
    this.selectedTask$ = this.store.select(TaskSelectors.selectSelectedTask);

    // Ініціалізація форми через FormBuilder
    this.taskForm = this.fb.group({
      id: [''],
      title: ['', Validators.required],
      description: ['', TaskFormValidator.forbiddenWordsValidator(['React', 'Vue'])],
      dueDate: ['', [Validators.required, TaskFormValidator.dateValidator]],
      assignee: ['', Validators.required],
      status: [TaskStatus.TODO, Validators.required]
    });

    // Підписка на зміни обраного завдання для заповнення форми
    this.selectedTask$.pipe(takeUntil(this.destroy$)).subscribe((task) => {
      if (task) {
        this.taskForm.patchValue(task);
        this.editMode = true;
      } else {
        this.taskForm.reset({ status: TaskStatus.TODO });
        this.editMode = false;
      }
    });
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      if (this.editMode) {
        // Оновлення через Store
        this.store.dispatch(TaskActions.updateTask({ task: { ...this.taskForm.value } }));
      } else {
        // Створення через Store
        this.store.dispatch(TaskActions.createTask({ task: { ...this.taskForm.value } }));
      }
      
      // Скидаємо вибір у стейті та закриваємо вікно
      this.store.dispatch(TaskActions.selectTask({ id: null }));
      this.dialogRef.close();
    }
  }

  ngOnDestroy() {
    // При закритті обов'язково очищуємо вибране завдання та відписуємось
    this.store.dispatch(TaskActions.selectTask({ id: null }));
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected readonly TaskStatus = TaskStatus;
}
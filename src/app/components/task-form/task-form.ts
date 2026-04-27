import { Component, OnInit, OnDestroy } from '@angular/core'; 
import { FormGroup, FormControl, Validators } from '@angular/forms'; 
import { Subject } from 'rxjs'; 
import { takeUntil } from 'rxjs/operators'; 
import { MatDialogRef } from '@angular/material/dialog'; 

import { Task } from '../../core/models/task.model'; 
import { TaskStatus } from '../../core/models/status.enum'; 
import { TaskFormValidator } from '../../share/directives/task-form.validator'; 
import { TaskStateService } from '../../share/state/task-state'; 

@Component({
  selector: 'app-task-form',
  standalone: false,
  templateUrl: './task-form.html',
  styleUrl: './task-form.scss',
})
export class TaskFormComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  editMode: boolean = false;
  
  taskForm = new FormGroup({
    id: new FormControl(''),
    title: new FormControl('', Validators.required),
    description: new FormControl('', TaskFormValidator.forbiddenWordsValidator(['React', 'Vue'])),
    dueDate: new FormControl('', [Validators.required, TaskFormValidator.dateValidator]),
    assignee: new FormControl('', Validators.required),
    status: new FormControl<TaskStatus>(TaskStatus.TODO, Validators.required),
  });

  protected readonly TaskStatus = TaskStatus;

  constructor(
    private taskStateService: TaskStateService,
    public dialogRef: MatDialogRef<TaskFormComponent>,
  ) {}

  ngOnInit(): void {
    this.taskStateService.selectedTask$
      .pipe(takeUntil(this.destroy$))
      .subscribe((task) => {
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
      // Отримуємо чисті дані з форми
      const rawValues = this.taskForm.getRawValue();

      if (this.editMode) {
        // При оновленні ID обов'язковий
        this.taskStateService.updateTask(rawValues as Task);
      } else {
        // ПРИ СТВОРЕННІ: видаляємо поле id, щоб не було помилки 400 на сервері
        const { id, ...newTaskData } = rawValues;
        this.taskStateService.createTask(newTaskData as unknown as Task);
      }
      
      this.taskStateService.selectTask(null);
      this.dialogRef.close();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
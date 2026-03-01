import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms'; 
import { Task } from '../../core/models/task.model'; 
import { TaskStatus } from '../../core/models/status.enum'; 
import { TaskFormValidator } from '../../share/directives/task-form.validator'; 

@Component({
  selector: 'app-task-form',
  standalone: false,
  templateUrl: './task-form.html',
  styleUrl: './task-form.scss',
})
export class TaskFormComponent implements OnInit, OnChanges {
  @Output() taskAdd = new EventEmitter<Task>();
  @Input() editTask: Task | null = null;

  taskForm = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', TaskFormValidator.forbiddenWordsValidator(['React', 'Vue'])),
    dueDate: new FormControl('', [Validators.required, TaskFormValidator.dateValidator]),
    assignee: new FormControl('', Validators.required),
    status: new FormControl(TaskStatus.TODO, Validators.required),
  });

  protected readonly TaskStatus = TaskStatus;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editTask'] && this.editTask) {
      this.taskForm.patchValue({
        ...this.editTask,
        dueDate: this.editTask.dueDate.toISOString().split("T")[0]
      });
    }
  }

  ngOnInit(): void {
  }

  addTask(): void {
    if (this.taskForm.valid) {
      const formValue = this.taskForm.value;
      
      let taskData = {
        ...formValue,
        dueDate: formValue.dueDate ? new Date(formValue.dueDate) : new Date(),
        id: this.editTask ? this.editTask.id : undefined,
      };
      
      this.taskAdd.emit(taskData as Task); 
      this.taskForm.reset({ status: TaskStatus.TODO }); 
    }
  }
}
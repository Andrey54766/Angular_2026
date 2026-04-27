import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { TaskListComponent } from './components/task-list/task-list'; 
import { TaskItemComponent } from './components/task-item/task-item';
import { TaskFormComponent } from './components/task-form/task-form';
import { StatusFilterPipe } from './share/pipes/status-filter-pipe';
import { provideHttpClient, withInterceptorsFromDi, withFetch } from '@angular/common/http';
import { TaskStatusPipe } from './share/pipes/task-status-pipe';

// Імпорти Angular Material
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
// 1. ДОДАНО: Модуль для спінера
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; 

@NgModule({
  declarations: [
    App,
    TaskListComponent, 
    TaskItemComponent,
    TaskFormComponent,
    StatusFilterPipe,
    TaskStatusPipe,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,         
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    MatSnackBarModule,
    // 2. ДОДАНО СЮДИ
    MatProgressSpinnerModule 
  ],
  providers: [
    provideHttpClient(
      withInterceptorsFromDi(),
      withFetch() 
    ),
  ],
  bootstrap: [App]
})
export class AppModule { }
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { TaskListComponent } from './components/task-list/task-list'; 
import { TaskItemComponent } from './components/task-item/task-item';
import { TaskFormComponent } from './components/task-form/task-form';
import { StatusFilterPipe } from './share/pipes/status-filter-pipe';
// 1. Додано withFetch в імпорт
import { provideHttpClient, withInterceptorsFromDi, withFetch } from '@angular/common/http';
import { TaskStatusPipe } from './share/pipes/task-status-pipe';


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
    AppRoutingModule,
    FormsModule,         
    ReactiveFormsModule   
  ],
  providers: [
    // 2. Оновлено конфігурацію HttpClient
    provideHttpClient(
      withInterceptorsFromDi(),
      withFetch() // Додано для прибирання попередження NG02801
    ),
  ],
  bootstrap: [App]
})
export class AppModule { }
// import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
// import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';

// import { AppRoutingModule } from './app-routing-module';
// import { App } from './app';
// import { TaskList } from './components/task-list/task-list';
// import { TaskItem } from './components/task-item/task-item';

// @NgModule({
//   declarations: [
//     App,
//     TaskList,
//     TaskItem
//   ],
//   imports: [
//     BrowserModule,
//     AppRoutingModule
//   ],
//   providers: [
//     provideBrowserGlobalErrorListeners(),
//     provideClientHydration(withEventReplay()),
//   ],
//   bootstrap: [App]
// })
// export class AppModule { }



import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // 1. ДОДАНО ReactiveFormsModule
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { TaskListComponent } from './components/task-list/task-list'; 
import { TaskItemComponent } from './components/task-item/task-item';
import { TaskFormComponent } from './components/task-form/task-form';
import { StatusFilterPipe } from './share/pipes/status-filter-pipe';

@NgModule({
  declarations: [
    App,
    TaskListComponent, 
    TaskItemComponent,
    TaskFormComponent,
    StatusFilterPipe
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    FormsModule,          // Для звичайних форм (якщо ще десь використовуються)
    ReactiveFormsModule   // 2. ОБОВ'ЯЗКОВО ДОДАЙТЕ СЮДИ для [formGroup]
  ],
  providers: [],
  bootstrap: [App]
})
export class AppModule { }
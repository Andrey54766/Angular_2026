


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
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http'


@NgModule({
  declarations: [
    App,
    TaskListComponent, 
    TaskItemComponent,
    TaskFormComponent,
    StatusFilterPipe,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,         
    ReactiveFormsModule   
    
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
  ],

  bootstrap: [App]
})
export class AppModule { }
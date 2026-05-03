import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi, withFetch } from '@angular/common/http';

// Material
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';

// NgRx
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreRouterConnectingModule, routerReducer } from '@ngrx/router-store';

// Мої файли
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { TaskListComponent } from './components/task-list/task-list'; 
import { TaskItemComponent } from './components/task-item/task-item';
import { TaskFormComponent } from './components/task-form/task-form';
// ВИПРАВЛЕНО: імпортуємо TaskStatsComponent замість TaskStats
import { TaskStatsComponent } from './components/task-stats/task-stats'; 
import { PageNotFound } from './components/page-not-found/page-not-found';
import { StatusFilterPipe } from './share/pipes/status-filter-pipe';
import { TaskStatusPipe } from './share/pipes/task-status-pipe';
import { taskReducer } from './store/task/task.reducer';
import { TaskEffects } from './store/task/task.effects';

@NgModule({
  declarations: [
    App,
    TaskListComponent, 
    TaskItemComponent,
    TaskFormComponent,
    TaskStatsComponent, // ВИПРАВЛЕНО ТУТ
    PageNotFound,
    StatusFilterPipe,
    TaskStatusPipe,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
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
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatChipsModule,
    MatTableModule,      
    MatPaginatorModule,  
    StoreModule.forRoot({ tasks: taskReducer, router: routerReducer }),
    EffectsModule.forRoot([TaskEffects]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
    StoreRouterConnectingModule.forRoot(),
  ],
  providers: [provideHttpClient(withInterceptorsFromDi(), withFetch())],
  bootstrap: [App]
})
export class AppModule { }
import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi, withFetch } from '@angular/common/http';

// Імпорти Angular Material
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// NgRx
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

// Компоненти та інше
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { TaskListComponent } from './components/task-list/task-list'; 
import { TaskItemComponent } from './components/task-item/task-item';
import { TaskFormComponent } from './components/task-form/task-form';
import { StatusFilterPipe } from './share/pipes/status-filter-pipe';
import { TaskStatusPipe } from './share/pipes/task-status-pipe';

// NgRx файли (перевірте шляхи)
import { taskReducer } from './store/task/task.reducer';
import { TaskEffects } from './store/task/task.effects';

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
    CommonModule,         // Потрібно для пайпа async
    AppRoutingModule,
    FormsModule,         
    ReactiveFormsModule,  // Потрібно для [formControl]
    
    // Material модулі
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,

    // NgRx реєстрація
    StoreModule.forRoot({ tasks: taskReducer }),
    EffectsModule.forRoot([TaskEffects]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() })
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
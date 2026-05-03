import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskListComponent } from './components/task-list/task-list';
// ВИПРАВЛЕНО: Змінюємо TaskStats на TaskStatsComponent
import { TaskStatsComponent } from './components/task-stats/task-stats'; 
import { TaskItemComponent } from './components/task-item/task-item';
import { PageNotFound } from './components/page-not-found/page-not-found';

const routes: Routes = [
  { path: '', redirectTo: '/(primary:tasks//aside:stats)', pathMatch: 'full' },
  { path: 'tasks', component: TaskListComponent },
  // ВИПРАВЛЕНО ТУТ:
  { path: 'stats', component: TaskStatsComponent, outlet: 'aside' }, 
  { path: 'tasks/view/:id', component: TaskItemComponent },
  { path: '**', component: PageNotFound }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
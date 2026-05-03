import { Component, OnInit } from '@angular/core'; // Додано OnInit
import { Observable } from 'rxjs'; // Додано Observable
import { Store } from '@ngrx/store'; // Додано Store
import { AppState } from '../../store/app.state'; // Перевір шлях
import { TaskStatus } from '../../core/models/status.enum';
import { selectTaskTotal, selectTasksByStatus } from '../../store/task/task.selectors';

@Component({
  selector: 'app-task-stats',
  standalone: false,
  templateUrl: './task-stats.html',
  styleUrl: './task-stats.scss',
})
export class TaskStatsComponent implements OnInit {

  total$!: Observable<number>;
  countTodo$!: Observable<number>;
  countInProgress$!: Observable<number>;
  countDone$!: Observable<number>;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    // Підписуємося на загальну кількість завдань
    this.total$ = this.store.select(selectTaskTotal);

    // Підписуємося на лічильники за кожним статусом окремо
    this.countTodo$ = this.store.select(selectTasksByStatus(TaskStatus.TODO));
    this.countInProgress$ = this.store.select(selectTasksByStatus(TaskStatus.IN_PROGRESS));
    this.countDone$ = this.store.select(selectTasksByStatus(TaskStatus.DONE));
  }
}
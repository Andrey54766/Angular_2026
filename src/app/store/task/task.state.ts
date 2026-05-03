import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { Task } from "../../core/models/task.model";

export interface TaskState extends EntityState<Task> {
  total: number; // Типізуємо як number
  loading: boolean;
  error: string | null;
  selectedTaskId: string | null;
  filterStatus: string;
}

export const taskAdapter: EntityAdapter<Task> = createEntityAdapter<Task>({
  selectId: (task: Task) => task.id
});

export const initialTaskState: TaskState = taskAdapter.getInitialState({
    loading: false,
    error: null,
    selectedTaskId: null,
    filterStatus: '',
    total: 0 // ОБОВ'ЯЗКОВО: ініціалізуємо total
});
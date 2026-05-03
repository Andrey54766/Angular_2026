import { createFeatureSelector, createSelector } from "@ngrx/store";
import { TaskState, taskAdapter } from './task.state';
import { Task } from "../../core/models/task.model";
import { TaskStatus } from "../../core/models/status.enum";


export const selectTaskState = createFeatureSelector<TaskState>('tasks');

const { selectAll, selectEntities } = taskAdapter.getSelectors(selectTaskState);

export const selectAllTasks = selectAll;
export const selectTaskEntities = selectEntities;

export const selectTaskTotal = createSelector(
    selectTaskState,
    (state: TaskState) => state.total
);

export const selectTaskLoading = createSelector(
    selectTaskState,
    (state: TaskState) => state.loading
);

export const selectTaskError = createSelector(
    selectTaskState,
    (state: TaskState) => state.error
);

export const selectSelectedTaskId = createSelector(
    selectTaskState,
    (state: TaskState) => state.selectedTaskId
);

export const selectSelectedTask = createSelector(
    selectTaskEntities,
    selectSelectedTaskId,
    (entities, selectedId) => selectedId ? entities[selectedId] ?? null : null
);

export const selectFilterStatus = createSelector(
    selectTaskState,
    (state: TaskState) => state.filterStatus
);

export const selectFilteredTasks = selectAllTasks; // Оскільки фільтруємо на сервері

export const selectTaskById = (id: string) => createSelector(
    selectAllTasks,
    (tasks: Task[]) => tasks.find(t => t.id === id) ?? null
);

export const selectTasksByStatus = (status: TaskStatus) => createSelector(
  selectAllTasks,
  (tasks: Task[]) => {
    // Повертаємо кількість завдань, що відповідають обраному статусу
    return tasks.filter(task => task.status === status).length;
  }
);
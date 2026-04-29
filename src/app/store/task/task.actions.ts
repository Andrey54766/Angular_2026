import { createAction, props } from '@ngrx/store'; // ДОДАНО: без цього файл не працює
import { TaskStatus } from '../../core/models/status.enum';
import { Task } from '../../core/models/task.model';

// ВИПРАВЛЕНО: const loadTasks замість constLoadTasks
// ВИПРАВЛЕНО: '[Task] Load All' замість '[Task' Load All'
// ВИПРАВЛЕНО: додано дужки () в кінці props
export const loadTasks = createAction(
    '[Task] Load All',
    props<{ status?: TaskStatus }>() // Зроблено статус необов'язковим
);

export const loadTasksSuccess = createAction(
    '[Task] Load All Success',
    props<{ tasks: Task[] }>()
);

// ВИПРАВЛЕНО: loadTasksFailure замість loadTaskFailure (щоб було однаково скрізь)
export const loadTasksFailure = createAction(
    '[Task] Load All Failure',
    props<{ error: string }>()
);

export const createTask = createAction(
    '[Task] Create',
    props<{ task: Task }>()
);

export const createTaskSuccess = createAction(
    '[Task] Create Success',
    props<{ task: Task }>()
);

export const createTaskFailure = createAction(
    '[Task] Create Failure',
    props<{ error: string }>()
);

export const updateTask = createAction(
    '[Task] Update',
    props<{ task: Task }>()
);

export const updateTaskSuccess = createAction(
    '[Task] Update Success',
    props<{ task: Task }>()
);

export const updateTaskFailure = createAction (
    '[Task] Update Failure',
    props<{ error: string }>()
);

export const patchTask = createAction(
    '[Task] Patch',
    props<{ id: string, changes: Partial<Task> }>()
);

export const patchTaskSuccess = createAction(
    '[Task] Patch Success',
    props<{ task: Task }>()
);

export const patchTaskFailure = createAction (
    '[Task] Patch Failure',
    props<{ error: string }>()
);

export const deleteTask = createAction(
    '[Task] Delete',
    props<{ id: string }>()
);

export const deleteTaskSuccess = createAction(
    '[Task] Delete Success',
    props<{ id: string }>()
);

export const deleteTaskFailure = createAction(
    '[Task] Delete Failure',
    props<{ error: string }>()
);

export const selectTask = createAction(
    '[Task] Select',
    props<{ id: string | null }>() // ВИПРАВЛЕНО: додано | null для можливості скидання вибору
);

export const setFilterStatus = createAction(
    '[Task] Set Filter Status',
    props<{ status: string }>()
);
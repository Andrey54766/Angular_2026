import { createReducer, on } from "@ngrx/store";
import { TaskState, initialTaskState, taskAdapter } from "./task.state"; 
import * as TaskActions from "./task.actions";

export const taskReducer = createReducer(
    initialTaskState,

    on(TaskActions.loadTasks, (state) => ({ ...state, loading: true, error: null })),

    on(TaskActions.loadTasksSuccess, (state, { tasks, total }) =>
        taskAdapter.setAll(tasks, { ...state, total, loading: false })
    ),

    on(TaskActions.loadTasksFailure, (state, { error }) => ({ ...state, loading: false, error })),

    on(TaskActions.createTask, (state) => ({ ...state, loading: true })),
    on(TaskActions.createTaskSuccess, (state, { task }) =>
        taskAdapter.addOne(task, { ...state, loading: false })
    ),
    on(TaskActions.createTaskFailure, (state, { error }) => ({ ...state, loading: false, error })),

    on(TaskActions.updateTask, (state) => ({ ...state, loading: true })),
    on(TaskActions.updateTaskSuccess, (state, { task }) =>
        taskAdapter.updateOne({ id: task.id, changes: task }, { ...state, loading: false })
    ),

    on(TaskActions.patchTask, (state) => ({ ...state, loading: true })),
    on(TaskActions.patchTaskSuccess, (state, { task }) =>
        taskAdapter.updateOne({ id: task.id, changes: task }, { ...state, loading: false })
    ),

    on(TaskActions.deleteTask, (state) => ({ ...state, loading: true })),
    on(TaskActions.deleteTaskSuccess, (state, { id, total }) =>
        taskAdapter.removeOne(id, { ...state, total, loading: false })
    ),

    on(TaskActions.selectTask, (state, { id }) => ({ ...state, selectedTaskId: id })),
    on(TaskActions.setFilterStatus, (state, { status }) => ({ ...state, filterStatus: status }))
);
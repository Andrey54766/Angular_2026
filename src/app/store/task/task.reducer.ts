import { createReducer, on } from "@ngrx/store";
// ВИПРАВЛЕНО: initialTaskState замість initialState
import { TaskState, initialTaskState, taskAdapter } from "./task.state"; 
import * as TaskActions from "./task.actions";

export const taskReducer = createReducer(
    initialTaskState, // ВИПРАВЛЕНО

    on(TaskActions.loadTasks, (state: TaskState) => ({
        ...state,
        loading: true,
        error: null
    })),

    on(TaskActions.loadTasksSuccess, (state: TaskState, { tasks }) =>
        taskAdapter.setAll(tasks, {
            ...state,
            loading: false,
            error: null
        })
    ),

    on(TaskActions.loadTasksFailure, (state: TaskState, { error }) => ({
        ...state,
        loading: false,
        error
    })),

    on(TaskActions.createTask, (state: TaskState) => ({
        ...state,
        loading: true
    })),

    on(TaskActions.createTaskSuccess, (state: TaskState, { task }) =>
        taskAdapter.addOne(task, {
            ...state,
            loading: false
        })
    ),

    on(TaskActions.createTaskFailure, (state: TaskState, { error }) => ({
        ...state,
        loading: false,
        error
    })),

    on(TaskActions.updateTask, (state: TaskState) => ({
        ...state,
        loading: true,
    })),

    on(TaskActions.updateTaskSuccess, (state: TaskState, { task }) =>
        taskAdapter.updateOne({ id: task.id, changes: task }, {
            ...state,
            loading: false
        })
    ),

    on(TaskActions.updateTaskFailure, (state: TaskState, { error }) => ({
        ...state,
        loading: false,
        error
    })),

    on(TaskActions.patchTask, (state: TaskState) => ({
        ...state,
        loading: true,
    })),

    on(TaskActions.patchTaskSuccess, (state: TaskState, { task }) =>
        taskAdapter.updateOne({ id: task.id, changes: task }, {
            ...state,
            loading: false
        })
    ),

    on(TaskActions.patchTaskFailure, (state: TaskState, { error }) => ({
        ...state,
        loading: false,
        error
    })),

    on(TaskActions.deleteTask, (state: TaskState) => ({
        ...state,
        loading: true
    })),

    on(TaskActions.deleteTaskSuccess, (state: TaskState, { id }) =>
        taskAdapter.removeOne(id, {
            ...state,
            loading: false
        })
    ),

    on(TaskActions.deleteTaskFailure, (state: TaskState, { error }) => ({
        ...state,
        loading: false,
        error
    })),

    on(TaskActions.selectTask, (state: TaskState, { id }) => ({
        ...state,
        selectedTaskId: id
    })),

    on(TaskActions.setFilterStatus, (state: TaskState, { status }) => ({
        ...state,
        filterStatus: status
    }))
);
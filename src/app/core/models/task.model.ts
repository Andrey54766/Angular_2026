import { TaskStatus } from  './status.enum'

export interface Task {
    id: number;
    title: string;
    description?: string;
    assignee: string;
    dueDate: Date;
    status: TaskStatus;
}
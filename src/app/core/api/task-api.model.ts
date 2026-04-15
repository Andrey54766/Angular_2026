export interface TaskApi {
  _id: string;
  title: string;
  description?: string;
  assignee: string;
  dueDate: string;
  status: string;
}
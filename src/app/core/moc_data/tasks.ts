import {Task} from '../models/task.model';
import {TaskStatus} from '../models/status.enum'

export const tasks: Task[] = [
    {
        id: 0,
        title: 'Встановити Angular',
        assignee: 'Андрій',
        dueDate: new Date ('2026-03-05'),
        status: TaskStatus.DONE    
    },
    {
        id: 1,
        title: ' Ознайомитися з компонентами',
        description: 'Ознайомитися з компонентами та оглянути взаємодію між ними',
        assignee: 'Андрій',
        dueDate: new Date ('2026-03-06'),
        status: TaskStatus.IN_PROGRESS

        },

        {
        id: 2,
        title: ' Ознайомитися з Control Flow',
        description: 'Ознайомитися з старим і новим підзодами до Control Flow',
        assignee: 'Андрій',
        dueDate: new Date('2026-02-10'),
        status: TaskStatus.DONE
        },
];
const TaskStatus = require("../constants/taskStatus");

const tasks = [
    {
        id: 1,
        title: 'Встановити Angular',
        assignee: 'Андрій',
        dueDate: new Date('2026-03-19'),
        status: TaskStatus.DONE
    },
];


module.exports = { tasks };
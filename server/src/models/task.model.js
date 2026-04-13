const mongoose = require('mongoose');
const TaskStatus = require("../constants/taskStatus");

const TaskSchema = new mongoose.Schema({
    title: { type: String, trim: true, required: true, minlength: 3, maxlength: 100 },
    description: { type: String, trim: true, default: "" },
    assignee: { type: String, required: true },
    dueDate: { type: Date, required: true },
    status: { type: String, enum: Object.values(TaskStatus), default: TaskStatus.TODO }
}, { timestamps: true });

// Додаємо глобальне налаштування toJSON (яке ви вже маєте)
TaskSchema.set('toJSON', {
    transform: function (doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;

        if (ret.dueDate) {
            ret.dueDate = new Date(ret.dueDate).toISOString().split('T')[0];
        }
        return ret;
    }
});

// 1. ДОДАЄМО НОВУ ФУНКЦІЮ (статичний метод)
TaskSchema.statics.toClient = (task) => {
  if (!task) return null;
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    assignee: task.assignee,
    dueDate: task.dueDate,
    status: task.status,
  };
};

// Створюємо модель
const TaskModel = mongoose.model("Task", TaskSchema);
module.exports = TaskModel;
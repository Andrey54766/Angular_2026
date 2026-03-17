const { check, validationResult } = require('express-validator');
const TaskStatus = require('../constants/taskStatus');

const ALLOWED_FIELDS = ['title', 'description', 'assignee', 'dueDate', 'status'];

// 🔹 Валідація POST та PUT (всі основні поля обов'язкові)
const validateTask = [
    check('title').notEmpty().withMessage('Поле title є обов’язковим'),
    check('assignee').notEmpty().withMessage('Поле assignee є обов’язковим'),
    check('dueDate').notEmpty().withMessage('Поле dueDate є обов’язковим').isISO8601().toDate(),
    check('status').isIn(Object.values(TaskStatus)).withMessage(`Статус має бути одним із: ${Object.values(TaskStatus).join(', ')}`),
    
    (req, res, next) => {
        const extraFields = Object.keys(req.body).filter(field => !ALLOWED_FIELDS.includes(field));
        if (extraFields.length) {
            return res.status(400).json({ error: `Зайві поля: ${extraFields.join(', ')}` });
        }
        next();
    }
];

// 🔹 Валідація PATCH (перевіряємо тільки статус, якщо він переданий)
const validateTaskPatch = [
    check('status').optional().isIn(Object.values(TaskStatus)).withMessage(`Статус має бути одним із: ${Object.values(TaskStatus).join(', ')}`),
    
    (req, res, next) => {
        const extraFields = Object.keys(req.body).filter(field => !ALLOWED_FIELDS.includes(field));
        if (extraFields.length) {
            return res.status(400).json({ error: `Зайві поля: ${extraFields.join(', ')}` });
        }
        next();
    }
];

// 🔹 Впроваджений метод handleValidationErrors (без зайвого повторного require)
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = { validateTask, validateTaskPatch, handleValidationErrors };
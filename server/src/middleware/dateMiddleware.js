// Допоміжна функція для форматування дати у рядок YYYY-MM-DD
const formatDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    return d.toISOString().split('T')[0];
};

// 1. Middleware для перетворення отриманого рядка дати в об'єкт Date
const parseDateMiddleware = (req, res, next) => {
    // Додано перевірку req.body, щоб уникнути помилок
    if (req.body && req.body.dueDate) {
        req.body.dueDate = new Date(req.body.dueDate);
    }
    next();
};

// 2. Middleware для автоматичного форматування дат у всіх відповідях сервера
// ВИПРАВЛЕНО: тепер назва збігається з експортом (велика літера D у слові Date)
const formatResponseDateMiddleware = (req, res, next) => {
    const oldJson = res.json;
    
    // Підміняємо стандартну функцію res.json на нашу
    res.json = function (data) {
        if (Array.isArray(data)) {
            // Якщо сервер повертає масив (список завдань)
            data = data.map(task => ({
                ...task,
                dueDate: task.dueDate ? formatDate(task.dueDate) : null,
            }));
        } else if (typeof data === 'object' && data !== null) {
            // Якщо сервер повертає один об'єкт (одне завдання)
            data.dueDate = data.dueDate ? formatDate(data.dueDate) : null;
        }
        
        // Викликаємо оригінальну функцію json з уже обробленими даними
        oldJson.call(this, data);
    };
    next();
};

// Експортуємо функції для використання в app.js
module.exports = { parseDateMiddleware, formatResponseDateMiddleware };
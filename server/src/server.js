const app = require('./app');
const mongoose = require('mongoose'); // Добавлено
const MONGO_URI = require('./config/db'); // Импортируем строку из db.js
require("dotenv").config();

const PORT = process.env.PORT || 3100;

// Функция подключения
const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            connectTimeoutMS: 10000,
            serverSelectionTimeoutMS: 5000,
        });
        console.log('Спроба підключення до MongoDB...');
    } catch (error) {
        console.error('Помилка під час виклику mongoose.connect:', error.message);
    }
};

// Обработчики событий базы данных
mongoose.connection.on('connected', () => {
    console.log('✅ Mongoose: успішно підключено до БД');
});

mongoose.connection.on('error', (err) => {
    console.error('❌ Mongoose: помилка з\'єднання:', err.message);
    setTimeout(connectDB, 5000);
});

mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ Mongoose: з\'єднання розірвано. Спроба відновити...');
    setTimeout(connectDB, 5000);
});

// Запуск сервера и базы
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

connectDB();

// Завершение работы
const gracefulExit = async (signal) => {
    console.log(`Отримано сигнал ${signal}, завершуємо роботу...`);
    try {
        await mongoose.connection.close();
        console.log('Відключення від MongoDB успішне');
        process.exit(0);
    } catch (error) {
        console.error('Помилка при відключенні:', error);
        process.exit(1);
    }
};

process.on('SIGINT', gracefulExit); // Исправлено (было SIGNT)
process.on('SIGTERM', gracefulExit);
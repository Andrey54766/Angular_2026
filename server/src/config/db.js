require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || '';

if (!MONGO_URI) {
    console.error('Відсутній MONGO_URI у .env файлі');
    process.exit(1);
}

// Экспортируем только строку
module.exports = MONGO_URI;
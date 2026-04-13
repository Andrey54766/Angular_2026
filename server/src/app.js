const express = require('express');
const cors = require('cors');
// Просто импортируем конфигурацию, вызывать здесь ничего не нужно
require("./config/db"); 

const taskMockRoutes = require('./routers/taskMockRoutes');
const taskRoutes = require('./routers/task.route');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/tasks', taskMockRoutes);
app.use('/api/v2/tasks', taskRoutes);

module.exports = app;
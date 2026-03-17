const express = require('express');
const cors = require('cors');

const taskMockRoutes = require('./routes/taskMockRoutes');

const {
    parseDateMiddleware,
    formatResponseDateMiddleware
} = require('./middleware/dateMiddleware');

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(parseDateMiddleware);
app.use(formatResponseDateMiddleware);

app.use('/api/v1/tasks', taskMockRoutes);

module.exports = app;
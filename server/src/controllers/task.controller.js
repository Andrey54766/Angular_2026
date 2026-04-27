const TaskModel = require('../models/task.model');

const getTasks = async (req, res) => {
    try {
        const query = req.query.status ? { status: req.query.status } : {};
        const tasks = await TaskModel.find(query).sort({ createdAt: -1 });
        res.json(tasks);
    } catch (error) {
        console.error('GET Error:', error); // Дивіться це в терміналі!
        res.status(500).json({ message: "Error retrieving tasks", error: error.message });
    }
};

const createTask = async (req, res) => {
    try {
        // Видаляємо id з фронтенду, щоб Mongo не сварився
        const body = req.body;
        delete body.id;

        const newTask = new TaskModel(body);
        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        console.error('POST Error:', error);
        res.status(400).json({ message: "Error creating task", error: error.message });
    }
};

const updateTask = async (req, res) => {
    try {
        const updated = await TaskModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updated) return res.status(404).json({ message: "Task not found" });
        res.json(updated);
    } catch (error) {
        res.status(400).json({ message: "Error updating task", error: error.message });
    }
};

const patchTask = async (req, res) => {
    try {
        const updated = await TaskModel.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true });
        if (!updated) return res.status(404).json({ message: "Task not found" });
        res.json(updated);
    } catch (error) {
        res.status(400).json({ message: "Error patching task", error: error.message });
    }
};

const deleteTask = async (req, res) => {
    try {
        const deleted = await TaskModel.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Task not found" });
        res.json({ message: "Task deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting task", error: error.message });
    }
};

module.exports = { getTasks, createTask, updateTask, patchTask, deleteTask };
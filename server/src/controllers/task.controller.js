const TaskModel = require('../models/task.model');

const getTasks = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        const filter = req.query.filter?.trim().toLowerCase() || '';
        const status = req.query.status;

        const searchQuery = filter ? {
            $or: [
                { title: { $regex: filter, $options: 'i' } },
                { description: { $regex: filter, $options: 'i' } },
                { assignee: { $regex: filter, $options: 'i' } }
            ]
        } : {};

        const statusQuery = status ? { status } : {};

        const query = { ...searchQuery, ...statusQuery };
        const [tasks, total] = await Promise.all([
            TaskModel.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
            TaskModel.countDocuments(query)
        ]);
        res.json({ tasks, total });

    } catch (error) {
        console.error('GET Error:', error);
        res.status(500).json({ message: "Error retrieving tasks", errors: error });
    }
};

const createTask = async (req, res) => {
    try {
        const body = req.body;
        delete body.id;
        const newTask = new TaskModel(body);
        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        if (error.name === "ValidationError") {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: "Validation error", errors });
        }
        res.status(400).json({ message: "Error creating task", error: error.message });
    }
};

const updateTask = async (req, res) => {
    try {
        const updatedTask = await TaskModel.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true }
        );
        if (!updatedTask) return res.status(404).json({ message: "Task not found" });
        res.json(updatedTask);
    } catch (error) {
        res.status(400).json({ message: "Error updating task", error: error.message });
    }
};

const patchTask = async (req, res) => {
    try {
        const updatedTask = await TaskModel.findByIdAndUpdate(
            req.params.id, 
            { $set: req.body }, 
            { new: true, runValidators: true }
        );
        if (!updatedTask) return res.status(404).json({ message: "Task not found" });
        res.json(updatedTask);
    } catch (error) {
        res.status(400).json({ message: "Error partially updating task", error: error.message });
    }
};

const deleteTask = async (req, res) => {
    try {
        const deletedTask = await TaskModel.findByIdAndDelete(req.params.id);

        if (!deletedTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        const total = await TaskModel.countDocuments();
        res.json({ message: "Task deleted", total });
    } catch (error) {
        res.status(500).json({ message: "Error deleting task", errors: error });
    }
};

module.exports = { getTasks, createTask, updateTask, patchTask, deleteTask };
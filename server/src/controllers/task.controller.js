const TaskModel = require('../models/task.model');

const getTasks = async (req, res) => {
    try {
        let query = {};

        if (req.query.status) {
            query.status = req.query.status;
        }

        let taskQuery = TaskModel.find(query);

        const tasks = await taskQuery;
        res.json(tasks);
    }   catch (error) {
        res.status(500).json({ message: "Error retrieving tasks", error });
    }
};


const createTask = async (req, res) => {
    try {
        const newTask = new TaskModel(req.body);
        await newTask.save();
        res.status(201).json(newTask);
    }   catch (error) {
        if (error.name === "ValidationError") {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: "Validation error", errors});
        }
        if (error.code === 11000) {
            return res.status(400).json({ message: "Task already exits"});

        }
        res.status(400).json({ message: "Error creating task", error});
    }
};



const updateTask = async (req, res) => {
    try {
        const updatedTask = await TaskModel.findOneAndReplace(
            {'_id': req.params.id},
            req.body,
            { new: true, runValidators:true }

        );

        if (!updatedTask) {
            return res.status(404).json({ message: "Task not found "});

        }

        res.json(updatedTask);
    } catch (error) {
        if (error.name === "ValidationError") {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: "Validation error", errors});
        }
        if (error.code === 11000) {
            return res.status(400).json({ message: "Task already exits"});

        }
        res.status(400).json({ message: "Error updating task", error});
    }
};


const patchTask = async (req, res) => {
    try {
        const updatedTask = await TaskModel.findByIdAndUpdate(
            req.params.id,
            req.bosy,
            { new: true, runValidators:true }
        );

        if (!updatedTask) return res.status(404).json({ message: "Task not found"});

        res.json(updatedTask);
    } catch (error) {
        if (error.name === "ValidationError") {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: "Validation error", errors });
        }
        if (error.code === 11000) {
            return res.status(400).json({ message: "Task already exits"});
        }
        res.status(400).json({ message: "Error partially updating task", error});
    }
};


const deleteTask = async (req, res) => {
    try {
        const deletedTask = await TaskModel.findByIdAndDelete(req.params.id);

        if (!deletedTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json({ message: "Task deleted" });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting task", error: error.message });
    }
};


module.exports = { getTasks, createTask, updateTask, patchTask, deleteTask};
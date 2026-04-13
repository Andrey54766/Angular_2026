const express = require('express');
const router = express.Router();

const taskController = require('../controllers/task.controller');

const {
    validateTask,
    validateTaskPatch,
    handleValidationErrors
} = require('../validators/taskValidator');

router.get('/', taskController.getTasks);

// ИСПРАВЛЕНО: handleValidationErrors с большой 'V'
router.post('/', validateTask, handleValidationErrors, taskController.createTask); 
router.put('/:id', validateTask, handleValidationErrors, taskController.updateTask);
router.patch('/:id', validateTaskPatch, handleValidationErrors, taskController.patchTask);

// ИСПРАВЛЕНО: добавлено двоеточие '/:id' и исправлено название 'deleteTask'
router.delete('/:id', taskController.deleteTask);

module.exports = router;
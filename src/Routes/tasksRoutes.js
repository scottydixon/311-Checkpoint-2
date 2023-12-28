
const express = require('express');
const router = express.Router();
const tasksController = require('../controllers/tasksController');
const authMiddleware = require('../middlewares/authMiddleware');

// Task routes
router.post('/tasks', authMiddleware.authenticateToken, tasksController.createTask);
router.get('/tasks', authMiddleware.authenticateToken, tasksController.getTasks);
router.put('/tasks', authMiddleware.authenticateToken, tasksController.updateTask);
router.delete('/tasks', authMiddleware.authenticateToken, tasksController.deleteTask);

module.exports = router;

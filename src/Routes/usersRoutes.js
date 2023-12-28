
const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const authMiddleware = require('../middlewares/authMiddleware');

// User routes
router.post('/users', usersController.createUser);
router.get('/users', authMiddleware.authenticateToken, usersController.getUser);
router.put('/users', authMiddleware.authenticateToken, usersController.updateUser);
router.delete('/users', authMiddleware.authenticateToken, usersController.deleteUser);

module.exports = router;

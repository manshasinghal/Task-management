const express = require('express');
const { getTasks, createTask, updateTask, deleteTask } = require('../controllers/Taskcontroller');
const protect = require('../middleware/auth');
const authorize = require('../middleware/role');
const router = express.Router();

router.route('/')
  .get(protect, getTasks)
  .post(protect, authorize(['admin', 'manager']), createTask);

router.route('/:id')
  .put(protect, updateTask)
  .delete(protect, authorize('admin'), deleteTask);

module.exports = router;
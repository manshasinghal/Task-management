const express = require('express');
const { getUsers, updateUser, deleteUser } = require('../controllers/User');
const protect = require('../middleware/auth');
const authorize = require('../middleware/role');
const router = express.Router();

router.route('/')
  .get(protect,  authorize(['admin', 'manager']), getUsers);

router.route('/:id')
  .put(protect, authorize('admin'), updateUser)
  .delete(protect, authorize('admin'), deleteUser);

module.exports = router;